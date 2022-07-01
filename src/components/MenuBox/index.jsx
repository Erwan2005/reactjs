import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import './style.css'
export class index extends Component {
    constructor(props) {
        super(props);
        this.openModal = this.openModal.bind(this)
        this.logout = this.logout.bind(this)
    }

    openModal = () => {
        this.props.openModal()
    }
    logout = () => {
        this.props.logout()
    }
  render() {
    return (
      <div className='menu-container'>
        {this.props.children}
      </div>
    )
  }
}

export default withRouter(index)