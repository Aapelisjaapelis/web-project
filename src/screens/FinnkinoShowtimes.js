import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar.js"
//Carousel
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "./FinnkinoShowtimes.css";

function FinnkinoShowtimes() {
  const [showtimes, setShowtimes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [areaID, setAreaID] = useState("");
  const [date, setDate] = useState("");

  //Carousel settings
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: true
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const url = "https://www.finnkino.fi/xml/Schedule/?area=" + areaID + "&dt=" + date;

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

  const parseXML = useCallback((xml) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");
    return (xmlToJson(xmlDoc));
  },[xmlToJson]);

  useEffect(() => {
    fetch("https://www.finnkino.fi/xml/TheatreAreas/")
      .then(response => response.text())
      .then(xml => {
        const json = parseXML(xml);
        setAreas(json.TheatreAreas.TheatreArea);
        getShowtimes();
      })
      .catch(error => {
        console.log(error);
      })
  },[parseXML]);

  const changeArea = (value) => {
      setAreaID(value);
  }

  const changeDate = (value) => {
      const formattedDate = value.split("-").reverse().join(".");
      setDate(formattedDate);
  }
  
  const getShowtimes = () => {
    fetch(url)
      .then(response => response.text())
      .then(xml => {
        const json = parseXML(xml);
        setShowtimes(json.Schedule.Shows.Show);
      })
      .catch(error => {
        console.log(error);
      })
  }

  const CheckShowtimes = () => {
      if (!showtimes || showtimes.length === 0) {
        return <div>No showtimes found</div>
      } else if (typeof(showtimes) === "object" && !Array.isArray(showtimes)) {
        return <div className="timeformovie" key={showtimes.ID}>{new Date(showtimes.dttmShowStart).getHours()}:{new Date(showtimes.dttmShowStart).getMinutes().toString().padStart(2, '0')} {showtimes.Title}</div>
      } else {
        return (
          showtimes.map(showtime => (
            <div className="timeformovie" key={showtime.ID}>{new Date(showtime.dttmShowStart).getHours()}:{new Date(showtime.dttmShowStart).getMinutes().toString().padStart(2, '0')} {showtime.Title}</div>
          ))
        )
      }
    }

    //Carousel for showtimes
    const ShowtimeCarousel = () => {
      if (!showtimes || showtimes.length === 0){
        return <div className="white">No showtimes found</div>
      } else if (typeof(showtimes) === "object" && !Array.isArray(showtimes)) {
        return(
        <div className="slider-image-container">
            <div>
              <img src={showtimes.Images.EventMediumImagePortrait} alt={showtimes.Title}></img>
            </div>
            <p>{showtimes.Title}</p>
            <p>{new Date(showtimes.dttmShowStart).getHours()}:{new Date(showtimes.dttmShowStart).getMinutes().toString().padStart(2, '0')}</p>
            <p>{showtimes.Theatre}</p>
        </div>)
      } else {
        if(showtimes.length < 4) {
          settings.slidesToShow = showtimes.length
          settings.slidesToScroll = showtimes.length
          for (let i = 0; i < 4; i++) {
            if(settings.responsive[i].settings.slidesToShow > showtimes.length) {
              settings.responsive[i].settings.slidesToShow = showtimes.length
              settings.slidesToScroll = showtimes.length
            }
          }
        }
        return (
          <div className="slider-container">
            <Slider {...settings}>
              {showtimes.map(showtime => (
                <div className="slider-image-container">
                  <div>
                    <img src={showtime.Images.EventMediumImagePortrait} alt={showtime.Title}></img>
                  </div>
                  <p>{showtime.Title}</p>
                  <p>{new Date(showtime.dttmShowStart).getHours()}:{new Date(showtime.dttmShowStart).getMinutes().toString().padStart(2, '0')}</p>
                  <p>{showtime.Theatre}</p>
                </div>
              ))}
            </Slider>
          </div>
        )
      }
    }

    return (
      <>
        <Navbar/>
        <div className="showtimes-body">
          <div>
            <h1>Finnkino Showtimes</h1>
            <select className="selectCatalog"onChange={e => changeArea(e.target.value)}>
              {
              areas.map(area => (
                <option key={area.ID} value={area.ID}>{area.Name}</option>
              ))
              }
            </select>
            <input className="dateChanger" type="date" onChange={e => changeDate(e.target.value)} />
  
            
            <button className="showtime-Button" id="searchButton" onClick={() => getShowtimes(url)}>Search</button>
            <br /><br /><br /><br />
            <ShowtimeCarousel />
          </div>
        </div>
      </>
    );
  }

export default FinnkinoShowtimes; 