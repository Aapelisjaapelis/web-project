import "./Profile.css"
import Navbar from "../components/Navbar.js"
import { useUser } from "../context/useUser.js"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Popup from "reactjs-popup"
import axios from "axios"

const url = process.env.REACT_APP_API_URL   // The url is taken from .env

function Profile() {
  const {user, updateToken} = useUser()
  const [favMovies, setFavMovies] = useState([])      // A list of objects with id, name and poster path being the properties (favMovies.movie_id, favMovies.movie_name, favMovies.poster_path)
  const [visibility, setVisibility] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    isPublic()
    getFavMovies()
  }, [])

  const isPublic = () => {
    const headers = {headers: {Authorization: "Bearer " + user.access_token}}

    axios
      .get(url + "/user/visibility/" + user.id, headers)
      .then(response => {
        if (response.data.visibility === "private") {
          updateToken(response)
          setVisibility(false)
        }
        else {
          updateToken(response)
          setVisibility(true)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const getFavMovies = () => {
    const headers = {headers: {Authorization: "Bearer " + user.access_token}}

    axios
      .get(url + "/favorites/myFavorites/" + user.id, headers)   // Getting the user's favorite movies from the database. The id of the user is given as a parameter
      .then(response => {
        if (response.data.length === 0 || !response.data) {
          updateToken(response)
        }
        else {
          updateToken(response)
          setFavMovies(response.data)
        }
      })
      .catch(error => {
        console.log(error)
    })
  }

  const FavMovies = () => {
    return (
      <div className="imagecontainer">
        { favMovies && favMovies.map(favMovie => (
          <div key={favMovie.movie_id} className="imagebox" onClick={e => navigate("/specificmovie", {state: {id: favMovie.movie_id}})}>
            <div className="imagezoombox">
              <img src={"https://image.tmdb.org/t/p/w500" + favMovie.poster_path} alt="Movie poster" onerror="this.onerror=null; this.src=Default.jpg'"></img>
            </div>
            <p>{favMovie.movie_name}</p>
          </div>
        ))}
      </div>
    )
  }

  const makePrivate = () => {
    const headers = {headers: {Authorization: "Bearer " + user.access_token}}

    axios
      .put(url + "/user/makePrivate", user, headers)
      .then(response => {
        updateToken(response)
        setVisibility(false)
        alert(response.data.message)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const makePublic = () => {
    const headers = {headers: {Authorization: "Bearer " + user.access_token}}

    axios
      .put(url + "/user/makePublic", user, headers)
      .then(response => {
        updateToken(response)
        setVisibility(true)
        alert(response.data.message)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const copyFavoritesUrl = async () => {
    const favoritesUrl = "http://localhost:3000/favoritemovieslist/" + user.id

    try {
      await navigator.clipboard.writeText(favoritesUrl)
      //console.log(favoritesUrl)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Navbar />
      
      <h1 id="profileHeader">Profile</h1>

      <div id="profile">

        <div id="leftProfile">
          <button id="changePassword" onClick={e =>  navigate("/changePassword")}>Change password</button>
          <button id="changeEmail" onClick={e =>  navigate("/changeEmail")}>Change email address</button>
          <Popup trigger=
                {<button id="deleteAccount">Delete account</button>}
            modal nested>
            {
                close => (
                    <div>
                        <div>
                          <label for="newDesc">Are you sure you want to delete your account and all the information related</label><br/>
                        </div>
                        <div>
                            <button onClick={e => navigate("/profile")}>Submit</button>
                        </div>
                    </div>
                )
            }
          </Popup>
        </div>

        <div id="middleProfile">
          <h2 id="usernameHeader">Username: {user.username}</h2>
          <button id="visibilityButton" onClick={visibility ? makePrivate : makePublic}>{visibility ? "Make private" : "Make public"}</button>
          <button id="shareFavoritesButton" onClick={copyFavoritesUrl}>Get link for favorite movies</button>
        </div>

        <div id="rightProfile"></div>

      </div>

      <div id="favoriteMoviesContainer">
        <h2 id="favoriteMoviesHeader">Favorite movies</h2>
        {favMovies.length !== 0 ? <FavMovies /> : <p id="noFavoriteMovies">No favorite movies</p>}
      </div>
    </>
  )
}

export default Profile