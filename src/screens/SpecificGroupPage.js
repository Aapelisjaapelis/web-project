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
            updateToken(response)
        }).catch(error => {
        alert(error.response.data.error ? error.response.data.error : error)
        })
        isUserAdmin()

        
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
                            showtimes.push({timeforfhow: json.Schedule.Shows.Show[j].dttmShowStart, placeforshow: json.Schedule.Shows.Show[j].TheatreAndAuditorium, name: json.Schedule.Shows.Show[j].Title})
                            match = !match;
                        }
                        if( i==(databasevalues.length-1) && j ==(json.Schedule.Shows.Show.length-1) && match == false){
                            showtimes.push({timeforfhow: "The showtime has ended", placeforshow: '-', name: databasevalues[i].movie_name})
                        }
                    }
                }catch(error) {
                    console.log(error);
                }

            }
        }
        else{
            showtimes.push({timeforfhow: "Add showtimes by -", placeforshow: '', name: 'You have not added any showtimes'})
        }
        setTimes(showtimes);

    }
  
    const isUserAdmin = () => {
        const headers = {headers: {Authorization: "Bearer " + user.access_token}}

            axios.get(url+'/group/checkAdmin',{
                params: { id1: user.id, id2: group.id}
            })

            .then(response => {
                console.log(response.data[0].is_admin)
                setIsAdmin(response.data[0].is_admin);
            }).catch(error => {
              alert(error.response.data.error ? error.response.data.error : error)
    
            })
    }
        

    return (
    <div className="group-body">
        <Navbar/>

        <div>
        <h1 >{group?.group_name || "No name recieved"}</h1>
        <button className="info-button" onClick={e =>  window.location.href='/GroupsPage'}>All Groups</button>

        <table id="groupTable">
                <thead>
                    <tr >
                        <th>Movie name</th>
                        <th>Showtime</th>
                        <th>Place</th>
                    </tr>
                </thead>
                <tbody>
                    {times.map(time => (

                        <tr >
                        
                            <td>{time.name}</td>
                            <td>{time.timeforfhow}</td>
                            <td>{time.placeforshow}</td>
                            
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
                Show members
                </button>) : (
                    <></>
            )}

        </div>
    </div>
    )
}



export default SpecificGroupPage;