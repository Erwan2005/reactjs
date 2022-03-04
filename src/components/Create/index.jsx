import React from 'react'
import { withRouter } from "react-router";
import { Link,Typography,CircularProgress } from '@material-ui/core';
import { publicRequest,userRequest } from '../../requestMethods';
import FormInput from "../formInput/FormInput";
import './style.css'
export class index extends React.Component {
	constructor(props){
      super(props);
      this.defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.state={
        values: ({
          username: "",
          email: "",
          birthday: "",
          password: "",
          confirmPassword: "",
        }),
        theme: '',
      };

    this.inputs = [
          {
            id: 1,
            name: "username",
            type: "text",
            placeholder: "Username",
            errorMessage:
              "Username should be 3-16 characters",
            label: "Username",
            pattern: "^[A-Za-z0-9]{3,16}$",
            required: true,
          },
          {
            id: 2,
            name: "email",
            type: "email",
            placeholder: "Email",
            errorMessage: "It should be a valid email address!",
            label: "Email",
            required: true,
          },
          {
            id: 3,
            name: "birthday",
            type: "date",
            placeholder: "Birthday",
            label: "Birthday",
          },
          {
            id: 4,
            name: "password",
            type: "password",
            placeholder: "Password",
            errorMessage:
              "Minimum 8 characters and must contain letters and numbers",
            label: "Password",
            pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,40}$`,
            required: true,
          },
          {
            id: 5,
            name: "confirmPassword",
            type: "password",
            placeholder: "Confirm Password",
            errorMessage: "Passwords don't match!",
            label: "Confirm Password",
            pattern: this.state.values.password,
            required: true,
          },
        ];
    };

    preferedTheme = () =>{
	  	if (this.defaultDark){
	  		this.setState({theme: 'dark'})
	  	}
  	}
	  onChange = (e) => {
	    this.setState({ values:{...this.state.values, [e.target.name]: e.target.value }});
	    
	  };

	  loginAccount = (e) => {
	    this.props.history.push("/");
	  };

	create = async() =>{
	    let data = await publicRequest.post('userapp/users/',{username:this.state.values.username,email:this.state.values.email,birth_date:this.state.values.birthday,password:this.state.values.password})
	    .then(({data})=>data)
	    if (data){
	    	this.loginAccount()
	    }
	  };
	componentDidMount(){
	  	this.preferedTheme()
	  };
	render() {
		return (
			<div className="create" data-theme={this.state.theme}>
				<div className="left">
					<span>Create today <br/>and <br/>access forever !!!</span>
				</div>
				<div className="rights">
					{this.inputs.map((input) => (
		              <FormInput
		                key={input.id}
		                {...input}
		                value={this.state.values[input.name]}
		                onChange={this.onChange}
		              />
		            ))}
		            <button className="btn-create" onClick={this.create}>Create</button>
		            <Link variant="body2" component="button" className="link" onClick={this.loginAccount}>
		                {"Already have an account?"}
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

export default withRouter(index)