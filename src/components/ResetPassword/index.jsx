import React, { Component } from 'react'
import './style.css'
import { userRequest } from '../../requestMethods';

export class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      textError: '',
      error: false,
      sending: false,
    }
    this.close = this.close.bind(this)
  }
  close = () => {
    this.props.handleClose()
  }

  onchange = (e) => {
    const mail = /\S+@\S+\.\S+/;
    if (mail.test(e.target.value)) {
      this.setState({ error: false })
    } else {
      this.setState({ error: true, textError: 'Invalid email' })
    }
    this.setState({ email: e.target.value })
  }
  send = async () => {
    const formData = new FormData();
    formData.append("email", this.state.email)
    try{
      await userRequest.post('reset/users/reset_password/', formData)
      this.setState({ error: false, sending: true})
    }catch (error) {
      this.setState({ error: true, textError: 'Mail not found'})
    }
  }
  render() {
    return (
      <div className='reset-container'>
        <div className='container'>
          <span className='title'>Password reset</span>
          {this.state.sending ? <>
            <span className='sending'>Request is done</span>
            <span className='sending'>Please check your Email</span>
          </> : <>
            <input type="text" placeholder='E-mail ..'
              value={this.state.email}
              onChange={this.onchange} />
            {this.state.error && <span className='error'>{this.state.textError}</span>}
            <button onClick={this.send}>Check</button>
          </>}
          <span className='close' onClick={this.close}><ion-icon name="close-outline" /></span>
        </div>
      </div>
    )
  }
}

export default index