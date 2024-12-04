import React, { useState } from "react"
import { Link } from "react-router-dom"
import "./Navbar.css"
import { useUser } from "../context/useUser" 

function Navbar() {
    const [menu, setMenu] = useState(false)     // State variable for the dropdown menu
    const {user, signOut} = useUser()

    const showDropdownMenu = () => {
        setMenu(!menu)                          // Toggle between false (dropdown menu closed) and true (dropdown menu open)
    }

    return (
        <nav>

            <button id="menuButton" onClick={showDropdownMenu}>Menu</button>    {/* Menu button is displayed when the maximum width of the screen is 1250px */}

            <ul className={menu ? "show" : ""}>
                <li>
                    <Link to="/">Public movie list</Link>
                </li>
                <li>
                    <Link to="/finnkinoshowtimes">Finnkino showtimes</Link>
                </li>
                <li>
                    <Link to="/groupspage">Groups</Link>
                </li>
                <li>
                    <Link to="/favoritemovieslist">Favorites</Link>
                </li>
                <li>
                    <Link to="/profile">Profile</Link>
                </li>
            </ul>
            
            <ul className={menu ? "show" : ""}>
                {user.access_token ? (
                    <li>
                        <Link to="/" onClick={signOut}>Sign out</Link>      {/* Sign out button is displayed when the user is logged in (logged in = when the user has a token) */}
                    </li>
                ) : (
                    <>
                        <li>
                            <Link to="/login">Log in</Link>                 {/* Log in button is displayed when the user is not logged in */}
                        </li>
                        <li>
                            <Link to="/signup">Sign up</Link>               {/* Sign up button is displayed when the user is not logged in */}
                        </li>
                    </>
                )}
            </ul>

        </nav>
    )
}

export default Navbar
