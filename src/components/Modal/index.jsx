import React, { Component } from 'react'
import { connect } from "react-redux";
import { publicRequest, userRequest } from '../../requestMethods';
import { toast } from 'react-toastify';
import './style.css'
export class index extends Component {
    constructor(props){
		super(props);
        this.state ={
            oldpass: '',
            newpass: '',
        }
		
	}
    close = () =>{
		this.props.handleClose()
	}
    changepwd = async()=>{
        try{
            let data = await userRequest.put('change-password/',{old_password: this.state.oldpass,new_password: this.state.newpass})
            .then(({data}) => data)
            toast.success('Password changed successfufly')
            this.props.handleClose()
        }catch (error){
            toast.error('Old password is wrong')
        }
    }
    render() {
        return (
            <div className='modal'>
                <div className='container'>
                    <label>Password change</label>
                    <div className='pass'>
                        <span>Old Password:</span>
                        <input type='password'
                        value = {this.state.oldpass}
                        onChange = {e => this.setState({oldpass:e.target.value})}/>
                    </div>
                    <div className='pass'>
                        <span>New Password:</span>
                        <input type='password' 
                        value = {this.state.newpass}
                        onChange = {e => this.setState({newpass:e.target.value})}/>
                    </div>
                    <button onClick={this.changepwd}>Change</button>
                    <span onClick={this.close}>&#9747;</span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
	user: state.user.currentUser,
});
export default connect(mapStateToProps, null)(index)