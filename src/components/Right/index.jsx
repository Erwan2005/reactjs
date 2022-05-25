import React, { Component } from 'react'
import './style.css'
export class index extends Component {
    render() {
        return (
            <div className='right-container'>
                <div className='right-top'>
                    <div className='top-text'>
                        <span className='text-left'> Friend Request</span>
                        <small className='text-right'>See all</small>
                    </div>
                    <div className='request'>
                        <img src='https://cdn.pixabay.com/photo/2016/01/20/13/05/cat-1151519_960_720.jpg' alt='' />
                        <div className='action'>
                            <div className='text'>
                                <span>Erwan</span>
                                <small>11k</small>
                            </div>
                            <div className='button'>
                                <span className='accept'><ion-icon name="checkmark-outline" /></span>
                                <span className='refused'><ion-icon name="close-outline" /></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='right-feet'>
                    <div className='top-text'>
                        <span className='text-left'> Online friends</span>
                        <small className='text-right'>See all</small>
                    </div>
                    <div className='contact'>
                        gfgfg
                    </div>
                    <div className='other-link'>
                        <small>News</small>
                        <small>Sport</small>
                        <small>Movie</small>
                        <small>Techno</small> 
                        <small> | Wantech ©{new Date().getFullYear()}.</small>
                    </div>
                </div>
            </div>
        )
    }
}

export default index