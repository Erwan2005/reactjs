import React from 'react'
import FormInput from "../formInput/FormInput";
import { login } from "../../context/apiCall";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link,Typography,CircularProgress } from '@material-ui/core';
import bcrypt from 'bcryptjs' 
import './style.css'

export class index extends React.Component {
	constructor(props){
		super(props);
		this.defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		this.state={
			values: ({
		          username: "",
		          password: "",
		        }),
			theme: '',
		};
	}

	preferedTheme = () =>{
	  	if (this.defaultDark){
	  		this.setState({theme: 'dark'})
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
	    this.setState({ values:{...this.state.values, [e.target.name]: e.target.value }});
	    
	  };


	  creatAccount = (e) => {
	    this.props.history.push("/CreatUser");
	  };
	  login = () =>{
	    login(this.props.dispatchs, { username: this.state.values.email, password: this.state.values.password });
	  }
	  doThis = ()=>{
		console.log("login success")
	  }
  	componentDidMount(){
	  	this.preferedTheme()
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
		            <Link variant="body2" component="button" onClick = {this.creatAccount} className="link">
		                {"Not have an account?"}
		            </Link>
		            <Link variant="body2" component="button" className="link">
		                {"Forgot password"}
		            </Link>
		            <Typography variant="body2" color="textSecondary" align="center">
		                {'Copyright © '}
		                <Link color="inherit" href="https://material-ui.com/">
		                  WanTech corp,
		                </Link>{' '}
		                {new Date().getFullYear()}
		                {'.'}
		            </Typography>
				</div>
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
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(index))