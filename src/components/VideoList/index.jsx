import React, { Component } from 'react'
import './style.css'
export class index extends Component {
  render() {
    return (
      <div className='lists'>
          <div className='list-card'>
              <div className='thumbnail'>
                <img src="https://cdn.pixabay.com/photo/2022/04/24/16/06/nature-7153955_960_720.jpg" />
              </div>
              <div className='vid-description'>
                <img src='https://cdn.pixabay.com/photo/2021/08/31/11/59/androgynous-6588615_960_720.jpg' />
                <div>
                    <span>Chiengdfgdfgfdgdfgdfgdfgfdgdfgdfgdfgdfgdfgdfg</span>
                    <small>Erwan</small>
                </div>
              </div>
          </div>
      </div>
    )
  }
}

export default index