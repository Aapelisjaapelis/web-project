import React, { useCallback, useEffect, useState } from "react";
import "./FinnkinoShowtimes.css";

function FinnkinoShowtimes() {
  const [showtimes, setShowtimes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [areaID, setAreaID] = useState([]);
  const [date, setDate] = useState([]);

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
        console.log(json.TheatreAreas.TheatreArea);
        setAreas(json.TheatreAreas.TheatreArea);
      })
      .catch(error => {
        console.log(error)
      })
  },[parseXML]);

  const onChangeHandler = (value) => {
    if (value.length > 4) {
      setDate(value);
      console.log(url);
    } else {
      setAreaID(value);
      console.log(url);
    }
    getShowtimes();
  }
  
  const getShowtimes = useCallback(() => {
    console.log(url);
    fetch(url)
      .then(response => response.text())
      .then(xml => {
        const json = parseXML(xml);
        setShowtimes(json.Schedule.Shows.Show);
      })
      .catch(error => {
        console.log(error)
      })
  },[parseXML, url]);

  return (
    <>
      <h1>Finnkino Showtimes</h1>
      <select onChange={e => onChangeHandler(e.target.value)}>
        {
        areas.map(area => (
          <option key={area.ID} value={area.ID}>{area.Name}</option>
        ))
        }
      </select>
      <input type="date" value={date} onChange={e => onChangeHandler(e.target.value)} />

        {
          showtimes.map(showtime => (
            <div key={showtime.ID}>{new Date(showtime.dttmShowStart).getHours()}:{new Date(showtime.dttmShowStart).getMinutes().toString().padStart(2, '0')} {showtime.Title}</div>
          ))
        }
    </>
  );
};

export default FinnkinoShowtimes; 