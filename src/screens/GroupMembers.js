import React from "react";
import "./GroupsPage.css";

import Navbar from "../components/Navbar.js";


function GroupMembers () {
    return (
    <div className="group-body">
        <Navbar/>
        <div>
        <h1 >Group name</h1>
        <button className="info-button" onClick={event =>  window.location.href='/SpecificGroupPage'}>Group page</button>
        <button className="info-button" onClick={e => handleCreateClick()} >Join requests</button>

        <table id="groupTable">
                <thead>
                    <tr>
                        <th>Member name</th>
                        <th>Desc</th>
                        <th>Last login</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map(group => (
                        <tr key={group.id}>
                            <td>{group.name}</td>
                            <td>{group.description}</td>
                            <td>{group.lastlogin}</td>
                            <th>
                            <button 
                                    onClick={() => handleButtonClick(group)} 
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

const groups = [
    { id:1, name: "Matti meikäläinen", description: "...", lastlogin: "15.03.2024" },
    { id:2, name: "Aku Ankka", description: "...", lastlogin: "25.11.2024" },


];


const handleButtonClick = (group) => {
  alert(`Member was remowed succesfully!`);
};


const arrayOfStrings = ["Pyyntö5: Martti", "Pyyntö6: Pertti"];
const handleCreateClick = () => {
  alert(arrayOfStrings.map(i => '*' + i).join('\n'));
};

export default GroupMembers;