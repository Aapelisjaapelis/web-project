import React, { useState } from "react"
import Navbar from "../components/Navbar.js"
import "./Register.css"

function Register() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: ""
  })
  
  const handleClick = () => {

  }

  return (
    <>
        <Navbar/>

        <div>
            <h1>Sign up</h1>
            <form>
                <label>Username:</label>
                <input type="text" value={user.username} onChange={e => setUser({...user, username: e.target.value})}/>
                <label>Email:</label>
                <input type="email" value={user.email} onChange={e => setUser({...user, email: e.target.value})}/>
                <label>Password:</label>
                <input type="password" value={user.password} onChange={e => setUser({...user, password: e.target.value})}/>
            </form>
            <button id="signUpButton" onClick={handleClick}>Sign up</button>
        </div>
    </>
  )
}

export default Register
