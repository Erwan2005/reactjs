import React, { Component } from 'react'
import './style.css'
export class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            callID: null,
        }
        this.handleClose = this.handleClose.bind(this)
    }

    handleClose = () => {
        this.props.handleClose()
    }
    render() {
        return (
            <div className='call'>

                <div className='container'>
                    <span className='close' onClick={this.handleClose}><ion-icon name="close-outline" /></span>
                    <div className='me'>
                        <video ref={this.props.currentVideo} />
                    </div>
                    <div className='friend'>
                        <video ref={this.props.friendVideo} />
                    </div>
                    <div className='action'>
                        <span className='mic'><ion-icon name="mic-outline" /></span>
                        <span className='video'><ion-icon name="videocam-outline" /></span>
                        <span className='end'><ion-icon name="call-outline" /></span>
                    </div>
                </div>
            </div>
        )
    }
}

export default index