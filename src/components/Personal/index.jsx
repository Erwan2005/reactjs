import React, { Component } from 'react'
import Resizer from "react-image-file-resizer";
import { PhotoCamera } from '@material-ui/icons';
import { avatarUpdate, covertUpdate, usernameUpdate } from "../../context/userRedux";
import Avatar from '../../assets/user.jpg'
import Cover from '../../assets/cover.jpg'
import { connect } from "react-redux";
import Post from '../Post'
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
      div: '',
      covert: '',
      avatar: '',
      about: '',
      username: '',
      firstname: '',
      lastname: '',
      birth: '',
      search: '',
      publication: [],
      page: 1,
      more_exist: false,
      end: false,
    }
    this.handleSearch = this.handleSearch.bind(this);
  };
  handleSearch(type) {
    console.log(type)
  }
  activeOrnot = (div) => {
    this.setState({ disabled: !this.state.disabled, div: div })
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
          try {
            Resizer.imageFileResizer(
              file,
              900,
              300,
              "JPEG",
              100,
              0,
              (uri) => {
                this.updateData('covert', uri)
              },
              "base64",
              900,
              300
            );
          } catch (err) {
            console.log(err);
          }

        } else if (e.target.name === 'avatar') {
          try {
            Resizer.imageFileResizer(
              file,
              100,
              100,
              "JPEG",
              100,
              0,
              (uri) => {
                this.updateData('avatar', uri)
              },
              "base64",
              100,
              100
            );
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        toast.error("Please upload an image file");
      }
    }
  };
  getProfile = () => {
    const user = this.props.users.filter((user) => user.id == this.props.user.id)
    console.log(user)
    this.setState({
      covert: user[0].img_covert, avatar: user[0].avatar, about: user[0].about_me,
      username: user[0].username, firstname: user[0].first_name, lastname: user[0].last_name, birth: user[0].birth_date
    })
  }
  updateData = async (val, value) => {
    if (val === 'about_me') {
      let formData = new FormData();
      formData.append("about_me", value)
      let data = await publicRequest.patch(`userapp/users/${this.props.user.id}/`, formData).then(({ data }) => data)
      this.setState({ about: data.about_me, div: '' })
    } else if (val === 'covert') {
      let formData = new FormData();
      formData.append(
        "img_covert",
        value)
      this.props.dispatchs(covertUpdate(value))
      let data = await parseRequest.patch(`userapp/users/${this.props.user.id}/`, formData).then(({ data }) => data)
      this.setState({ covert: data.img_covert, div: '' })
    } else if (val === 'avatar') {
      let formData = new FormData();
      formData.append(
        "avatar",
        value)
      this.props.dispatchs(avatarUpdate(value))
      let data = await parseRequest.patch(`userapp/users/${this.props.user.id}/`, formData).then(({ data }) => data)
      this.setState({ avatar: data.avatar, div: '' })
    } else if (val === 'username') {
      let formData = new FormData();
      formData.append("username", value)
      this.props.dispatchs(usernameUpdate(value))
      let data = await publicRequest.patch(`userapp/users/${this.props.user.id}/`, formData).then(({ data }) => data)
      this.setState({ username: data.username, div: '' })

    } else if (val === 'name') {
      let formData = new FormData();
      formData.append("first_name", value)
      let data = await publicRequest.patch(`userapp/users/${this.props.user.id}/`, formData).then(({ data }) => data)
      this.setState({ firstname: data.first_name, div: '' })
    } else if (val === 'lastname') {
      let formData = new FormData();
      formData.append("last_name", value)
      let data = await publicRequest.patch(`userapp/users/${this.props.user.id}/`, formData).then(({ data }) => data)
      this.setState({ lastname: data.last_name, div: '' })
    }
    else if (val === 'birth') {
      let formData = new FormData();
      formData.append("birth_date", value)
      let data = await publicRequest.patch(`userapp/users/${this.props.user.id}/`, formData).then(({ data }) => data)
      this.setState({ birth: data.birth_date, div: '' })
    }

  }
  getPub = async () => {
    try {
      this.setState({ loading: true })
      let data = await userRequest.get(`userapp/publication/?page=${this.state.page}`)
        .then(({ data }) => data)
      if (data.next) {
        this.setState({ page: this.state.page + 1 })
      } else {
        this.setState({ more_exist: false, end: true })
      }
      data.results && data.results.map((pub, index) => {
        if (pub.user === this.props.user.id) {
          this.setState({ publication: this.state.publication.concat(pub) })
        }
      })

    } catch (error) {
      window.location.reload(true);
    }


  }
  componentDidMount() {
    this.getProfile()
    const pub = this.props.publication.filter((pub) => pub.user == this.props.user.id)
    this.setState({ publication: pub })

  };
  render() {
    return (
      <div className='perso-container'>
        <div className='perso-header'>
          <div className='header-top'>
            <img src={this.props.user.covert ? this.props.user.covert : Cover} alt='' />
            <div className='mur-badge' onClick={(event) => {
              event.preventDefault();
              this.refImg.current.click();
            }}><span><PhotoCamera /></span></div>
            <input type='file' onChange={(e) => {
              this.docHandler(e);
            }} ref={this.refImg} style={{ display: 'none' }} name='covert' />
            <div className='avatar'>
              <div className='avatar-relative'>
                <img src={this.props.user.avatar ? this.props.user.avatar : Avatar} alt='avatar' />
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

          <div className='personal-tab'>
            <ul>
              <li>Publication</li>
              <li>Image</li>
              <li>Videos</li>
              <li>Pages</li>
              <li>Groups</li>
            </ul>
          </div>
        </div>
        <div className='perso-footer'>
          <div className='footer-left'>
            <div className='top'>
              <span>Personal infos</span>
            </div>
            <span className='text'>About</span>
            <div className='input-data'>
              {(this.state.div === 'about') ?
                <textarea
                  value={this.state.about}
                  onChange={e => this.setState({ about: e.target.value })} /> :
                <small>{this.state.about}</small>}
              {(this.state.div === 'about') ? <button onClick={() => this.updateData('about_me', this.state.about)}>&#10003;</button> :
                <span onClick={() => this.activeOrnot('about')}>&#9998;</span>}
            </div>
            <span className='text'>Username</span>
            <div className='input-data'>
              {(this.state.div === 'username') ?
                <input type='text' value={this.state.username}
                  onChange={e => this.setState({ username: e.target.value })} /> :
                <small>{this.state.username}</small>}
              {(this.state.div === 'username') ? <button onClick={() => this.updateData('username', this.state.username)}>&#10003;</button> :
                <span onClick={() => this.activeOrnot('username')}>&#9998;</span>}
            </div>
            <span className='text'>Name</span>
            <div className='input-data'>
              {(this.state.div === 'name') ?
                <input type='text' value={this.state.firstname}
                  onChange={e => this.setState({ firstname: e.target.value })} /> :
                <small>{this.state.firstname}</small>}
              {(this.state.div === 'name') ? <button onClick={() => this.updateData('name', this.state.firstname)}>&#10003;</button> :
                <span onClick={() => this.activeOrnot('name')}>&#9998;</span>}
            </div>
            <span className='text'>Last name</span>
            <div className='input-data'>
              {(this.state.div === 'lastname') ?
                <input type='text' value={this.state.lastname}
                  onChange={e => this.setState({ lastname: e.target.value })} /> :
                <small>{this.state.lastname}</small>}
              {(this.state.div === 'lastname') ? <button onClick={() => this.updateData('lastname', this.state.lastname)}>&#10003;</button> :
                <span onClick={() => this.activeOrnot('lastname')}>&#9998;</span>}
            </div>
            <span className='text'>Date of birth</span>
            <div className='input-data'>
              {(this.state.div === 'birth') ?
                <input type='date' value={this.state.birth}
                  onChange={e => this.setState({ birth: e.target.value })} /> :
                <small>{this.state.birth}</small>}
              {(this.state.div === 'birth') ? <button onClick={() => this.updateData('birth', this.state.birth)}>&#10003;</button> :
                <span onClick={() => this.activeOrnot('birth')}>&#9998;</span>}
            </div>
            <span className='text'>Adress</span>
            <div className='input-data'></div>
            <span className='text'>Phone</span>
            <div className='input-data'></div>
            <span className='text'>Relationship status</span>
            <div className='input-data'></div>
          </div>
          <div className='footer-right'>
            <Switch>
              <Route path='/'>
                <Post publication={this.state.publication} handleSearch={this.handleSearch} />
              </Route>
            </Switch>
          </div>
        </div>
      </div >
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
  publication: state.all.publications,
  users: state.all.users,
});
const mapDispatchToProps = (dispatch) => ({
  dispatchs: dispatch,
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(index))