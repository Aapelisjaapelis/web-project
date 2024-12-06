import React from "react";
import Navbar from "../components/Navbar.js";
import { useUser } from "../context/useUser.js";
import { useNavigate } from "react-router-dom";

function ChangePassword() {

  const {user, setUser, changePassword} = useUser();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await changePassword()
      navigate("/profile")
    } catch(error) {
      const errorMessage = error.response.data.message ? error.response.data.message : error
      alert(errorMessage)
    }
  };


  return (
    <>
        <Navbar/>

        <div className="changePassworddiv">
            <h1>Change password</h1>
            <form className="changePasswordform">
                <label className="changePasswordlabel">Old password:</label>
                <input className="changePasswordinput" type="password" value={user.password} onChange={e => setUser({...user, oldPassword: e.target.value})}/>
                <label className="changePasswordlabel" >New password:</label>
                <input className="changePasswordinput" type="password" value={user.password} onChange={e => setUser({...user, password: e.target.value})}/> 
            </form>
            <button id="changePasswordButton" onClick={handleClick}>Change password</button>
        </div>
    </>
  )
}

export default ChangePassword;