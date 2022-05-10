import React, { Component } from 'react'
import moment from 'moment';
import {
  Menu, Notifications
} from '@material-ui/icons'
import './style.css'
export class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 0,
      long: 0,
      data: [],
      temp:0,
      sunrise:0,
      sunset: 0,
      humidity:0,
    }
  }
  getWeather = async () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      this.setState({ lat: position.coords.latitude, long: position.coords.longitude });
    });
    let api = '1c90867eb3d9a99fcfecb874571a95dc'
    await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.lat}&lon=${this.state.long}&exclude=&appid=${api}`)
      .then(res => res.json())
      .then(result => {
        this.setState({ data: result})
        console.log(this.state.data)
      });
  }
  printWeather = () => {
    this.getWeather()
  }
  componentDidMount() {
    let latitude = 0;
    let longitude = 0;
    let api = '1c90867eb3d9a99fcfecb874571a95dc'

    let success = position => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      this.setState(
        {
          lat: latitude,
          long: longitude
        },
        () => console.log('jereo')
      );
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=&appid=${api}`)
      .then(res => res.json())
      .then(result => {
        this.setState({ data: result ,temp:result.current.temp, sunrise:result.current.sunrise,
        sunset: result.current.sunset, humidity: result.current.humidity})
        console.log(this.state.data)
      });
    };

    function error() {
      console.log("Unable to retrieve your location");
    }
    navigator.geolocation.getCurrentPosition(success, error);
  };
  render() {
    return (
      <div className='weather-container'>
        <nav className='vid-nav'>
          <Menu className='vid-nav' onClick={this.props.styleElement} style={{ cursor: 'pointer' }} />
          <div className='nav-right'>
            <Notifications className='vid-nav' style={{ cursor: 'pointer' }} />
            <img src='https://cdn.pixabay.com/photo/2021/08/31/11/59/androgynous-6588615_960_720.jpg' />
          </div>
        </nav>
        <div className='weather'>
          <div className='current'>
            <small>{moment().format('dddd')}, {moment().format('LL')}</small>
            <span className='city'>{this.state.data.timezone}</span>
            <span className='temp'>{parseInt(this.state.temp - 273.15)}&deg;C</span>
            <div className='right'>
              <span>Sunrise : {new Date(this.state.sunrise * 1000).toLocaleTimeString('en-IN')}</span>
              <span>Sunset : {new Date(this.state.sunset * 1000).toLocaleTimeString('en-IN')}</span>
              <span>Humidity {this.state.humidity}%</span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default index