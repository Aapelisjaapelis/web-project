import React, { useState } from "react"
import { Link } from "react-router-dom"
import "./Navbar.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faBars } from '@fortawesome/free-solid-svg-icons';
import { useUser } from "../context/useUser" 

function Navbar() {
    const [menu, setMenu] = useState(false)     // State variable for the dropdown menu
    const {user, signOut} = useUser()

    const showDropdownMenu = () => {
        setMenu(!menu)                          // Toggle between false (dropdown menu closed) and true (dropdown menu open)
    }

    return (
        <nav>
            <div className={menu ? "responsive" : ""}>
                <Link className="navLink alwaysShow" to="/">Public movie list</Link>
                <Link className="navLink" to="/finnkinoshowtimes">Finnkino showtimes</Link>
                <div className="dropdown">
                    <button class="dropbtn">Groups &nbsp;
                        <FontAwesomeIcon icon={faCaretDown} className="unchecked"/>
                    </button>
                    <div className="dropdown-content">
                        <Link className="navLink" to="/groupspage">All groups</Link>
                        <Link className="navLink" to="/GroupMy">My groups</Link>
                    </div>
                </div>
                <Link className="navLink" to="/profile">Profile</Link>
                {user.access_token ? (
                    <>
                        <Link className={menu ? "navLink" : "navRight navLink"} to="/" onClick={signOut}>Sign out</Link>      {/* Sign out button is displayed when the user is logged in (logged in = when the user has a token) */}
                    </>
                ) : (
                    <div className={menu ? "" : "navRight"}>
                        <Link className="navLink" to="/login">Sign in</Link>                 {/* Log in button is displayed when the user is not logged in */}
                        <Link className="navLink" to="/signup">Sign up</Link>               {/* Sign up button is displayed when the user is not logged in */}
                    </div>
                )}
                <div className="navRight icon" onClick={showDropdownMenu}>
                    <FontAwesomeIcon icon={faBars} className="unchecked navLink"/>
                </div>
            </div>
        
            
        </nav>
    )
}

export default Navbar
