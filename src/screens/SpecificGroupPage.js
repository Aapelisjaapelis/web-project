import React from "react";
import "./GroupsPage.css";
import Navbar from "../components/Navbar.js"
import { useLocation, useNavigate } from "react-router-dom";


function SpecificGroupPage () {
    const location = useLocation();
    const navigate = useNavigate();
    const group = location.state;

    const Shows = [
        { id:2, name: "Alien vs predator", description: "....", showtime: "15:15", place:"Tampere" },
        { id:4, name: "SpiderMan", description: "....", showtime: "20:30", place:" Oulu" },
    
    ];


    return (


    <div className="group-body">
        <Navbar/>

        <div>
        <h1 >{group?.group_name || "No name recieved"}</h1>
        <button className="info-button" onClick={e =>  window.location.href='/GroupsPage'}>All Groups</button>

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
                    {Shows.map(Show => (
                        <tr key={Show.id}>
                            <td>{Show.name}</td>
                            <td>{Show.description}</td>
                            <td>{Show.showtime}</td>
                            <td>{Show.place}</td>

                            
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