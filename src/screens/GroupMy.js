import React from "react";
import "./GroupsPage.css";
import Navbar from "../components/Navbar.js"


function GroupMy () {
    return (

    <div >
        <Navbar/>

        
        <h1 >Groups</h1>
        <button onClick={e =>  window.location.href='/GroupsPage'}>All Groups</button>

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
                                    onClick={e =>  window.location.href='/SpecificGroupPage'}
                                    className="info-button">
                                    View
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
    { id:2, name: "Kauhunystävät", description: "Kauhua joka päivä vuodesta", members_count: 15 },
    { id:4, name: "Indiana Jones leffat", description: "For action lovers", members_count: 5 },

];


export default GroupMy;