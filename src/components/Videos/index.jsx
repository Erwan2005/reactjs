import React, { Component } from 'react'
import {
  Menu, Search, Notifications,
  Mail, Person, VideoCall
} from '@material-ui/icons'
import VideoList from '../VideoList'
import './style.css'
export class index extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='vid-containair'>
        <nav className='vid-nav'>
          <Menu className='vid-nav' onClick={this.props.styleElement} style={{ cursor: 'pointer' }} />
          <div className='vid-search'>
            <label>
              <input type="text" placeholder="Search ..." />
              <span><Search /></span>
            </label>
          </div>
          <div className='nav-right'>
            <VideoCall className='vid-nav' style={{ cursor: 'pointer' }} />
            <Notifications className='vid-nav' style={{ cursor: 'pointer' }} />
            <img src='https://cdn.pixabay.com/photo/2021/08/31/11/59/androgynous-6588615_960_720.jpg' />
          </div>
        </nav>
        <div className='vid-central'>
          <VideoList />
        </div>
      </div>
    )
  }
}

export default index