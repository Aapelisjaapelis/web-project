import React, { useCallback, useState, useEffect } from "react";
import "./GroupsPage.css";
import Navbar from "../components/Navbar.js"
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser.js";

const url = process.env.REACT_APP_API_URL;
const url2 = 'https://www.finnkino.fi/xml/Schedule/?EventId=';

function SpecificGroupPage () {
    const location = useLocation();
    const navigate = useNavigate();
    const group = location.state;

    const [times, setTimes] = useState([]);
    const {user, updateToken} = useUser();
    const [isAdmin, setIsAdmin] = useState(false);


    const xmlToJson = useCallback((node) => {
        const json = {};
    
        let children = [...node.children];
    
        if (!children.length) return node.innerHTML;
    
        for (let child of children ) {
          const hasSibling = children.filter(c => c.nodeName === child.nodeName).length > 1;
    
          if (hasSibling) {
            if (json[child.nodeName] === undefined) {
              json[child.nodeName] = [xmlToJson(child)];
            } else {
              json[child.nodeName].push(xmlToJson(child));
            }
          } else {
            json[child.nodeName] = xmlToJson(child);
          }
        }
        return json;
    },[]);
    

    const parseXML = useCallback((xml) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "application/xml");
        return (xmlToJson(xmlDoc));
    },[xmlToJson]);    

    useEffect(() => {
        const headers = {headers: {Authorization: "Bearer " + user.access_token}}
        axios.get(url + '/group/GetGroupMovies/' + group.id, headers)
        .then(response => {
            setGroupShowTimes(response.data)
            isUserAdmin()
            updateToken(response)
        }).catch(error => {
        alert(error.response.data.error ? error.response.data.error : error)
        })

        
    }, [])


    const setGroupShowTimes = async(databasevalues) => {
        let showtimes = [];
        if(databasevalues.length > 0){

            for (let i = 0; i < databasevalues.length; i++) {
                let match = false;
                try {

                    const response = await fetch(url2 + databasevalues[i].finnkino_movie_id);
                    const xml = await response.text();
                    const json = parseXML(xml);
                    
                    for(let j=0; j < json.Schedule.Shows.Show.length; j++) {
                    
                        if(json.Schedule.Shows.Show[j].ID == databasevalues[i].finnkino_time_id) {
                            showtimes.push({key: databasevalues[i].id,timeforfhow: json.Schedule.Shows.Show[j].dttmShowStart, placeforshow: json.Schedule.Shows.Show[j].TheatreAndAuditorium, name: json.Schedule.Shows.Show[j].Title})
                            match = !match;
                        }
                        if(j ==(json.Schedule.Shows.Show.length-1) && match == false){
                            showtimes.push({key: databasevalues[i].id, timeforfhow: "The showtime has ended", placeforshow: '-', name: databasevalues[i].movie_name})
                        }
                    }
                }catch(error) {
                    console.log(error);
                }

            }
        }
        else{
            showtimes.push({key: 0, timeforfhow: "Add showtimes by -", placeforshow: '', name: 'You have not added any showtimes'})
        }
        setTimes(showtimes);

    }
  
    const isUserAdmin = () => {

            axios.get(url+'/group/checkAdmin',{
                params: { id1: user.id, id2: group.id},
                headers: {Authorization: "Bearer " + user.access_token}
            })

            .then(response => {
                console.log(response.data[0].is_admin)
                updateToken(response)
                setIsAdmin(response.data[0].is_admin);
            }).catch(error => {
              alert(error.response.data.error ? error.response.data.error : error)
    
            })
    }

    const removeShowTime = (groupId, showtimeId) => {

        axios.delete(url + '/group/deleteShowtime', {
            params: { id1: groupId, id2: showtimeId },
            headers: {Authorization: "Bearer " + user.access_token}
          }
          )
          .then(response =>{
            let withoutRemoved = times.filter((time)=> time.key !==showtimeId )
            if( withoutRemoved.length === 0){
                withoutRemoved = [{key: 0, timeforfhow: "Add showtimes by -", placeforshow: '', name: 'You have not added any showtimes'}]

            }
            setTimes(withoutRemoved)
            updateToken(response)
            alert("Showtime removed succesfully!")
          }).catch(error => {
            alert(error.response.data.error ? error.response.data.error : error)
          })


    }

    const selfExit = (userId, groupId) => {

        axios.delete(url + '/group/deleteMembers', {
          params: { id1: groupId, id2: userId },
          headers: {Authorization: "Bearer " + user.access_token}
        }
        )
        .then(response =>{
            alert("You were removed succesfully!")
            navigate('/GroupsPage');
            updateToken(response)
        }).catch(error => {
            alert(error.response.data.error ? error.response.data.error : error)
        })
    }
        

    return (
    <div className="group-body">
        <Navbar/>

        <div>
        <h1 >{group?.group_name || "No name recieved"}</h1>
        <button className="info-button" onClick={e =>  navigate('/GroupsPage')}>All Groups</button>
        <button className="info-button" onClick={() =>  navigate('/GroupMy')}>My Groups</button>


        <table id="groupTable">
                <thead>
                    <tr >
                        <th>Movie name</th>
                        <th>Showtime</th>
                        <th>Place</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {times.map(time => (

                        <tr key={time.key}>
                        
                            <td data-label="Movie name" >{time.name}</td>
                            <td data-label="Showtime">{time.timeforfhow}</td>
                            <td data-label="Place">{time.placeforshow}</td>
                            {time.key === 0 ?(
                                <td>
                                </td>
                                ) :(
                                <td>
                                    <button onClick={e => removeShowTime(group.id, time.key)}>
                                    Remove
                                    </button>
                                </td>
                            )}
                            
                        </tr>
                    ))}
                  
                </tbody>
            </table>
            
            <button 
            onClick={() =>  navigate('/GroupAddShowtimes',{ state: group})}
            className="info-button">
                Add showtimes
            </button>

            {isAdmin === true ? (
                <button 
                    onClick={() =>  navigate('/GroupMembers',{ state: group})}
                    className="info-button">
                    Group settings
                </button>
                ) : (
                    <button
                        onClick={() => selfExit(user.id, group.id)}
                        className="info-button">
                        Leave group
                    </button>

            )}

        </div>
    </div>
    )
}



export default SpecificGroupPage;