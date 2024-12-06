import './FavoriteMoviesList.css'
import { useEffect, useState } from 'react'
import { useUser } from "../context/useUser.js"
import axios from "axios"
import Navbar from "../components/Navbar.js"

const url = process.env.REACT_APP_API_URL

function FavoriteMoviesList() {
  const {user} = useUser();
  const [favMoviesId, setFavMoviesId] = useState([])
  const [movieInfo, setMovieInfo] = useState([])

  useEffect(() => {
    getFavMoviesId()
  }, [])

  const getFavMoviesId = () => {
    axios
      .get(url + "/favorites/myFavorites/" + user.id)
      .then(response => {
        setFavMoviesId(response.data)
      })
      .catch(error => {
        alert(error)
    })
  }

  useEffect(() => {
    if (favMoviesId.length !== 0) {
      getFavMoviesInfo();
    }
  }, [favMoviesId])

  const getFavMoviesInfo = () => {
    const idArray = favMoviesId.map((favMovieId) => favMovieId.movie_id)
    const movieInfoList = []

    idArray.map(id => { 
      const options = {
      method: "GET",
      url: "https://api.themoviedb.org/3/movie/" + id,
      headers: {
        accept: "application/json",
        Authorization: process.env.BEARER
      }
    }
    
    axios
      .request(options)
      .then(response => {
        movieInfoList.push(response.data)
      })
      .catch(error => {
        console.error(error)
      })
    })

    setMovieInfo(movieInfoList)
  }

  return (
    <>
      <Navbar />

      <div id='favoritesContainer'>
        <h1>Favorite movies</h1>

      </div>

    </>

  );
}

export default FavoriteMoviesList;