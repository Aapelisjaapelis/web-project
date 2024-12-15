import React from "react";
import "./GroupsPage.css";
import Navbar from "../components/Navbar.js";
import axios from "axios";

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';



import { useUser } from "../context/useUser.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const url = process.env.REACT_APP_API_URL


function GroupsPage () {

    const navigate = useNavigate();

    const {user, updateToken} = useUser();
    const [groups, setGroups] = useState([])


    useEffect(() => {
        const headers = {headers: {Authorization: "Bearer " + user.access_token}}
        axios.get(url+'/group/getGroups', headers)
        .then(response => {
            setGroups(response.data)
            updateToken(response)
        }).catch(error => {
          alert(error.response.data.error ? error.response.data.error : error)
        })
      }, [])


const reloadPage = () => {
    const headers = {headers: {Authorization: "Bearer " + user.access_token}}
    axios.get(url+'/group/getGroups', headers)
    .then(response => {
        setGroups(response.data)
        updateToken(response)
    }).catch(error => {
      alert(error.response.data.error ? error.response.data.error : error)
    })

}

      
const handleCreateClick = (close) => {

    const newGroup = document.getElementById('newGroup').value
    const newDesc = document.getElementById('newDesc').value


    if (newGroup === null || newGroup === "") {
        alert("Group name is insufficient");
    } else {
        const headers = {headers: {Authorization: "Bearer " + user.access_token}}
        axios.post(url+'/group/createGroup',{
            id1: newGroup, 
            id2: newDesc, 
            id3: user.id 

        }, headers)
        .then(response => {
            reloadPage()

            close();

            updateToken(response)

            
            alert("You have succesfully created a New group "+newGroup)
        }).catch(error => {
          alert("Something went wrong")
          alert(error.response.data.error ? error.response.data.error : error)

        })
    }
    };

    
const handleButtonClick = (groupId) => {
    const headers = {headers: {Authorization: "Bearer " + user.access_token}}

    axios.post(url+'/group/joinGroup',{
        id1: user.id,
        id2: groupId
    }, headers)
    .then(response => {
        alert(`Group join request sent!`);
    }).catch(error => {
      alert(error.response.data.error ? error.response.data.error : error)
    })

};

    return (
    <>
    <Navbar/>
    <div className="group-body" >
        <div>
        <h1 >All Groups</h1>
        <div className="littleInfo">
            <p>To join group click join. My groups page has your groups.</p>
        </div>
        <button className="myGroupsButton" onClick={e =>  navigate('/GroupMy')}>My Groups</button>
        <Popup trigger=

                {<button class="createButton">
                    <span class="button-bg">
                        <span class="button-bg-layers">
                            <span class="button-bg-layer button-bg-layer-1 -purple"></span>
                            <span class="button-bg-layer button-bg-layer-2 -turquoise"></span>
                            <span class="button-bg-layer button-bg-layer-3 -yellow"></span>
                        </span>
                    </span>
                    <span class="button-inner">
                        <span class="button-inner-static">Create group</span>
                        <span class="button-inner-hover">Create group</span>
                    </span>
                </button>}

        modal nested
        
        >
        {
                    close => (
                        <div className='popup'>
                            <div className='content'>
                            <h2 className="header-container ">Create group</h2>

                                <form className="popupform">
                                    <label for="newGroup">Please enter Group Name:</label>
                                    <br/>
                                    <input className="input" type="text" id="newGroup" name="newGroup"/><br/>
                                    <label for="newDesc">Please enter a description for the group:</label><br/>
                                    <input  className="input" type="text" id="newDesc" name="newDesc" /><br/><br/>
                                   
                                </form> 

                                <div>
                                
                                    <button className="popupbutton" onClick={e => handleCreateClick(close)}>
                                            Submit
                                    </button>
                                    <button className="popupbutton" onClick={close}>
                                            Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </Popup>


        <table id="groupTable">
                <thead>
                    <tr>
                        <th>Group name</th>
                        <th>Group description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map(group => (
                        <tr key={group.id}>
                            <td data-label="Group name" >{group.group_name}</td>
                            {group.group_desc === '' ? (
                                <td data-label="Group desc" >No desc</td>

                            ) : (
                                <td data-label="Group desc" >{group.group_desc}</td>
                            )}
                            <td>
                            <button 
                                    onClick={() => handleButtonClick(group.id)} 
                                    className="tablebutton">
                                    Join
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    </>
    )
}


export default GroupsPage;