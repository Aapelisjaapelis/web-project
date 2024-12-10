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
            eioovalia(response.data)
            updateToken(response)
        }).catch(error => {
        alert(error.response.data.error ? error.response.data.error : error)
        })
        
    }, [])


    const eioovalia = (databasevalues) => {
        let showtimes = [];
        

        for (let i = 0; i < databasevalues.length; i++) {
            fetch(url2 + databasevalues[i].finnkino_movie_id)
            .then(response => response.text())
            .then(xml => {
                const json = parseXML(xml);
                
                for(let j=0; j < json.Schedule.Shows.Show.length; j++) {


                    if(json.Schedule.Shows.Show[j].ID == databasevalues[i].finnkino_time_id) {
                        showtimes = {timeforfhow: json.Schedule.Shows.Show[j].dttmShowStart, placeforshow: json.Schedule.Shows.Show[j].TheatreAndAuditorium, name: json.Schedule.Shows.Show[j].Title}
                        console.log("2"+showtimes);
                        console.log("i="+i)
                        console.log("j="+j)

                        if(i >= (databasevalues.length-1) && j >= (json.Schedule.Shows.Show.length-1)){
                            console.log("3"+showtimes);
                            setTimes(showtimes);
                        }

                    }
                    console.log("1"+showtimes);

                }
            })

            .catch(error => {
            console.log(error);
            })


        }
        console.log("3"+showtimes);

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
                onClick={() =>  navigate('/GroupMembers',{ state: group})}
                className="info-button">
                Show members
                </button>

        </div>
    </div>
    )
}



export default SpecificGroupPage;