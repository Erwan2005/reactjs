import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { publicRequest } from '../../requestMethods';
import './style.css'
export class index extends Component {
    constructor(props) {
        super(props);
		this.defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.state = {
            newpass: '',
            repeatpass: '',
            error: false,
            textError: '',
            disable: true,
            theme: '',
        }
    }
    newPass = (e) => {
        const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        if (strongRegex.test(e.target.value)) {
            this.setState({ error: false })
        } else {
            this.setState({ error: true, textError: 'Paswword must have uppercase, lowercase, special character, number and minimum 8 characters' })
        }
        this.setState({ newpass: e.target.value })

    }
    repeatPass = (e) => {
        if (e.target.value !== this.state.newpass) {
            this.setState({ error: true, textError: "Password don't match", repeatpass: e.target.value })
        } else {
            this.setState({ error: false, repeatpass: e.target.value, disable: false })
        }
    }
    changepwd = async () => {
        const formData = new FormData();
        formData.append("uid", this.props.match.params.uid)
        formData.append("token", this.props.match.params.token)
        formData.append("new_password", this.state.newpass)
        formData.append("re_new_password", this.state.repeatpass)
        try {
            await publicRequest.post('reset/users/reset_password_confirm/',formData)
            this.props.history.push('/')
        } catch (error) {
            this.setState({ error: true, textError: 'Token is deprecated,Please try again' })
        }
    }
    preferedTheme = () => {
		if (this.defaultDark) {
			this.setState({ theme: 'dark' })
		}
	}
    componentDidMount() {
        this.preferedTheme()
    }
    render() {
        return (
            <div className='confirm' data-theme={this.state.theme}>
                <div className='container'>
                    <span className='header'>Wantechcorp new password</span>
                    <input type='password' placeholder='New password'
                        value={this.state.newpass}
                        onChange={this.newPass} />
                    <input type='password' placeholder='Repeat password'
                        value={this.state.repeatpass}
                        onChange={this.repeatPass} />
                    {this.state.error && <small>{this.state.textError}</small>}
                    <button onClick={this.changepwd} disabled={this.state.disable}>Change</button>
                </div>
            </div>
        )
    }
}

export default withRouter(index)