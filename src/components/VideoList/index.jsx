import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './style.css'
export class index extends Component {
  render() {
    return (
      <div className='lists'>
        <div className='list-card'>
          <NavLink to={'/player'} className='link'>
            <div className='thumbnail'>
              <video src='https://static.videezy.com/system/resources/previews/000/002/415/original/macro-view-of-spider-web.mp4' />
            </div>
            <div className='vid-description'>
              <img src='https://cdn.pixabay.com/photo/2021/08/31/11/59/androgynous-6588615_960_720.jpg' />
              <div>
                <span>Chiengdfgdfgfdgdfgdfgdfgfdgdfgdfgdfgdfgdfgdfg</span>
                <small>Erwan</small>
              </div>
            </div>
          </NavLink>
        </div>
      </div >
    )
  }
}

export default index