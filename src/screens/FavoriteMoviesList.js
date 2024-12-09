import './FavoriteMoviesList.css'
import { useEffect, useState } from 'react'
import { useUser } from "../context/useUser.js"
import axios from "axios"
import Navbar from "../components/Navbar.js"

const url = process.env.REACT_APP_API_URL     // The url is taken from .env

function FavoriteMoviesList() {
  const {user} = useUser();
  const [favMovies, setFavMovies] = useState([])      // A list of objects with id and name being the only properties (favMovies.movie_id and favMovies.movie_name)

  useEffect(() => {
    getFavMoviesId()                                  // First, a function containing a get request is called
  }, [])

  const getFavMoviesId = () => {
    axios
      .get(url + "/favorites/myFavorites/" + user.id)   // Getting the user's favorite movies from the database. The id of the user is given as a parameter
      .then(response => {
        if (response.data.length === 0) {
          alert("No favorite movies")                   // Display an alert if the user has no favorite movies
        }
        else {
          setFavMovies(response.data)
        }
      })
      .catch(error => {
        console.log(error)
    })
  }

  const removeFavoriteMovie = (movieId) => {
    axios
      .delete(url + "/favorites/removeFavorite/" + user.id + "/" + movieId)
      .then(response => {
        const withoutRemoved = favMovies.filter((favMovie) => favMovie.movie_id !== movieId)
        setFavMovies(withoutRemoved)
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <>
      <Navbar />

      <div id='favoritesContainer'>
        <h1>Favorite movies</h1>
        <ul id='favoriteMoviesList'>
          {
            favMovies.map(favMovie => (
              <li className='favoriteMoviesItem' key={favMovie.movie_id}>
                {favMovie.movie_name}
                <button className="removeFavoriteButton" onClick={() => removeFavoriteMovie(favMovie.movie_id)}>Remove</button>
              </li>
            ))
          }
        </ul>
      </div>
    </>
  )
}

export default FavoriteMoviesList;
