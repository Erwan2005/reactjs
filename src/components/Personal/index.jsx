import React, { Component } from 'react'
import { PhotoCamera } from '@material-ui/icons';
import {
  Person, MenuBook, Room,
  Cake, Favorite, People, Email
} from '@material-ui/icons';
import { connect } from "react-redux";
import { Route, Switch, withRouter, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { publicRequest, userRequest, parseRequest } from '../../requestMethods';
import './style.css'
export class index extends Component {
  constructor(props) {
    super(props);
    this.reftextarea = React.createRef();
    this.refImg = React.createRef();
    this.refAv = React.createRef();
    this.state = {
      disabled: true,
      covert: '',
      avatar: '',
      about: '',
    }
  };
  activeOrnot = () => {
    this.setState({ disabled: !this.state.disabled })
  }

  docHandler = async (e) => {

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        console.log('file readed')
      }
    }
    reader.readAsDataURL(e.target.files[0])
    const file = e.target.files[0];
    if (file.size > 3e6) {
      toast.error("Please upload a file smaller than 3 MB");
      return false;
    } else {
      if (file.type.split('/')[0] === 'image') {
        if (e.target.name === 'covert') {
          this.updateData('covert', file)
        } else if (e.target.name === 'avatar') {
          this.updateData('avatar', file)
        }
      } else {
        toast.error("Please upload an image file");
      }
    }
  };
  getProfile = async () => {
    let data = await userRequest.get(`userapp/users/${this.props.user.id}`).then(({ data }) => data)
    this.setState({ covert: data.img_covert, avatar: data.avatar, about: data.about_me })
  }
  updateData = async (val, value) => {
    if (val === 'about_me') {
      let formData = new FormData();
      formData.append("about_me", value)
      let data = await publicRequest.patch(`userapp/users/${this.props.user.id}/`, formData).then(({ data }) => data)
      this.setState({ about: data.about_me })
      this.setState({ disabled: !this.state.disabled })
    } else if (val === 'covert') {
      let formData = new FormData();
      formData.append(
        "img_covert",
        value,
        value.name)
      let data = await parseRequest.patch(`userapp/users/${this.props.user.id}/`, formData).then(({ data }) => data)
      this.setState({ covert: data.img_covert })
    } else if (val === 'avatar') {
      let formData = new FormData();
      formData.append(
        "avatar",
        value,
        value.name)
      let data = await parseRequest.patch(`userapp/users/${this.props.user.id}/`, formData).then(({ data }) => data)
      this.setState({ avatar: data.avatar })
    }

  }
  componentDidMount() {
    this.getProfile()

  };
  render() {
    return (
      <div className='perso-container'>
        <div className='perso-header'>
          <div className='header-top'>
            <img src={this.state.covert} alt='mur' />
            <div className='mur-badge' onClick={(event) => {
              event.preventDefault();
              this.refImg.current.click();
            }}><span><PhotoCamera /></span></div>
            <input type='file' onChange={(e) => {
              this.docHandler(e);
            }} ref={this.refImg} style={{ display: 'none' }} name='covert' />
            <div className='avatar'>
              <div className='avatar-relative'>
                <img src={this.state.avatar} alt='avatar' />
                <span onClick={(event) => {
                  event.preventDefault();
                  this.refAv.current.click()
                }}><PhotoCamera /></span>
                <input type='file' onChange={(e) => {
                  this.docHandler(e);
                }} ref={this.refAv} style={{ display: 'none' }} name='avatar' />
              </div>
            </div>
          </div>

          <div className='menu'>
            <ul>
              <li>Image</li>
              <li>Videos</li>
              <li>Pages</li>
              <li>Groups</li>
              <div className="animation start"></div>
            </ul>
          </div>
        </div>
        <div className='perso-footer'>
          <div className='footer-left'>
            <div className='top'>
              <span>Personal infos</span>
            </div>
            <span>About</span>
            <div className='input-data'>
              {this.state.disabled ?
                <small>{this.state.about}</small> :
                <textarea disabled={(this.state.disabled) ? "disabled" : ""}
                  value={this.state.about}
                  onChange={e => this.setState({ about: e.target.value })} />}
              {this.state.disabled ? <span onClick={this.activeOrnot}>&#9998;</span> : <button onClick={() => this.updateData('about_me', this.state.about)}>&#10003;</button>}
            </div>
          </div>
          <div className='footer-right'>
          </div>
        </div>
      </div >
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
});
export default connect(mapStateToProps, null)(withRouter(index))