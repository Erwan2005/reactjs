import React from 'react'
import { connect } from "react-redux"
import User from '../../assets/user.svg'
import { withRouter, NavLink, Link } from 'react-router-dom'
import Menu from '../MenuBox'
import Modal from '../Modal'
import Logo from '../../assets/logo.png'
import './style.css'
export class index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            modal: false,
            menu1: false,
            menu2: false,
            menu3: false,
        }
        this.theme = this.theme.bind(this)
        this.search = this.search.bind(this)
        this.openModal = this.openModal.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.logout = this.logout.bind(this);
    }
    theme = () => {
        this.props.theme()
    }
    search = (e) => {
        this.setState({ search: e.target.value })
        this.props.search(e.target.value)
    }
    openModal = () => {
        this.setState({ modal: !this.state.modal })
    }
    handleClose = () => {
        this.setState({ modal: !this.state.modal })
    }
    logout = () => {
        //this.props.navigation.navigate('/')
        localStorage.clear()
        window.location.reload(false);
    };
    showMenu = (menu) => {
        if (menu === 'menu1') {
            this.setState({ menu1: !this.state.menu1, menu2: false, menu3: false })
        } else if (menu === 'menu2') {
            this.setState({ menu2: !this.state.menu2, menu1: false, menu3: false })
        } else if (menu === 'menu3') {
            this.setState({ menu3: !this.state.menu3, menu1: false, menu2: false })
        } else {
            if (this.state.menu1 || this.state.menu2 || this.state.menu3) {
                this.setState({ menu1: false, menu2: false, menu3: false })
            }
        }
    }
    render() {
        return (
            <div className='navbar' onClick={() => this.showMenu('other')}>
                <div className='left'>
                    <img src={Logo} alt='' className='logo' />
                    <label className='search'>
                        <input type='text' placeholder='Search ...'
                            value={this.state.search}
                            onChange={this.search} />
                        <span className='search-icon'><ion-icon name="search-outline" /></span>
                    </label>
                </div>
                <div className='center'>
                    <ul>
                        <li>
                            <NavLink to='/' className={({ isActive }) => (isActive ? 'link active' : 'link')} exact={true}>
                                <span><ion-icon name="home-outline" /></span>
                            </NavLink></li>
                        <li><span><ion-icon name="people-outline" /></span></li>
                        <li>
                            <NavLink to={'/video'} className={({ isActive }) => (isActive ? 'link active' : 'link')} >
                                <span><ion-icon name="desktop-outline" /></span>
                            </NavLink>
                        </li>
                        <li><span><ion-icon name="images-outline" /></span></li>
                        <li>
                            <NavLink exact to={'/weather'} className={({ isActive }) => (isActive ? 'link active' : 'link')} >
                                <span><ion-icon name="thunderstorm-outline" /></span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to={'/shop'} className={({ isActive }) => (isActive ? 'link active' : 'link')}>
                                <span><ion-icon name="bag-handle-outline" /></span>
                            </NavLink>
                        </li>
                        <li><span><ion-icon name="grid-outline" /></span></li>
                    </ul>
                </div>
                <div className='right'>
                    {this.props.user.theme === 'light' ? <span className='icon' onClick={this.theme}><ion-icon name="moon-outline" /></span> : <span className='icon' onClick={this.theme}><ion-icon name="sunny-outline" /></span>}
                    <span className='icon' onClick={() => this.showMenu('menu3')}><ion-icon name="chatbubble-outline" />
                        <small>+9</small></span>
                    <span className='icon' onClick={() => this.showMenu('menu2')}><ion-icon name="notifications-outline" />
                        <small>1</small></span>
                    <img src={this.props.user.avatar ? this.props.user.avatar : User} alt='' className='avatar' onClick={() => this.showMenu('menu1')} />
                    {this.state.menu1 &&
                        <Menu openModal={this.openModal} logout={this.logout}>
                            <Link exact to='/personnal' className="link">
                                <div className='userMenu'>
                                    <img src={this.props.user.avatar ? this.props.user.avatar : User} alt='' />
                                    <div className='userName'>
                                        <span className='userName'>{this.props.user.username}</span>
                                    </div>
                                </div>
                            </Link>
                            <div className='textIcon' onClick={this.openModal}>
                                <span className='icon'><ion-icon name="key-outline" /></span>
                                <span className='text'>Change password</span>
                            </div>
                            <div className='textIcon' onClick={this.logout}>
                                <span className='icon'><ion-icon name="log-out-outline" /></span>
                                <span className='text'>Logout</span>
                            </div>
                        </Menu>
                    }
                    {this.state.menu2 &&
                        <Menu openModal={this.openModal} logout={this.logout}>
                            <div className='userMenu'>
                                <img src={this.props.user.avatar ? this.props.user.avatar : User} alt='' />
                                <div className='userName'>
                                    <span className='userName'>{this.props.user.username}</span>
                                    <small>Comment your post</small>
                                </div>
                            </div>

                        </Menu>
                    }
                    {this.state.menu3 &&
                        <Menu openModal={this.openModal} logout={this.logout}>
                            <div className='userMenu'>
                                <img src={this.props.user.avatar ? this.props.user.avatar : User} alt='' />
                                <div className='userName'>
                                    <span className='userName'>{this.props.user.username}</span>
                                    <small>Hi how are you ?</small>
                                </div>
                            </div>

                        </Menu>
                    }
                </div>
                {this.state.modal &&
                    <Modal handleClose={this.handleClose} />}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.currentUser,
});
export default connect(mapStateToProps, null)(withRouter(index))