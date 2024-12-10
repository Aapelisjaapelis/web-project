import React from "react";
import "./GroupsPage.css";
import Navbar from "../components/Navbar.js"
import axios from "axios";

import { useState, useEffect } from "react";
import { useUser } from "../context/useUser.js";
import { useNavigate } from 'react-router-dom';


const url = 'http://localhost:3001'


function GroupMy () {

    const navigate = useNavigate();

    const [mygroups, setGroups] = useState([])
    const {user, updateToken} = useUser()

    useEffect(() => {
        const headers = {headers: {Authorization: "Bearer " + user.access_token}}
        axios.get(url + '/group/MyGroups/' + user.id, headers)
          .then(response => {
              setGroups(response.data)
              updateToken(response)
          }).catch(error => {
            alert(error.response.data.error ? error.response.data.error : error)
          })
        }, [])
  

    return (

    <div className="group-body">
        <Navbar/>

        <div>
        <h1 > My Groups</h1>
        <button className="info-button" onClick={e =>  navigate('/GroupsPage')}>All Groups</button>

        <table id="groupTable">
                <thead>
                    <tr>
                        <th>Ryhmän nimi</th>
                        <th>Ryhmän kuvaus</th>
                        <th></th>
                    </tr>
                </thead>
                
                <tbody>
                    {mygroups.map(mygroup => (
                        <tr key={mygroup.id}>
                            <td>{mygroup.group_name}</td>
                            <td>{mygroup.group_desc}</td>
                            <th>
                            <button 
                                    onClick={() =>  navigate('/SpecificGroupPage',{ state: mygroup})}
                                    className="info-button">
                                    View
                                </button>

                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    )
}




export default GroupMy;