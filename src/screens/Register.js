import React from "react"
import Navbar from "../components/Navbar.js"
import "./Register.css"

function Register() {
  return (
    <>
        <Navbar/>

        <div>
            <h1>Sign up</h1>
            <form>
                <label>Username:</label>
                <input type="text"/>
                <label>Email:</label>
                <input type="email"/>
                <label>Password:</label>
                <input type="password"/>
            </form>
        </div>
    </>
  )
}

export default Register
