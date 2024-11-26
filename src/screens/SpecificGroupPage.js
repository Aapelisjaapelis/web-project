import React from "react";
import "./GroupsPage.css";
import Navbar from "../components/Navbar.js"


function SpecificGroupPage () {
    return (

    <div >
        <Navbar/>

        
        <h1 >Group Name esim RyhmäRämä</h1>
        <button onClick={e =>  window.location.href='/GroupsPage'}>All Groups</button>

        <table id="groupTable">
                <thead>
                    <tr>
                        <th>Movie name</th>
                        <th>Movie details</th>
                        <th>Showtime</th>
                        <th>Place</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map(group => (
                        <tr key={group.id}>
                            <td>{group.name}</td>
                            <td>{group.description}</td>
                            <td>{group.showtime}</td>
                            <td>{group.place}</td>

                            
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={e =>  window.location.href='/GroupMembers'}>Show members</button>


    </div>
    )
}

const groups = [
    { id:2, name: "Alien vs predator", description: "....", showtime: "15:15", place:"Tampere" },
    { id:4, name: "SpiderMan", description: "....", showtime: "20:30", place:" Oulu" },

];


export default SpecificGroupPage;