import React from 'react';
import { withRouter } from "react-router";
import { withStyles,Link,Typography,CircularProgress } from '@material-ui/core';
import FormInput from "./formInput/FormInput";
import { login } from "../context/apiCall";
import { connect } from "react-redux";

const useStyles = theme => ({
  container: {
    display: "flex",
    position :"fixed",
    alignItems:'center',
    width: '100vw',
    height: '100vh',
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
  error:{
    fontWeight: 500,
    color: 'red',
  },

})
export class SigninJs extends React.Component {
  
  constructor(props){
      super(props);
      this.state={
        values: ({
          username: "",
          password: "",
        })
      };
      this.dispatch = this.props.dispatchs
      this.user = this.props.user
  };

  inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Username",
    },
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Password",
    },
  ];

  onChange = (e) => {
    this.setState({ values:{...this.state.values, [e.target.name]: e.target.value }});
    
  };


  creatAccount = (e) => {
    this.props.history.push("/CreatUser");
  };
  login = () =>{
   
    login(this.dispatch, { username: this.state.values.username, password: this.state.values.password });
  }
  render() {
    const { classes } = this.props;
    
    return (
      <div className={classes.container}>
        <div className={classes.left}>This is left</div>
        <div className={classes.right}>
            <h1 style={{color: 'lightgray'}}>Login</h1>
            {this.user.error && (<Typography className={classes.error}>Username or password is wrong !!!</Typography>)}
            {this.inputs.map((input) => (
              <FormInput
                key={input.id}
                {...input}
                value={this.state.values[input.name]}
                onChange={this.onChange}
              />
            ))}
            <button className={classes.shareButton}
              onClick={this.login}
              disabled={this.user.isFetching}
                onClick={this.login}>
                  {this.user.isFetching ? (
                    <CircularProgress color="white" size="20px" />
                  ) : (
                    "Log In"
                  )}
            </button>
            <div>
              <Link variant="body2" component="button" className={classes.link} onClick = {this.creatAccount}>
                {"Not have an account?"}
              </Link>
            </div>
            <di>
              <Link variant="body2" component="button" className={classes.link}>
                {"Forgot password"}
              </Link>
            </di><br/><br/><br/>
            <div>
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



export default connect(mapStateToProps,mapDispatchToProps)(withRouter(withStyles(useStyles)(SigninJs)))