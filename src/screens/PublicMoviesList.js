import './PublicMoviesList.css';
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.js"
import ReactPaginate from 'react-paginate';
import spider from '../pictures/spider.png'
import { useNavigate } from 'react-router-dom'
import Footer from "../components/Footer.js"

function PublicMoviesList() {
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [searchText, setSearchText] = useState('')
  const [releaseYear, setReleaseYear] = useState('')
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(0)
  const [searchedGenres, setSearchedGenres] = useState([])
  let chosenGenres = []
  const navigate = useNavigate();

  const Movies = () => {
    return (
      <div className='imagecontainer'>
        { movies && movies.map(movie => (
          <div key={movie.id} className="imagebox" onClick={e => navigate('/specificmovie', {state: {id:movie.id}})}>
            <div className="imagezoombox">
              <img src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} alt='Movie poster'></img>
            </div>
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    )
  }

  const Genres = () => {
    chosenGenres = searchedGenres
    return (
      <div id="genreFilters" className="none">
        {(() => {
          const genreoptions = []
          for (let i = 0; i < genres.length; i++) {
            if(searchedGenres.includes(genres[i].id)) {
              genreoptions.push(<div key={genres[i].id}><label key={genres[i].name}>{genres[i].name}</label><input key={genres[i].id} type="checkbox" name="genre" id={genres[i].id} value={genres[i].name} onChange={e => modifyChosenGenres(genres[i].id, genres[i].name)} defaultChecked="checked"></input></div>)
            } else {
              genreoptions.push(<div key={genres[i].id}><label key={genres[i].name}>{genres[i].name}</label><input key={genres[i].id} type="checkbox" name="genre" id={genres[i].id} value={genres[i].name} onChange={e => modifyChosenGenres(genres[i].id, genres[i].name)}></input></div>)
            }
          }
          return genreoptions
        })()}
      </div>
    )
  }

  const genreFiltering = (movieparam) => {
    let moviearray = []
    if (chosenGenres.length !== 0) {
      for (let i = 0; i < movieparam.length; i++) {
        for (let j = 0; j < movieparam[i].genre_ids.length; j++) {
          if(chosenGenres.includes(movieparam[i].genre_ids[j]) && !moviearray.includes(movieparam[i])) {
            moviearray.push(movieparam[i])
          }
        }
      }
      setMovies(moviearray)
    } else {
      setMovies(movieparam)
    }
  }

  const modifyChosenGenres = (genreId, genreName) => {
    if(!document.getElementById(genreId).checked) {
      for (let i = 0; i < chosenGenres.length; i++) {
        if(chosenGenres[i] === genreId) {
          chosenGenres.splice(i, 1)
        }
      }
    } else {
      chosenGenres.push(genreId)
    }
  }

  const setVisibility = () => {
    if(document.getElementById('genreFilters').className === 'visible') {
      document.getElementById('genreFilters').classList = 'none'
      document.getElementById('genreButton').innerHTML = 'Show'
    } else if (document.getElementById('genreFilters').className === 'none') {
      document.getElementById('genreFilters').classList = 'visible'
      document.getElementById('genreButton').innerHTML = 'Hide'
    }
    
  }

  const searchForMovie = () => {
    let url = ''
    let genreList = ''
    for (let i = 0; i < chosenGenres.length; i++) {
      genreList += + chosenGenres[i]
      if(i < (chosenGenres.length - 1)) {
        genreList += ','
      }
    }
    if(searchText.length === 0 && releaseYear.length === 0 && chosenGenres.length === 0) {
      url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=' + page + '&sort_by=popularity.desc';
    } else if (searchText.length !== 0 && releaseYear.length === 0 && chosenGenres.length === 0) {
      url = 'https://api.themoviedb.org/3/search/movie?query= ' + searchText + '&include_adult=false&language=en-US&page=' + page;
    } else if (searchText.length === 0 && releaseYear.length !== 0 && chosenGenres.length === 0) {
      url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=' + page + '&primary_release_year= ' + releaseYear +'&sort_by=popularity.desc';
    } else if (searchText.length !== 0 && releaseYear.length !== 0 && chosenGenres.length === 0) {
      url = 'https://api.themoviedb.org/3/search/movie?query= ' + searchText +'&include_adult=false&language=en-US&primary_release_year= ' + releaseYear +'&page=' + page;
    } else if (searchText.length === 0 && releaseYear.length === 0 && chosenGenres.length !== 0) {
      url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=' + page + '&with_genres=' + genreList + '&sort_by=popularity.desc';
    } else if (searchText.length === 0 && releaseYear.length !== 0 && chosenGenres.length !== 0) {
      url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=' + page + '&with_genres=' + genreList + '&primary_release_year= ' + releaseYear +'&sort_by=popularity.desc';
    } else if (searchText.length !== 0 && releaseYear.length === 0 && chosenGenres.length !== 0) {
      url = 'https://api.themoviedb.org/3/search/movie?query= ' + searchText + '&include_adult=false&language=en-US&page=' + page;
    } else {
      url = 'https://api.themoviedb.org/3/search/movie?query= ' + searchText +'&include_adult=false&language=en-US&primary_release_year= ' + releaseYear +'&page=' + page;
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
      genreFiltering(json.results)
      if(json.total_pages < 500) {
        setPageCount(json.total_pages)
      } else {
        setPageCount(500)
      }
      
      //setMovies(json.results)
    })
    .catch(error => {
      console.log(error)
    })
  }

  const searchGenres = () =>  {
    const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNDI4MDczZWUwMTU1OTE5MmNjZDdhMjg4ODYyNmJjYiIsIm5iZiI6MTczMjQ3OTI5Ni4xMDcwNzgsInN1YiI6IjY3MDk3YzZmZTFkYjllYzQ4NjJlOGYwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XMU9KwMHWQ7GxQR4VEqrw84ziQPlvhELy3WldDH4B6Q'
      }
    };

    fetch(url, options)
      .then(res => res.json())
      .then(json => setGenres(json.genres))
      .catch(err => console.error(err));
  }

  const handleSearchClick = () => {
    setSearchedGenres(chosenGenres)
    searchForMovie()
  }

  useEffect(() => {
    searchForMovie()
    searchGenres()
  }, [page])

  return (
    <>
    <Navbar />

    <div id="container">
      <h1>Movies</h1>
      <div className="searchForm">
        <label>Search for Movies: </label>
        <input className="textSearch" type="text" value={searchText} onChange={e => setSearchText(e.target.value)}></input>
        <div className="dropdownContainer">
          <div id="filters" className="filters">
            <label>Release Year:</label>
            <input className="releaseYear" value={releaseYear} onChange={e => setReleaseYear(e.target.value)}></input>
            <div className="genreDiv">
              <label>Genres:</label>
              <button id="genreButton" onClick={setVisibility}>
                Show
              </button>
              <Genres />
            </div>
          </div>
        </div>
        <button onClick={handleSearchClick}>Search</button>
        <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={(e) => setPage(e.selected + 1)}
        pageRangeDisplayed={7}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
       />
      </div>
      <Movies />
      {(() => {
          if(!movies ||movies.length === 0) {
              return (
                <>
                  <h2 className="errorText">No movies found.</h2>
                  <p className="errorText">Please change the search query and try again.</p>
                  <img src={spider} alt="spider" />
                </>
              
            )
          }
      })()}
    </div>
    
    <Footer />
    </>

  );
}

export default PublicMoviesList;