import React, { useState } from "react"
import { Link } from "react-router-dom"
import "./Navbar.css"

function Navbar() {
    const[menu, setMenu] = useState(false)

    const showDropdownMenu = () => {
        setMenu(!menu)
    }

    return (
        <nav>

            <button id="menuButton" onClick={showDropdownMenu}>Menu</button>

            <ul className={menu ? "show" : ""}>
                <li>
                    <Link to="">Public movie list</Link>
                </li>
                <li>
                    <Link to="">Finnkino showtimes</Link>
                </li>
                <li>
                    <Link to="">Groups</Link>
                </li>
                <li>
                    <Link to="">Favorites</Link>
                </li>
                <li>
                    <Link to="">Profile</Link>
                </li>
            </ul>
            
            <ul className={menu ? "show" : ""}>
                <li>
                    <Link to="">Log in</Link>
                </li>
                <li>
                    <Link to="">Sign up</Link>
                </li>
            </ul>

        </nav>
    )
}

export default Navbar
