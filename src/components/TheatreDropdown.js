import React, { useCallback, useEffect, useState } from "react";
import FinnkinoShowtimes from "../screens/FinnkinoShowtimes";

function TheatreDropdown() {
  const [areaId, setAreaId] = useState([]);
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

  return (
    <div>
      <select>
        {
          areas.map(area => (
            <option key={area.ID}>{area.Name}</option>
          ))
        }
      </select>
    </div>
  );
};

export default TheatreDropdown;
