import React from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar.js"
import "./Register.css"
import { useUser } from "../context/useUser.js"

function Register() {
  const {user, setUser, signUp} = useUser()
  const navigate = useNavigate()
  
  const handleClick = async () => {
    try {
      await signUp()
      navigate("/login")  // Navigate to login page after a successful registration
    } catch(error) {
      const errorMessage = error.response.data.message ? error.response.data.message : error
      alert(errorMessage)
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
