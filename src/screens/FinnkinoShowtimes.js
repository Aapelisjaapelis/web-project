import React, { useCallback, useEffect, useState } from "react";
import "./FinnkinoShowtimes.css";

function FinnkinoShowtimes() {
  const [showtimes, setShowtimes] = useState([]);
  const [areas, setAreas] = useState([]);

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
  
  const setArea = useCallback((value) => {
    fetch("https://www.finnkino.fi/xml/Schedule/?area=" + value)
      .then(response => response.text())
      .then(xml => {
        const json = parseXML(xml);
        //console.log(json.Schedule.Shows.Show);
        setShowtimes(json.Schedule.Shows.Show);
        /* let st = json.Schedule.Shows.Show[0];
        let utcst = new Date(st.dttmShowStart);
        console.log(utcst.getHours());
        console.log(utcst.getMinutes()); */
      })
      .catch(error => {
        console.log(error)
      })
  },[parseXML]);

  return (
    <>
      <h1>Finnkino Showtimes</h1>
      <select onChange={e => setArea(e.target.value)}>
        {
          areas.map(area => (
            <option key={area.ID} value={area.ID}>{area.Name}</option>
          ))
        }
      </select>
        {
          showtimes.map(showtime => (
            
            <div key={showtime.ID}>{new Date(showtime.dttmShowStart).getHours()}:{new Date(showtime.dttmShowStart).getMinutes().toString().padStart(2, '0')} {showtime.Title}</div>
          ))
        }
    </>
  );
};

export default FinnkinoShowtimes;