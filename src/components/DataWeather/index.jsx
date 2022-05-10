import './style.css';
import React, { useEffect, useState } from "react";
import moment from 'moment';
export default function Index() {
  
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(function(position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });
      let api = '1c90867eb3d9a99fcfecb874571a95dc'
      let lati = lat
      let longi = long
      await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lati}&lon=${longi}&exclude=&appid=${api}`)
      .then(res => res.json())
      .then(result => {
        setData(result)
        console.log(result)
      });
    }
    fetchData();
  }, [lat,long])
  
  return (
    <div className="container">.
      <div className="card">
        <div className="header">
        {data.timezone}<br/>
        <p>{moment().format('dddd')},</p>
        <p>{moment().format('LL')}</p>
        <span>Temperature {parseInt(data.current.temp - 273.15)}&deg;C</span><br />
        <span>Sunrise {new Date(data.current.sunrise * 1000).toLocaleTimeString('en-IN')}</span><br/>
        <span>Sunset {new Date(data.current.sunset * 1000).toLocaleTimeString('en-IN')}</span><br/>
        <span>Humidité {data.current.humidity}%</span>
        </div>
      </div>
    </div>
  );
}