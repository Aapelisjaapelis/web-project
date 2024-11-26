import React from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar.js"
import "./Login.css"
import { useUser } from "../context/useUser.js"

function Login() {
  const {user, setUser, signIn} = useUser()
  const navigate = useNavigate()

  const handleClick = async () => {
    try {
      await signIn()
      navigate("/")
    } catch(error) {
      const errorMessage = error.response.data.message ? error.response.data.message : error
      alert(errorMessage)
    }
  }

  return (
    <>
        <Navbar/>

        <div className="logindiv">
            <h1>Sign in</h1>
            <form className="loginform">
                <label className="loginlabel">Email:</label>
                <input className="logininput" type="email" value={user.email} onChange={e => setUser({...user, email: e.target.value})}/>
                <label className="loginlabel" >Password:</label>
                <input className="logininput" type="password" value={user.password} onChange={e => setUser({...user, password: e.target.value})}/>
            </form>
            <button id="signInButton" onClick={handleClick}>Sign in</button>
        </div>
    </>
  )
}

export default Login