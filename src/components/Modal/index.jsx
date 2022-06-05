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
            repeatpass: '',
            error: false,
            textError: '',
            disable: true,
        }
		
	}
    close = () =>{
		this.props.handleClose()
	}
    changepwd = async()=>{
        try{
            let data = await userRequest.put('change-password/',{old_password: this.state.oldpass,new_password: this.state.newpass})
            .then(({data}) => data)
            toast.success('Password changed sucessffuly')
            this.props.handleClose()
        }catch (error){
            this.setState({error: true, textError: 'Old password is wrong'})
        }
    }
    oldPass = (e) =>{
        this.setState({oldpass: e.target.value, error: false})
    }

    newPass = (e) =>{
        const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        if(strongRegex.test(e.target.value)) {
            this.setState({error: false})
        }else{
            this.setState({error: true, textError: 'Paswword must have uppercase, lowercase, special character, number and minimum 8 characters'})
        }
        this.setState({newpass: e.target.value})
        
    }
    repeatPass = (e) =>{
        if(e.target.value !== this.state.newpass){
            this.setState({error: true, textError: "Password don't match", repeatpass: e.target.value})
        }else{
            this.setState({error: false, repeatpass: e.target.value, disable: false})
        }
    }
    render() {
        return (
            <div className='modal'>
                <div className='container'>
                    <span className='icon red' onClick={this.close}><ion-icon name="close-outline"/></span>
                    <span className='header'>Password change</span>
                    <div className='contents'>
                        <input type='password' placeholder='Old password' 
                        value = {this.state.oldpass}
                        onChange = {this.oldPass}/>
                        <input type='password' placeholder='New password' 
                        value = {this.state.newpass}
                        onChange = {this.newPass}/>
                        <input type='password' placeholder='Repeat password' 
                        value = {this.state.repeatpass}
                        onChange = {this.repeatPass}/>
                        {this.state.error && <small>{this.state.textError}</small>}
                        <button onClick={this.changepwd} disabled={this.state.disable}>Change</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
	user: state.user.currentUser,
});
export default connect(mapStateToProps, null)(index)