import React, { Component } from 'react'
import { formatToLocalTime, iconUrlFromCode } from "./services/weatherService";
import { CircularProgress } from '@material-ui/core';
import './style.css'
export class index extends Component {
  constructor(props) {
    super(props);
    this.handleLocationClick = this.handleLocationClick.bind(this)
    this.handleUnitsChange = this.handleUnitsChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }
  handleLocationClick = () =>{
    this.props.locationWeather()
  }
  handleUnitsChange = (unit) => {
    this.props.handleUnitsChange(unit)
  }
  handleSearch = () => {
    this.props.handleSearch('weather')
  }

  componentDidMount() {
    this.handleSearch()
    this.handleLocationClick()
  }
  componentWillUnmount() {
    this.props.handleSearch('')
  }
  render() {
    return (
      <div className='weather'>
        <div className='header'>
          <span className='btn' onClick={this.handleLocationClick}><ion-icon name="location-outline" /></span>
          <span><small className='btn' name="metric" onClick={() => this.handleUnitsChange('metric')}>°C</small> | <small className='btn' name="imperial" onClick={() => this.handleUnitsChange('imperial')}>°F</small></span>
        </div>
        {this.props.loading ? <div className='loader'> 
          <CircularProgress color="white" size="50px" />
        </div>
        : <>
        {this.props.weather && <>
          <div className='middle'>

            <small className='times'>
              {formatToLocalTime(this.props.weather.dt, this.props.weather.timezone)}
            </small>
            <span className='contry'>{this.props.weather.name} , {this.props.weather.country}</span>
            <img src={iconUrlFromCode(this.props.weather.icon)} alt="" className="w-20" />
            <div className='details'>
              <div>
                <p className="temp">{`${this.props.weather.temp.toFixed()}°`}</p>
              </div>
              <div className='right'>
                <small>Real fell: {`${this.props.weather.feels_like.toFixed()}°`}</small>
                <small>Humidity: {`${this.props.weather.humidity.toFixed()}%`}</small>
                <small>Wind: {`${this.props.weather.speed.toFixed()} km/h`}</small>
              </div>
            </div>
            <div className='feet'>
              <span><ion-icon name="sunny-outline" /></span>
              <small>Rise: {formatToLocalTime(this.props.weather.sunrise, this.props.weather.timezone, "hh:mm a")} | </small>
              <span><ion-icon name="partly-sunny-outline" /></span>
              <small>Set: {formatToLocalTime(this.props.weather.sunset, this.props.weather.timezone, "hh:mm a")} | </small>
              <span><ion-icon name="arrow-up-outline" /></span>
              <small>High: {`${this.props.weather.temp_max.toFixed()}°`} | </small>
              <span><ion-icon name="arrow-down-outline" /></span>
              <small>Low: {`${this.props.weather.temp_min.toFixed()}°`}</small>
            </div>

          </div>
          <div className='footer'>
            <div className='head'>
              <span>Hourly forecast</span>
            </div>
            <div className='contents'>
              {this.props.weather.hourly.map((item, index) => (
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
              {this.props.weather.daily.map((item, index) => (
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