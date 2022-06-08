import React, { Component } from 'react'
import { connect } from "react-redux";
import { Route, Switch, withRouter, NavLink } from 'react-router-dom';
import './style.css'
export class index extends Component {
    constructor(props) {
        super(props);;
    }

    activeLink = () => {
        const activeLink = document.querySelectorAll('ul li');
        for (let clickTab of activeLink) {
            clickTab.onclick = function () {
                let activeClass = document.querySelectorAll('li.active');
                activeClass[0].classList.remove('active')
                clickTab.classList.add('active');
            }
        }
    }
    activeMenu = () => {
        let toggle = document.querySelector('.left-container')
        toggle.classList.toggle('active')
    }
    componentDidMount() {
        this.props.getActiveMenu(this.activeMenu);
    }
    render() {
        return (
            <div className='left-container'>
                <div className='left-top'>
                    <ul>
                        <li>
                            <NavLink to='/' className={({ isActive }) => (isActive ? 'link active' : 'link')} exact={true}>
                                <span><ion-icon name="home-outline" /></span>
                                <span>Home</span>
                            </NavLink>
                        </li>
                        <li>
                            <span><ion-icon name="people-outline" /></span>
                            <span>Friend</span>
                        </li>
                        <li>
                            <span><ion-icon name="images-outline" /></span>
                            <span>Image Gallery</span>
                        </li>
                        <li>
                            <span><ion-icon name="film-outline" /></span>
                            <span>Videos</span>
                        </li>
                        <li>
                            <NavLink exact to={'/shop'} className={({ isActive }) => (isActive ? 'link active' : 'link')}>
                                <span><ion-icon name="bag-handle-outline" /></span>
                                <span>Shop</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to={'/messenger'} className={({ isActive }) => (isActive ? 'link active' : 'link')} >
                                <span><ion-icon name="chatbubbles-outline" /></span>
                                <span>Messenger</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to={'/weather'} className={({ isActive }) => (isActive ? 'link active' : 'link')} >
                                <span><ion-icon name="thunderstorm-outline" /></span>
                                <span>Weather</span>
                            </NavLink>
                        </li>
                        <li>
                            <span><ion-icon name="settings-outline" /></span>
                            <span>Settings</span>
                        </li>
                    </ul>
                </div>
                <div className='left-bottom'>

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.currentUser,
});
export default connect(mapStateToProps, null)(withRouter(index))