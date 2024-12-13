import React from "react";
import Navbar from "../components/Navbar.js";
import { useUser } from "../context/useUser.js";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

function ChangePassword() {

  const {user, setUser, changePassword} = useUser();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await changePassword()
      alert("Password changed successfully")
      navigate("/profile")
    } catch(error) {
      const errorMessage = error.response.data.message ? error.response.data.message : error
      alert(errorMessage)
    }
  };


  return (
    <>
        <Navbar/>

        <div id="changePasswordDiv">
            <h1>Change password</h1>
            <form id="changePasswordForm">
                <label className="changePasswordLabel">Old password:</label>
                <input className="changePasswordInput" type="password" value={user.oldPassword} onChange={e => setUser({...user, oldPassword: e.target.value})}/>
                <label className="changePasswordLabel" >New password:</label>
                <input className="changePasswordInput" type="password" value={user.password} onChange={e => setUser({...user, password: e.target.value})}/> 
            </form>
            <button id="changePasswordButton" onClick={handleClick}>Change password</button>
        </div>
    </>
  )
}

export default ChangePassword;