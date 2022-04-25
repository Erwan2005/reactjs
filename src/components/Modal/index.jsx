import React, { Component } from 'react'
import './style.css'
export class index extends Component {
    constructor(props){
		super(props);
		
	}
    close = () =>{
		this.props.handleClose()
	}
    render() {
        return (
            <div className='modal'>
                <div className='container'>
                    <label>Password change</label>
                    <div className='pass'>
                        <span>Old Password:</span>
                        <input type='password' />
                    </div>
                    <div className='pass'>
                        <span>New Password:</span>
                        <input type='password' />
                    </div>
                    <button>Change</button>
                    <span onClick={this.close}>&#9747;</span>
                </div>
            </div>
        )
    }
}

export default index