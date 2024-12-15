import React from "react";
import { useCallback, useState, useEffect } from "react";
import "./GroupsPage.css";
import Navbar from "../components/Navbar.js"
import axios from "axios";
import ReactPaginate from 'react-paginate';
import { useUser } from "../context/useUser.js";
import { useLocation, useNavigate } from "react-router-dom";

const url = process.env.REACT_APP_API_URL
const api_key = process.env.REACT_APP_TMDB_API_KEY

function GroupAddShowtimes () {
    const location = useLocation();
    const navigate = useNavigate();
    const {user, updateToken} = useUser();

    const [areas, setAreas] = useState([])
    const [chosenArea, setChosenArea] = useState('')
    const [chosenDate, setChosenDate] = useState('')
    const [chosenShowtime, setChosenShowtime] = useState('')
    const [showtimes, setShowtimes] = useState([]);
    const [pageCount, setPageCount] = useState(0)
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState('')
    const [movies, setMovies] = useState([])
    const [movieId, setMovieId] = useState('')
    //const [groupId, setGroupId] = useState(location.state)
    const [group, setGroup] = useState(location.state)

    //Get the theatre areas for the select element
    const getTheatreAreas = () => {
        fetch('https://www.finnkino.fi/xml/TheatreAreas/')
            .then(response => response.text())
            .then(xml => {
                parseTheatreAreas(xml)
            })
            .catch(error => {
                console.log(error)
            })
    }

    //Make an array of objects from the theatreareas
    const parseTheatreAreas = (xml) => {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(xml, 'application/xml')
        const root = xmlDoc.children
        const theatres = root[0].children
        const tempAreas = []
        for (let i = 0; i < theatres.length; i++) {
            tempAreas.push({"id": theatres[i].children[0].innerHTML, "name": theatres[i].children[1].innerHTML})
        }
        setAreas(tempAreas)
    }

    //XmlToJson function
    const xmlToJson = useCallback((node) => {
        const json = {};
    
        let children = [...node.children];
    
        if (!children.length) return node.innerHTML;
    
        for (let child of children ) {
          const hasSibling = children.filter(c => c.nodeName === child.nodeName).length > 1;
    
          if (hasSibling) {
            if (json[child.nodeName] === undefined) {
              json[child.nodeName] = [xmlToJson(child)];
            } else {
              json[child.nodeName].push(xmlToJson(child));
            }
          } else {
            json[child.nodeName] = xmlToJson(child);
          }
        }
        return json;
      },[]);

      //ParseXML function
      const parseXML = useCallback((xml) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "application/xml");
        return (xmlToJson(xmlDoc));
      },[xmlToJson]);

      //Get showtimes
    const getShowtimes = () => {
        fetch("https://www.finnkino.fi/xml/Schedule/?area=" + chosenArea + "&dt=" + chosenDate)
        .then(response => response.text())
        .then(xml => {
            const json = parseXML(xml);
            setShowtimes(json.Schedule.Shows.Show)
            setChosenShowtime('')
        })
        .catch(error => {
            console.log(error);
        })
    }

    //Changedate for making the date in the form to the right format
    const changeDate = (value) => {
        const formattedDate = value.split("-").reverse().join(".");
        setChosenDate(formattedDate);
    }

    //Main form submit
    const handleShowtimeSubmit = () => {
      //Make the gotten string to an array. If value not assigned already, get the value from the select
      let showtimeString = ''
      let showtimeArr = []

      if(chosenShowtime.length === 0) {
        showtimeString = document.getElementById("showtimeSelect").value
        setChosenShowtime(document.getElementById("showtimeSelect").value)
        showtimeArr = showtimeString.split(',')
      } else {
        showtimeArr = chosenShowtime.split(',')
      }
      console.log(showtimeArr)
      console.log(movieId)

      let strChosenDate = ""
      if(chosenDate.length === 0) {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const day = new Date().getDate();
        setChosenDate(day + "." + month + "." + year)
        strChosenDate = day + "." + month + "." + year
      } else {
        strChosenDate = chosenDate
      }

      //Check if showtime has been given at all. 
      if(showtimeArr.length < 3) {
        alert("Please choose a sufficient showtime.")
      } else {
        const headers = {headers: {Authorization: "Bearer " + user.access_token}}
          axios.post(url+'/group/addShowtime',{
              groupId: group.id, 
              movieId: movieId, 
              finnkinoId: showtimeArr[0],
              finnkinoMovieId: showtimeArr[1],
              finnkinoMovieName: showtimeArr[2],
              finnkinoMovieDate: strChosenDate
          }, headers)
          .then(response => {
            navigate("/SpecificGroupPage",{ state: group})
          }).catch(error => {
            alert("Something went wrong. Please try again.")
            console.log(error.response.data.error ? error.response.data.error : error)
          })
      }
    }

    //Search for movies in movieDB
    const searchForMovie = () => {
      let url = ''
      
      if(searchText.length !== 0) {
        url = 'https://api.themoviedb.org/3/search/movie?query= ' + searchText + '&include_adult=false&language=en-US&page=' + page;
      } else {
        url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=' + page + '&sort_by=popularity.desc';
      }
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: api_key
        }
      };
      fetch(url, options)
      .then(response => response.json())
      .then(json => {
        if(json.total_pages < 500) {
          setPageCount(json.total_pages)
        } else {
          setPageCount(500)
        }
        setMovies(json.results)
      })
      .catch(error => {
        console.log(error)
      })
    }

    //UseEffect. Gets theatre areas and showtimes.
    useEffect(() => {
        getTheatreAreas()
        getShowtimes()
        searchForMovie()
    }, [page])

    return (
      <>
      <Navbar/>
        <div className="showtimes-body">
            <div className="showtimes-body2">
                <h1>Add Showtimes</h1>
                <br />
                <h3>Finnkino showtime</h3>
                <select className="selectCatalog" onChange={e => setChosenArea(e.target.value)}>
                    {
                        areas.map(area => (
                            <option key={area.id} value={area.id}>{area.name}</option>
                        ))
                    }
                </select>
                
                <input className="dateChanger" type="date" onChange={e => changeDate(e.target.value)} />
                <button className="showtime-Button" id="searchButton" onClick={() => getShowtimes()}>Search</button>
                &emsp;&emsp;
                <button className="showtime-Button" onClick={() => handleShowtimeSubmit()}>Submit Showtime</button>
                <br /> <br />
                <select id="showtimeSelect" className="groupFormSelect" onChange={e => setChosenShowtime(e.target.value)} required>
                {(() => {
                    if (!showtimes || showtimes.length === 0) {
                      return(<option className="timeformovie" disabled> -- No showtimes found. Please select other filters and try again. -- </option>)
                    } else if (typeof(showtimes) === "object" && !Array.isArray(showtimes)) {
                      return <option className="timeformovie" value={[showtimes.ID, showtimes.EventID, showtimes.Title]} key={showtimes.ID}>{new Date(showtimes.dttmShowStart).getHours()}:{new Date(showtimes.dttmShowStart).getMinutes().toString().padStart(2, '0')} {showtimes.Title} &nbsp; &nbsp; - &nbsp; &nbsp; </option>
                    } else {
                      return (
                        showtimes.map(showtime => (
                          <option className="timeformovie" value={[showtime.ID, showtime.EventID, showtime.Title]} key={showtime.ID}>{new Date(showtime.dttmShowStart).getHours()}:{new Date(showtime.dttmShowStart).getMinutes().toString().padStart(2, '0')} {showtime.Title} &nbsp; - &nbsp; {showtime.Theatre}</option>
                        ))
                      )
                    } 
                  })()}
                </select> <br />
                <br />
                <div className="searchForm">
                  <h3>You may search and select the movie in question from below.</h3>
                  <p className="white">This way, more information on the movie can be displayed.</p>
                  <input className="textSearch" type="text" value={searchText} 
                  onChange={e => setSearchText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      searchForMovie()
                    }
                  }}
                  ></input>
                  <ReactPaginate
                    className="counting"
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={(e) => setPage(e.selected + 1)}
                    pageRangeDisplayed={7}
                    pageCount={pageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                  />
                  <div className="movieSelectionDiv">
                  <input type="radio" name="movieSelect" className="timeformovie" id="none" onChange={e => setMovieId(null)} defaultChecked="checked"/>
                  <label htmlFor="none">--- Empty ---</label><br/>
                  {(() => {
                      if(!movies ||movies.length === 0) {
                          return (
                            <>
                              <h2 className="errorText">No movies found.</h2>
                              <p className="errorText">Please change the search query and try again.</p>
                            </>
                          
                        )
                      } else {
                        
                      }
                  })()}
                      {movies && movies.map(movie => (
                        <>
                          <input type="radio" name="movieSelect" className="timeformovie" key={movie.id} value={movie.title} id={movie.id} onChange={e => setMovieId(movie.id)}/>
                          <label htmlFor={movie.id}>{movie.title}</label><br/>
                        </>
                      ))}
                  </div>
                </div>
            </div>
        </div>
      </>
    )
}

export default GroupAddShowtimes;