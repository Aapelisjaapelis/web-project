import React from "react";
import "./GroupsPage.css";

import Navbar from "../components/Navbar.js";


function GroupsPage () {
    return (
    <div >
        <Navbar/>
        <h1 >Groups</h1>
        <button onClick={event =>  window.location.href='/GroupMy'}>My Groups</button>
        <button onClick={e => handleCreateClick()} >Greate group</button>

        <table id="groupTable">
                <thead>
                    <tr>
                        <th>Ryhmän nimi</th>
                        <th>Ryhmän kuvaus</th>
                        <th>Jäsenten määrä</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map(group => (
                        <tr key={group.id}>
                            <td>{group.name}</td>
                            <td>{group.description}</td>
                            <td>{group.members_count}</td>
                            <th>
                            <button 
                                    onClick={() => handleButtonClick(group)} 
                                    className="info-button">
                                    Liity
                                </button>

                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>

    </div>
    )
}

const groups = [
    { id:1, name: "Elokuva nauttijat", description: "Ryhmä elokuvista kiinnostuneille", members_count: 10 },
    { id:2, name: "Kauhunystävät", description: "Kauhua joka päivä vuodesta", members_count: 15 },
    { id:3, name: "Fantasy geek", description: "emt", members_count: 25 },
    { id:4, name: "Indiana Jones leffat", description: "For action lovers", members_count: 5 },

];


const handleButtonClick = (group) => {
    alert(`Olet nyt liittynyt ryhmään`);
};

const handleCreateClick = () => {
    let person = prompt("Please enter Group Name");
    if (person === null || person === "") {
        console.log("Ei toimi");
        alert("Something went wrönk");
    } else {
        console.log(person+" HEi!");
        alert("You have succesfully greated a new group!");
    }
    };

export default GroupsPage;