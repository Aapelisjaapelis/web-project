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
        <div className="littleInfo">
            <p>Here are all your groups. To see more info, click view.</p>
        </div>
        <button className="info-button" onClick={e =>  navigate('/GroupsPage')}>All Groups</button>

        <table id="groupTable">
                <thead>
                    <tr>
                        <th>Group name</th>
                        <th>Group description</th>
                        <th></th>
                    </tr>
                </thead>
                
                <tbody>
                    {mygroups.map(mygroup => (
                        <tr key={mygroup.id}>
                            <td data-label="Group name" >{mygroup.group_name}</td>
                            {mygroup.group_desc === '' ? (
                                <td data-label="Group desc" >No desc</td>

                            ) : (
                                <td data-label="Group desc" >{mygroup.group_desc}</td>
                            )}

                            <td>
                            <button 
                                    onClick={() =>  navigate('/SpecificGroupPage',{ state: mygroup})}
                                    className="tablebutton">
                                    View
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    )
}




export default GroupMy;