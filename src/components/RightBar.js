import React, { useState,useEffect,useContext } from 'react';
import { Container,makeStyles,Typography,Avatar,Divider,Badge,styled } from '@material-ui/core';
import { Link,useRouteMatch } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import BoxMessage from './BoxMessage';
import axios from 'axios';
import { useSelector } from "react-redux";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
  },
}));

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
    position :"fixed",
    top: 0,
    maxWidth: "26vw",
  },
  title:{
    fontSize:16,
    fontWeight: 500,
    color: "#848484",
  },
  link:{
    marginRight: theme.spacing(2),
    color: "#848484",
    fontSize: 16,
    textDecoration: 'none',
  },
  friend:{
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
    marginBottom: '2px',
    padding: '5px',
    color: "#848484",
    textTransform: 'capitalize',

    "&:hover": {
          background: '#424242',
    },
  },

}));
export default function RightBar(props) {
  const classes = useStyles();
  let { url } = useRouteMatch();
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [receiver, setReceiver] = useState('');
  const [users, setUsers] = useState([]);
  const user = useSelector((state) => state.user.currentUser);

  const getFriend = async() =>{
    let data = await axios.get('http://127.0.0.1:8000/userapp/friend/')
    .then(({data}) => data)
    setFriends(data)
  };

  const getUser = async() =>{
    let data = await axios.get('http://127.0.0.1:8000/userapp/users/')
    .then(({data}) => data)
    setUsers(data)
  };

  useEffect(() => {
    getFriend()
    getUser()
  }, []);

  const friendMP = (id_receiver) =>{
    setOpen(!open)
    setReceiver(id_receiver)
  };

  const openProps = () =>{
    setOpen(!open)
  };

  return (
    <div style={{position: 'relative'}}>
      <Container className={classes.container}>
        <div style={{marginBottom: '10px'}}>
          <Calendar />
        </div>
        <Typography className={classes.title}> Online friends</Typography>
        <Divider />
        <div style={{minHeight: '290px', maxHeight: '295px',overflowY: 'auto', margin: '10px'}}>
          {friends && friends.map(friend =>{
            return(
              <div key={friend.id}>
                {users && users.map(profile =>{
                  if(friend.user === user.id && friend.friend === profile.id){
                    return(
                      <div key={profile.id}>
                        {props.online && props.online.map(userOnline =>{
                          if(userOnline.userId === friend.friend){
                            return(
                              <div key={userOnline.userId}>
                                <div className={classes.friend} onClick={() =>friendMP(profile.id)}> 
                                  <StyledBadge overlap="circular" badgeContent=" " variant="dot" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                                    <Avatar src={profile.avatar}/>
                                  </StyledBadge>
                                  <Typography style={{marginLeft: '10px'}}>{profile.username}</Typography>
                                </div>
                              </div>
                            )
                          }else return null
                        })}
                      </div>
                    )
                  }else return null
                })}
              </div>
            )
          })}
          
        </div>
        <Typography className={classes.title} gutterBottom> Categories</Typography>
        <Link href="#" className={classes.link} variant="body2">
          Sport
        </Link>
        <Link href="#" className={classes.link} variant="body2">
          Food
        </Link>
        <Link href="#" className={classes.link} variant="body2">
          Movies
        </Link>
        <Link exact to={`${url}/news`} className={classes.link} variant="body2">
          News
        </Link>
      </Container>
      {open && (
        <BoxMessage receiver = {receiver} own={user.id} open = {openProps} socket={props.socket}/>
      )}
    </div>
  );
}