import React from 'react'
import { Home,People,List,Image,PlayCircleOutline,Settings,LocalMall,Forum,
        WbSunny } from '@material-ui/icons';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";


const useStyles = theme => ({
  container: {
    height: "100vh",
    minWidth: "15vw",
    color: "#848484",
    position :"fixed",
    paddingTop: theme.spacing(10),
  },
  items:{
    borderBottom: "1px solid #3e3e3e",
    width: '100%',
    height:'55%',
    marginLeft: '10px',
    overflowY: 'auto',

  },

  item:{
    display: "flex",
    alignItems: "center",
    width: '90%',
    padding: theme.spacing(1),

    "&:hover": {
          background: '#454545',
          borderRadius:'6px',
    },
    [theme.breakpoints.up("sm")]:{
      cursor: "pointer",
    },
  },
  icon:{
    marginRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]:{
      fontSize: "24px",
    },
  },

  text:{
    [theme.breakpoints.down("xs")]:{
      display: "none",
    },
  },

  link:{
    display: "flex",
    textDecoration: "none",
    color: "#848484",
    alignItems: "center",
  },

})

export class LeftBar extends React.Component {
  constructor(props){
      super(props);
      this.user = this.props.user
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}> 
        <div className={classes.items}>
          <div className={classes.item}>
            <Link exact to="/Home" className={classes.link}>
              <Home className={classes.icon}/>
              <span className={classes.text}>Home</span>
            </Link>
          </div>

          <div className={classes.item}>
            <People className={classes.icon}/>
            <span className={classes.text}>Friends</span>
          </div>

          <div className={classes.item}>
            <List className={classes.icon}/>
            <span className={classes.text}>Lists</span>
          </div>

          <div className={classes.item}>
            <Image className={classes.icon}/>
            <span className={classes.text}>Image Gallery</span>
          </div>

          <div className={classes.item}>
            <PlayCircleOutline className={classes.icon}/>
            <span className={classes.text}>Videos</span>
          </div>

          <div className={classes.item}>
            <Link exact to={`/shop/${this.user.id}`} className={classes.link}>
              <LocalMall className={classes.icon}/>
              <span className={classes.text}>Shop</span>
            </Link>
          </div>

          <div className={classes.item}>
            <Link exact to={`/messenger/${this.user.id}`} className={classes.link}>
              <Forum className={classes.icon}/>
              <span className={classes.text}>Messenger</span>
            </Link>
          </div>

          <div className={classes.item}>
            <WbSunny className={classes.icon}/>
            <span className={classes.text}>Weather</span>
          </div>

          <div className={classes.item}>
            <Link exact to={'/home/settings'} className={classes.link}>
              <Settings className={classes.icon}/>
              <span className={classes.text}>Settings</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
});

export default connect(mapStateToProps)(withStyles(useStyles)(LeftBar))