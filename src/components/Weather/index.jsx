import React, { Component } from 'react'
import getFormattedWeatherData from "./services/weatherService";
import { formatToLocalTime, iconUrlFromCode } from "./services/weatherService";
import { CircularProgress } from '@material-ui/core';
import './style.css'
export class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: null,
      query: {
        q: 'toamasina'
      },
      units: 'metric',
      loading: false,
    }
  }
  handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        this.setState({
          query: {
            lat,
            lon,
          }
        }, () => {
          fetchWeather()
        });
      });
    }
    const fetchWeather = async () => {
      this.setState({loading: true})
      const units = this.state.units
      await getFormattedWeatherData({ ...this.state.query, units }).then((data) => {

        this.setState({ weather: data });
      });
      this.setState({loading: false})
    };

  };
  handleUnitsChange = async (unit) => {
    this.setState({ units: unit }, () => {
      fetchWeather()
    })
    const fetchWeather = async () => {
      this.setState({loading: true})
      const units = this.state.units
      await getFormattedWeatherData({ ...this.state.query, units }).then((data) => {

        this.setState({ weather: data });
      });
      this.setState({loading: false})
    };

  };
  componentDidMount() {
    this.handleLocationClick()
  }
  render() {
    return (
      <div className='weather'>
        <div className='header'>
          <span className='btn' onClick={this.handleLocationClick}><ion-icon name="location-outline" /></span>
          <span><small className='btn' name="metric" onClick={() => this.handleUnitsChange('metric')}>°C</small> | <small className='btn' name="imperial" onClick={() => this.handleUnitsChange('imperial')}>°F</small></span>
        </div>
        {this.state.loading ? <div className='loader'> 
          <CircularProgress color="white" size="50px" />
        </div>
        : <>
        {this.state.weather && <>
          <div className='middle'>

            <small className='times'>
              {formatToLocalTime(this.state.weather.dt, this.state.weather.timezone)}
            </small>
            <span className='contry'>{this.state.weather.name} , {this.state.weather.country}</span>
            <img src={iconUrlFromCode(this.state.weather.icon)} alt="" className="w-20" />
            <div className='details'>
              <div>
                <p className="temp">{`${this.state.weather.temp.toFixed()}°`}</p>
              </div>
              <div className='right'>
                <small>Real fell: {`${this.state.weather.feels_like.toFixed()}°`}</small>
                <small>Humidity: {`${this.state.weather.humidity.toFixed()}%`}</small>
                <small>Wind: {`${this.state.weather.speed.toFixed()} km/h`}</small>
              </div>
            </div>
            <div className='feet'>
              <span><ion-icon name="sunny-outline" /></span>
              <small>Rise: {formatToLocalTime(this.state.weather.sunrise, this.state.weather.timezone, "hh:mm a")} | </small>
              <span><ion-icon name="partly-sunny-outline" /></span>
              <small>Set: {formatToLocalTime(this.state.weather.sunset, this.state.weather.timezone, "hh:mm a")} | </small>
              <span><ion-icon name="arrow-up-outline" /></span>
              <small>High: {`${this.state.weather.temp_max.toFixed()}°`} | </small>
              <span><ion-icon name="arrow-down-outline" /></span>
              <small>Low: {`${this.state.weather.temp_min.toFixed()}°`}</small>
            </div>

          </div>
          <div className='footer'>
            <div className='head'>
              <span>Hourly forecast</span>
            </div>
            <div className='contents'>
              {this.state.weather.hourly.map((item, index) => (
                <div className='items' key={index}>
                  <small>{item.title}</small>
                  <img src={iconUrlFromCode(item.icon)} alt="" />
                  <small>{`${item.temp.toFixed()}°`}</small>
                </div>
              ))}
            </div>
            <div className='head'>
              <span>Daily forecast</span>
            </div>
            <div className='contents'>
              {this.state.weather.daily.map((item, index) => (
                <div className='items' key={index}>
                  <small>{item.title}</small>
                  <img src={iconUrlFromCode(item.icon)} alt="" />
                  <small>{`${item.temp.toFixed()}°`}</small>
                </div>
              ))}
            </div>
          </div>
        </>}
      </>}</div>
    )
  }
}

export default index