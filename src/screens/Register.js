import React, { useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar.js"
import "./Register.css"

const url = process.env.REACT_APP_API_URL

function Register() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: ""
  })
  
  const handleClick = async () => {
    const headers = {headers: {"Content-Type": "application/json"}}

    try {
      await axios.post(url + "/user/register", user, headers)
      setUser({username: "", email: "", password: ""})
    } catch(error) {
        alert(error)
    }
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
