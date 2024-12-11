import './FavoriteMoviesList.css'
import { useEffect, useState } from 'react'
import { useUser } from "../context/useUser.js"
import axios from "axios"
import Navbar from "../components/Navbar.js"
import { useNavigate } from 'react-router-dom'

const url = process.env.REACT_APP_API_URL     // The url is taken from .env

function FavoriteMoviesList() {
  const {user, updateToken} = useUser();
  const [favMovies, setFavMovies] = useState([])      // A list of objects with id, name and poster path being the properties (favMovies.movie_id, favMovies.movie_name, favMovies.poster_path)
  const navigate = useNavigate();

  useEffect(() => {
    getFavMovies()                                  // First, a function containing a get request is called
  }, [])

  const getFavMovies = () => {
    const headers = {headers: {Authorization: "Bearer " + user.access_token}}

    axios
      .get(url + "/favorites/myFavorites/" + user.id, headers)   // Getting the user's favorite movies from the database. The id of the user is given as a parameter
      .then(response => {
        if (response.data.length === 0 || !response.data) {
          updateToken(response)
          return
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
      <div className='imagecontainer'>
        { favMovies && favMovies.map(favMovie => (
          <div key={favMovie.movie_id} className="imagebox" onClick={e => navigate('/specificmovie', {state: {id: favMovie.movie_id}})}>
            <div className="imagezoombox">
              <img src={'https://image.tmdb.org/t/p/w500' + favMovie.poster_path} alt='Movie poster' onerror="this.onerror=null; this.src='Default.jpg'"></img>
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

      <div id='favoritesContainer'>
        <h1>Favorite movies</h1>
        <FavMovies />
      </div>
    </>
  )
}

export default FavoriteMoviesList
