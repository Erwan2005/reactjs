import React from 'react'
import FormInput from "../formInput/FormInput";
import { login,getpublication } from "../../context/apiCall";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Reset from '../ResetPassword'
import { Link, Typography, CircularProgress } from '@material-ui/core';
import './style.css'

export class index extends React.Component {
	constructor(props) {
		super(props);
		this.defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		this.state = {
			values: ({
				username: "",
				password: "",
			}),
			theme: '',
			open: false,
		};
		this.handleClose = this.handleClose.bind(this);
	}

	handleClose = () => {
		this.setState({open: !this.state.open})
	}

	preferedTheme = () => {
		if (this.defaultDark) {
			this.setState({ theme: 'dark' })
		}
	}

	inputs = [
		{
			id: 1,
			name: "email",
			type: "email",
			placeholder: "Email...",
			errorMessage: "Invalid email",
			label: "Email",
			required: true,
		},
		{
			id: 2,
			name: "password",
			type: "password",
			placeholder: "Password...",
		},
	];

	onChange = (e) => {
		this.setState({ values: { ...this.state.values, [e.target.name]: e.target.value } });

	};


	creatAccount = (e) => {
		this.props.history.push("/CreatUser");
	};
	login = () => {
		login(this.props.dispatchs, { username: this.state.values.email, password: this.state.values.password });
		getpublication(this.props.dispatchs)
	}
 
	componentDidMount() {
		this.preferedTheme()
		const keyDownHandler = event => {
			console.log('User pressed: ', event.key);

			if (event.key === 'Enter') {
				event.preventDefault();

				this.login()
			}
		};
		document.addEventListener('keydown', keyDownHandler);

		return () => {
			document.removeEventListener('keydown', keyDownHandler);
		};
	};
	render() {
		return (
			<div className="login" data-theme={this.state.theme}>
				<div className="left">
					<span>Chat, buy and share all <br />with your family and friend</span>
				</div>
				<div className="rights">
					{this.props.user.error && (<Typography className="error">Username or password is wrong !!!</Typography>)}
					{this.inputs.map((input) => (
						<FormInput
							key={input.id}
							{...input}
							value={this.state.values[input.name]}
							onChange={this.onChange}
						/>
					))}
					<button className="btn-login"
						disabled={this.props.user.isFetching}
						onClick={this.login}>
						{this.props.user.isFetching ? (
							<CircularProgress color="white" size="20px" />
						) : (
							"Log In"
						)}
					</button>
					<div className='link'>
						<span onClick={this.creatAccount} >Not have an account ?</span>
						<span className='link' onClick={()=>this.setState({open: !this.state.open})}>Forgot password ?</span>
					</div>
					<Typography variant="body2" color="textSecondary" align="center">
						{'Copyright © '}
						<Link color="inherit" href="https://material-ui.com/">
							WanTech corp,
						</Link>{' '}
						{new Date().getFullYear()}
						{'.'}
					</Typography>
				</div>
				{this.state.open && <Reset handleClose={this.handleClose}/>}
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
	dispatchs: dispatch,
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(index))