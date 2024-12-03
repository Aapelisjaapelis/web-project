import './FavoriteMoviesList.css'
import { useEffect, useState } from 'react'
import { useUser } from "../context/useUser.js"
import axios from "axios"
import Navbar from "../components/Navbar.js"

const url = process.env.REACT_APP_API_URL

function FavoriteMoviesList() {
  const {user} = useUser();
  const [favMovies, setFavMovies] = useState([])

  useEffect(() => {
    getFavMoviesId()
  }, [])

  const getFavMoviesId = async () => {
    try {
      const response = await axios.get(url + "/favorites/myFavorites/" + user.id)
      
    } catch(error) {
      alert(error)
    }
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