import './PublicMoviesList.css';
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.js"

function PublicMoviesList() {
  const [movies, setMovies] = useState([])
  const [searchText, setSearchText] = useState('')
  const [releaseYear, setReleaseYear] = useState('')

  const Movies = () => {
    return (
      <div className='imagecontainer'>
        { movies && movies.map(movie => (
          <div key={movie.id} className="imagebox">
            <div className="imagezoombox">
              <img src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} alt='Movie poster' onerror="this.onerror=null; this.src='Default.jpg'"></img>
            </div>
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    )
  }

  const searchForMovie = () => {
    let url = ''
    if(searchText.length === 0 && releaseYear.length === 0) {
      url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
    } else if (searchText.length !== 0 && releaseYear.length === 0) {
      url = 'https://api.themoviedb.org/3/search/movie?query= ' + searchText + '&include_adult=false&language=en-US&page=1';
    } else if (searchText.length === 0 && releaseYear.length !== 0) {
      url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_year= ' + releaseYear +'&sort_by=popularity.desc';
    } else {
      url = 'https://api.themoviedb.org/3/search/movie?query= ' + searchText +'&include_adult=false&language=en-US&primary_release_year= ' + releaseYear +'&page=1';
    }
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNDI4MDczZWUwMTU1OTE5MmNjZDdhMjg4ODYyNmJjYiIsIm5iZiI6MTczMTM5ODIxMC4yOTI3ODc2LCJzdWIiOiI2NzA5N2M2ZmUxZGI5ZWM0ODYyZThmMGMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.nYj8DKtCcuy-kzpZGobAf5e8bY9YS0NQRG7rFRd_qss'
      }
    };

    fetch(url, options)
    .then(response => response.json())
    .then(json => {
      setMovies(json.results)
    })
    .catch(error => {
      console.log(error)
    })
  }

  useEffect(() => {
    searchForMovie()
  }, [])

  return (

    <div id="container">
      <Navbar />
      <h1>Movies</h1>
      <div className="searchForm">
        <label>Search for Movies: </label>
        <input className="textSearch" type="text" value={searchText} onChange={e => setSearchText(e.target.value)}></input>
        <div className="dropdownContainer">
          <div id="filters" className="filters">
            <label>Release Year:</label>
            <input className="releaseYear" value={releaseYear} onChange={e => setReleaseYear(e.target.value)}></input>
          </div>
        </div>
        <button onClick={searchForMovie}>Search</button>
      </div>
      <Movies />
    </div>

  );
}

export default PublicMoviesList;