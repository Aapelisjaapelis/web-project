import React from "react"
import Navbar from "../components/Navbar.js"
import "./Login.css"

function Login() {
  return (
    <>
        <Navbar/>

        <div>
            <h1>Sign in</h1>
            <form>
                <label>Email:</label>
                <input type="email"/>
                <label>Password:</label>
                <input type="password"/>
            </form>
            <button id="signInButton">Sign in</button>
        </div>
    </>
  )
}

export default Login
