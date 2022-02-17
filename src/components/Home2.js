
import React, { useState,useEffect,useRef,useContext } from 'react';
import { makeStyles,Grid } from '@material-ui/core';
import AppBar from './AppBar';
import LeftBar from './LeftBar';
import Feed from './Feed';
import RightBar from './RightBar';
import { useSelector } from "react-redux";
import {io} from "socket.io-client";

const useStyles = makeStyles((theme) => ({

  right:{
    [theme.breakpoints.down("sm")]:{
      display: "none",
    },
  },
  left:{
    [theme.breakpoints.down("sm")]:{
      display: "none",
    },
  },
}));
export default function App() {
  const classes = useStyles();
  const [online, setOnline] = useState([]);
  const socket = useRef()

  const user = useSelector((state) => state.user.currentUser);

  useEffect(()=>{
    socket.current = io("ws://localhost:8900");
    socket.current.emit("addUser",user.id);
    socket.current.on("getUsers",users=>{
      setOnline(users)
    });
  },[user])

  return (
    <div>
      <AppBar/>
      <Grid container component="main">
        <Grid item sm={2} xs={1} className={classes.left}><LeftBar/></Grid>
        <Grid item sm={7} xs={12}>
          <Feed />
        </Grid>
        <Grid item sm={3} xs={1}className={classes.right}><RightBar online={online} socket={socket.current}/></Grid>
      </Grid>
    </div>
  );
}