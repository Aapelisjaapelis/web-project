import "./FavoriteMoviesList.css"
import { useEffect, useState } from "react"
import { useUser } from "../context/useUser.js"
import axios from "axios"
import Navbar from "../components/Navbar.js"
import { useNavigate, useParams } from "react-router-dom"

const url = process.env.REACT_APP_API_URL     // The url is taken from .env

function FavoriteMoviesList() {
  const {user} = useUser()
  const {userId} = useParams()
  const navigate = useNavigate()
  const [favMovies, setFavMovies] = useState([])      // A list of objects with id, name and poster path being the properties (favMovies.movie_id, favMovies.movie_name, favMovies.poster_path)
  const [visibility, setVisibility] = useState(null)

  useEffect(() => {
    isPublic()
  }, [])
  
  useEffect(() => {
    if (visibility === true || user.id === parseInt(userId)) {
      getFavMovies()
    }
  }, [visibility, user, userId])

  const isPublic = () => {
    axios
      .get(url + "/user/getVisibility/" + userId)
      .then(response => {
        if (response.data.visibility === "private") {
          setVisibility(false)
        }
        else {
          setVisibility(true)
        }
      })
      .catch(error => {
        console.log(error)
      })
    }

  const getFavMovies = () => {
    axios
      .get(url + "/favorites/userFavorites/" + userId)  // Getting the user's favorite movies from the database. The id of the user is given as a parameter
      .then(response => {
        if (response.data.length === 0 || !response.data) {
          return
        }
        else {
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
              <img src={"https://image.tmdb.org/t/p/w500" + favMovie.poster_path} alt="Movie poster" onerror="this.onerror=null; this.src='Default.jpg'"></img>
            </div>
            <p>{favMovie.movie_name}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <Navbar />
      
      <div id="favoritesContainer">
        {visibility == null || visibility || user.id === parseInt(userId) ? (
          <>
            <h1 className="favoriteMoviesListHeader">Favorite movies</h1>
            {favMovies.length !== 0 ? <FavMovies /> : <p id="noFavoriteMovies">No favorite movies</p>}
          </>
        ) : (
            <h1 className="favoriteMoviesListHeader">This account is private</h1>
        )}
      </div>
    </>
  )
}

export default FavoriteMoviesList
