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

  // Logic for removing a movie from favorites
  /*
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
  */

  const FavMovies = () => {
    return (
      <div className='imagecontainer'>
        { favMovies && favMovies.map(favMovie => (
          <div key={favMovie.movie_id} className="imagebox">
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




// This might be pointless because the style from PublicMoviesList.css could be used
/*
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

*/