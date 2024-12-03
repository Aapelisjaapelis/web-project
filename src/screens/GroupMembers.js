import React from "react";
import "./GroupsPage.css";
import Navbar from "../components/Navbar.js";
import axios from "axios";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";


const url = 'http://localhost:3001'


function GroupMembers () {

    const location = useLocation();
    const navigate = useNavigate();
    const group = location.state;

    const [members, setMembers] = useState([])

    useEffect(() => {
      axios.get(url+'/group/Members/'+group.id)
        .then(response => {
            setMembers(response.data)
        }).catch(error => {
          alert(error.response.data.error ? error.response.data.error : error)
        })
      }, [])


    
    const deleteMember = (groupID, memberId) => {
        
        axios.delete(url+'/group/deleteMembers', {
          params: { id1: groupID, id2: memberId }
        }
        )
        .then(response =>{
          const withoutRemoved = members.filter((member)=> member.account_id !== memberId)
          setMembers(withoutRemoved)
          alert("Member removed succesfully!")
        }).catch(error => {
          alert(error.response.data.error ? error.response.data.error : error)
        })
      }
      
    
   

    return (
    <div className="group-body">
        <Navbar/>
        <div>
        <h1 >{group?.group_name} Members</h1>
        <button className="info-button" onClick={() =>  navigate('/SpecificGroupPage',{ state: group})}>Group page</button>
        <button className="info-button" onClick={e => handleCreateClick()} >Join requests</button>

        <table id="groupTable">
                <thead>
                    <tr>
                        <th>Member name</th>
                        <th>Email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {members.map(member => (
                        <tr key={member.account_id}>
                            <td>{member.username}</td>
                            <td>{member.email}</td>
                            <th>
                            <button 
                                    onClick={() => deleteMember(group.id, member.account_id)} 
                                    className="info-button">
                                    Remove member
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


const arrayOfStrings = ["Pyyntö5: Martti", "Pyyntö6: Pertti"];
const handleCreateClick = () => {
  alert(arrayOfStrings.map(i => '*' + i).join('\n'));
};

export default GroupMembers;