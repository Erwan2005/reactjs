import React, { Component } from 'react'
import { connect } from "react-redux";
import {  withRouter, NavLink } from 'react-router-dom';
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
                            <NavLink exact to={'/messenger'} className={({ isActive }) => (isActive ? 'link active' : 'link')} >
                                <span><ion-icon name="chatbubbles-outline" /></span>
                                <span>Messenger</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to={'/messenger'} className={({ isActive }) => (isActive ? 'link active' : 'link')} >
                                <span><ion-icon name="create-outline"/></span>
                                <span>Pages</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to={'/messenger'} className={({ isActive }) => (isActive ? 'link active' : 'link')} >
                                <span><ion-icon name="people-circle-outline"/></span>
                                <span>Groups</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to={'/messenger'} className={({ isActive }) => (isActive ? 'link active' : 'link')} >
                                <span><ion-icon name="newspaper-outline"/></span>
                                <span>News</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to={'/messenger'} className={({ isActive }) => (isActive ? 'link active' : 'link')} >
                                <span><ion-icon name="film-outline"/></span>
                                <span>Movies</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to={'/messenger'} className={({ isActive }) => (isActive ? 'link active' : 'link')} >
                                <span><ion-icon name="copy-outline"/></span>
                                <span>Sports</span>
                            </NavLink>
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