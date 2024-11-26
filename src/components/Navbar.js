import React, { useState } from "react"
import { Link } from "react-router-dom"
import "./Navbar.css"
import { useUser } from "../context/useUser" 

function Navbar() {
    const [menu, setMenu] = useState(false)
    const {user, signOut} = useUser()

    const showDropdownMenu = () => {
        setMenu(!menu)
    }

    const handleClick = () => {
        signOut()
    }

    return (
        <nav>

            <button id="menuButton" onClick={showDropdownMenu}>Menu</button>

            <ul className={menu ? "show" : ""}>
                <li className="navlist">
                    <Link to="/">Public movie list</Link>
                </li>
                <li className="navlist">
                    <Link to="/finnkinoshowtimes">Finnkino showtimes</Link>
                </li>
                <li className="navlist">
                    <Link to="/groupspage">Groups</Link>
                </li>
                <li className="navlist">
                    <Link to="/favoritemovieslist">Favorites</Link>
                </li>
                <li className="navlist"> 
                    <Link to="/profile">Profile</Link>
                </li>
            </ul>
            
            <ul className={menu ? "show" : ""}>
                {user.token ? (
                    <li className="navlist">
                        <Link to="/" onClick={handleClick}>Sign out</Link>
                    </li>
                ) : (
                    <>
                        <li className="navlist">
                            <Link to="/login">Log in</Link>
                        </li>
                        <li className="navlist">
                            <Link to="/signup">Sign up</Link>
                        </li>
                    </>
                )}
            </ul>

        </nav>
    )
}


export default Navbar

