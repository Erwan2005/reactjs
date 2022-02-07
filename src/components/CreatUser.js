import React from 'react'
import { withRouter } from "react-router";
import { withStyles,Link,Typography,CircularProgress } from '@material-ui/core';
import FormInput from "./formInput/FormInput";
import apiService from '../APIService';

const useStyles = theme => ({
  container: {
    display: "flex",
    width: '100%',
    height: '100%',
    position :"fixed",
    alignItems:'center',
  },
  right: {
    padding: '15px',
    backgroundColor: '#424242',
    borderRadius: '20px',
    textAlign: 'center',
    [theme.breakpoints.down("sm")]:{
      width: '100%',
      height: '100%',
      borderRadius: '0px',
      overflowY: 'auto',
    },
  },

  left: {
    width: "70%",
    textAlign: 'center',
    [theme.breakpoints.down("sm")]:{
      display: 'none',
      width: "0vw",
    },

  },

  shareButton:{
    border: 'none',
    width: '60%',
    padding: '10px',
    background: 'green',
    color: 'white',
    fontWeight: '500',
    borderRadius: '5px',
    marginBottom: '10px',
    "&:hover": {
          background: 'green',
          fontWeight: 'bold',
    },
  },
  link:{
    textDecoration: "none",
    color: "lightgrey",
    textTransform: 'capitalize',
  },
});
export class CreatUser extends React.Component {
  constructor(props){
      super(props);
      this.state={
        values: ({
          username: "",
          email: "",
          birthday: "",
          password: "",
          confirmPassword: "",
        })
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

  
  onChange = (e) => {
    this.setState({ values:{...this.state.values, [e.target.name]: e.target.value }});
    
  };

  loginAccount = (e) => {
    this.props.history.push("/");
  };

  create = () =>{
    apiService.RegisterUser({username:this.state.values.username,email:this.state.values.email,birth_date:this.state.values.birthday,password:this.state.values.password})
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.left}>
          Wan work
        </div>
        <div className={classes.right}>
            <h1>Register</h1>
            {this.inputs.map((input) => (
              <FormInput
                key={input.id}
                {...input}
                value={this.state.values[input.name]}
                onChange={this.onChange}
              />
            ))}
            <button className={classes.shareButton} onClick={this.create}>Create</button>
            <div>
              <Link variant="body2" component="button" className={classes.link} onClick={this.loginAccount}>
                {"Already have an account?"}
              </Link>
            </div>
        </div>
      </div>
    )
  }
}

export default withRouter(withStyles(useStyles)(CreatUser))