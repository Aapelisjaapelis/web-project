import './FavoriteMoviesList.css'
import { useEffect, useState } from 'react'
import { useUser } from "../context/useUser.js"
import axios from "axios"
import Navbar from "../components/Navbar.js"

const url = process.env.REACT_APP_API_URL     // The url is taken from .env
const bearerToken = process.env.BEARERTOKEN   // The access token for calling TMDB API is taken from .env

function FavoriteMoviesList() {
  const {user} = useUser();
  const [favMoviesId, setFavMoviesId] = useState([])  // A list of objects with an id of a movie being the only property (favMoviesId.movie_id)
  const [moviesInfo, setMoviesInfo] = useState([])    // The details of the user's favorite movies are here. A single object has a lot of properties (for example: moviesInfo.id and moviesInfo.title)

  useEffect(() => {
    getFavMoviesId()                                  // First, a function containing a get request is called.
  }, [])

  const getFavMoviesId = () => {
    axios
      .get(url + "/favorites/myFavorites/" + user.id)   // Getting the ids of the user's favorite movies from the database. The id of the user is given as a parameter.
      .then(response => {
        if (response.data.length === 0) {
          alert("No favorite movies")                   // Display an alert if the user has no favorite movies
        }
        else {
          setFavMoviesId(response.data)
        }
      })
      .catch(error => {
        console.error(error)
    })
  }

  useEffect(() => {
    if (favMoviesId.length !== 0) {
      getFavMoviesInfo()
    }
  }, [favMoviesId])

  const getFavMoviesInfo = () => {
    const idArray = favMoviesId.map((favMovieId) => favMovieId.movie_id)  // Create an array which contains the movie ids of all "favMoviesId" objects
    const movieInfoList = []                                              // This array is used to store objects containing the details of the favorite movies

    idArray.map(id => {                                                   // Sending a get request with every id from "idArray"
      const options = {
      method: "GET",
      url: "https://api.themoviedb.org/3/movie/" + id,                    
      headers: {
        accept: "application/json",
        Authorization: bearerToken
      }
    }
    
    axios
      .request(options)
      .then(response => {
        movieInfoList.push(response.data)   // Storing the response data into an array which was created earlier
      })
      .catch(error => {
        console.error(error)
      })
    })

    setMoviesInfo(movieInfoList)            // After "movieInfoList" contains all the responses, the data is stored into "moviesInfo"
    console.log(moviesInfo)
  }

  return (
    <>
      <Navbar />

      <div id='favoritesContainer'>
        <h1>Favorite movies</h1>
        <ul>
          {
           
          }
        </ul>
      </div>

    </>

  );
}

export default FavoriteMoviesList;






/*
{
  moviesInfo.map(movieInfo => (
    <li key={movieInfo.id}>{movieInfo.title}</li>
  ))
}
*/