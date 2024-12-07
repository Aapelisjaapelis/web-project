import React from "react";
import Navbar from "../components/Navbar.js";
import { useUser } from "../context/useUser.js";
import { useNavigate } from "react-router-dom";

function ChangeEmail() {

  const {user, setUser, changeEmail} = useUser();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await changeEmail()
      navigate("/profile")
    } catch(error) {
      const errorMessage = error.response.data.message ? error.response.data.message : error
      alert(errorMessage)
    }
  };

  return (
    <>
        <Navbar/>

        <div className="changeEmaildiv">
            <h1>Change email</h1>
            <form className="changeEmailform">
                <label className="changeEmaillabel" >New email:</label>
                <input className="changeEmailinput" type="email" value={user.email} onChange={e => setUser({...user, email: e.target.value})}/> 
            </form>
            <button id="changeEmailButton" onClick={handleClick}>Change email</button>
        </div>
    </>
  )
}

export default ChangeEmail;