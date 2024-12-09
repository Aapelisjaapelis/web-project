import React from "react";
import "./GroupsPage.css";
import Navbar from "../components/Navbar.js";
import axios from "axios";

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';



import { useUser } from "../context/useUser.js";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";


const url = 'http://localhost:3001'


function GroupsPage () {

    const navigate = useNavigate();

    const {user} = useUser();
    const [groups, setGroups] = useState([])


    useEffect(() => {
      axios.get(url+'/group/getGroups')
        .then(response => {
            setGroups(response.data)
        }).catch(error => {
          alert(error.response.data.error ? error.response.data.error : error)
        })
      }, [])


const reloadPage = () => {
    axios.get(url+'/group/getGroups')
    .then(response => {
        setGroups(response.data)
    }).catch(error => {
      alert(error.response.data.error ? error.response.data.error : error)
    })

}

      
const handleCreateClick = ( ) => {

    const newGroup = document.getElementById('newGroup').value
    const newDesc = document.getElementById('newDesc').value


    if (newGroup === null || newGroup === "") {
        alert("Group name is insufficient");
    } else {
        axios.post(url+'/group/createGroup',{
            id1: newGroup, 
            id2: newDesc, 
            id3: user.id 

        })
        .then(response => {
            reloadPage()
            
            alert("You have succesfully created a New group"+response)
        }).catch(error => {
          alert("Something went wrong")
        })
    }
    };

    return (
    <>
    <Navbar/>
    <div className="group-body" >
        <div>
        <h1 >All Groups</h1>
        <button className="info-button" onClick={e =>  navigate('/GroupMy')}>My Groups</button>
        <Popup trigger=
            {<button className="info-button">Create group</button>}
        modal nested>
        {
                    close => (
                        <div className='modal'>
                            <div className='content'>
                                <form>
                                    <label for="newGroup">Please enter Group Name:</label>
                                    <br/>
                                    <input type="text" id="newGroup" name="newGroup"/><br/>
                                    <label for="newDesc">Please enter a description for the group:</label><br/>
                                    <input type="text" id="newDesc" name="newDesc" /><br/><br/>
                                   
                                </form> 

                            </div>
                            <div>
                                <button className="info-button" onClick={e => handleCreateClick()}>
                                        Submit
                                </button>
                            </div>
                        </div>
                    )
                }
            </Popup>


        <table id="groupTable">
                <thead>
                    <tr>
                        <th>Ryhmän nimi</th>
                        <th>Ryhmän kuvaus</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map(group => (
                        <tr key={group.id}>
                            <td>{group.group_name}</td>
                            <td>{group.group_desc}</td>
                            <th>
                            <button 
                                    onClick={() => handleButtonClick()} 
                                    className="info-button">
                                    Liity
                                </button>
                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    </>
    )
}



const handleButtonClick = () => {
    alert(`Olet nyt liittynyt ryhmään`);
};


export default GroupsPage;