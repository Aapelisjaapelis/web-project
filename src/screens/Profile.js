import './Profile.css';
import Navbar from "../components/Navbar.js";
import { useUser } from "../context/useUser.js"

function Profile() {

  const { user } = useUser();

  return (
    <>
      <Navbar />
      <h1>Profile</h1>
      <h2>{user.username}</h2>
      <button>Change password</button>
      <button>Change email address</button>
      <button>Delete account</button>
    </>
  );
}

export default Profile;