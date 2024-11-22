import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../context/UserContext.js"
import Navbar from "../components/Navbar.js"
import "./Login.css"

function Login() {
  const {user, setUser, signIn} = useContext(UserContext)
  const navigate = useNavigate()

  const handleClick = async () => {
    try {
      await signIn()
      navigate("/")
    } catch(error) {
      const errorMessage = error.response && error.response.data ? error.response.data.message : error
      alert(errorMessage)
    }
  }

  return (
    <>
        <Navbar/>

        <div>
            <h1>Sign in</h1>
            <form>
                <label>Email:</label>
                <input type="email" value={user.email} onChange={e => setUser({...user, email: e.target.value})}/>
                <label>Password:</label>
                <input type="password" value={user.password} onChange={e => setUser({...user, password: e.target.value})}/>
            </form>
            <button id="signInButton" onClick={handleClick}>Sign in</button>
        </div>
    </>
  )
}

export default Login
