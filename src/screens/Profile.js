import './Profile.css';
import Navbar from "../components/Navbar.js";
import { useUser } from "../context/useUser.js";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Profile() {

  const navigate = useNavigate();

  const {user} = useUser();


  return (
    <>
      <Navbar />
      <h1>Profile</h1>
      <img src={user.avatar} alt="avatar" />
      <h2>{user.username}</h2>
      <input />
      <button className="changePassword" onClick={e =>  navigate('/changePassword')}>Change password</button>
      <button>Change email address</button>
      <button>Delete account</button>
    </>
  );
}

export default Profile;