import React,{useState,useEffect,Fragment } from 'react';
import { Typography,makeStyles,Card,CardHeader,CardMedia,CardContent
        ,Avatar,Grid,Button,ButtonGroup,CardActionArea,CardActions
        , Box,IconButton
        ,Collapse,FormControl,Input,InputAdornment,List,ListItem
        ,ListItemAvatar,ListItemText,Divider } from '@material-ui/core';
import { Room,Cake,Info,MoreVert,FavoriteBorder,Share,Telegram } from '@material-ui/icons';
import {useCookies} from 'react-cookie';
import { useParams,Link,useRouteMatch } from 'react-router-dom';
import {format} from 'timeago.js';
import NumericLabel from 'react-pretty-numbers';
import APIService from '../APIService';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  container:{
    display: "flex",
    border: "1px solid #3e3e3e",
    width: '53vw',
    height: "48vh",
    padding: theme.spacing(1),
    [theme.breakpoints.down("sm")]:{
      width: '74vw',
      height: "58vh",
    },
  },
  media:{
    height: 250,
    position: 'relative',
    top: theme.spacing(0),
    [theme.breakpoints.down("sm")]:{
      height: 150,
    },
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    left: theme.spacing(40),
    top: theme.spacing(30),
    position: 'absolute',
    border: `2px solid ${theme.palette.background.paper}`,
    [theme.breakpoints.down("sm")]:{
      width: theme.spacing(10),
      height: theme.spacing(10),
      left: theme.spacing(21),
      top: theme.spacing(24),
    },
  },
  iconBtn: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    top: theme.spacing(-11),
    border: `2px solid ${theme.palette.background.paper}`,
    background: theme.palette.background.paper,
    "&:hover": {
          background: theme.palette.background.paper,
    },
    [theme.breakpoints.down("sm")]:{
      top: theme.spacing(-6),
    },
  },
  iconBtn2: {
    top: theme.spacing(-38),
    [theme.breakpoints.down("sm")]:{
      top: theme.spacing(-21),
    },
  },
  item:{
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(0),
    [theme.breakpoints.up("sm")]:{
      marginTop: theme.spacing(1),
    },
  },
  icon:{
    marginRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]:{
      fontSize: "18px",
    },
  },

  text:{
    fontWeight: 500,
    color: "#848484",
    textTransform: 'capitalize',
    position: 'absolute',
    left: theme.spacing(65),
    marginTop: theme.spacing(2),
    [theme.breakpoints.down("sm")]:{
      left: theme.spacing(22),
      top: theme.spacing(33),
    },
  },
  paper:{
    color: "#848484",
    textTransform: 'capitalize',
    position: 'absolute',
    left: theme.spacing(60),
    marginTop: theme.spacing(5),
    padding: theme.spacing(1),
    [theme.breakpoints.down("sm")]:{
      left: theme.spacing(9),
      top: theme.spacing(33),
    },
  },
  box_item:{
    display: 'flex',
    justifyContent: 'space-around',
    [theme.breakpoints.down("xs")]:{
      display: 'flex',
      justifyContent: 'space-around',
    },
  },
  left:{
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    color: "#848484",
    backgroundColor: '#424242',
    maxHeight: 150,
  },
  right:{
    maxHeight: 272,
    overflowY: 'auto',
    [theme.breakpoints.down("sm")]:{
      maxHeight: 200,
    },
  },
  card:{
    marginBottom: theme.spacing(3),
    boxShadow: "none",
    backgroundColor: '#424242',
  },
  link:{
    display: "flex",
    textDecoration: "none",
    color: "#848484",
    textTransform: 'capitalize',
  },
  card_action:{
    display: "flex",
    justifyContent: "space-between"
  },
  item_card:{
    display: "flex",
    alignItems: "center",
    spacing: theme.spacing(2),
    color: "#848484",
  },
}));

export default function CardProfile() {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [auth, setAut] = useState([]);
  const { id } = useParams();
  const [token] = useCookies(['mytoken']);
  const [publication,setPublication] = useState([]);
  const [comment,setComment] = useState('');
  const [comments,setComments] = useState([]);
  const [likes,setLikes] = useState([]);
  const [current,setCurrent] = useState([]);
  const [friends, setFriends] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const { user } = useContext(AuthContext);
  
  let { url } = useRouteMatch();

  const handleExpandClick = (id) => {
    setExpanded({
      ...expanded,
      [id]: !expanded[id]
    });
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/userapp/users/`,{
      'method':'GET',
      headers: {
        'Content-Type':'application/json',
      }
    })
    .then(resp => resp.json())
    .then(resp => setAut(resp))
    .catch(error => console.log(error))

  }, []);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/userapp/publication/`,{
      'method':'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':`Token ${user.token}` 
      }
    })
    .then(resp => resp.json())
    .then(resp => setPublication(resp.results))
    .catch(error => console.log(error))

  }, [user]);



  useEffect(() => {
    fetch(`http://127.0.0.1:8000/userapp/users/${id}/`, {
      'method':'GET',
      headers: {
        'Content-Type':'application/json',
      }
    })
    .then(resp => resp.json())
    .then(resp => {
      setUsers(resp)
    })
    .catch(error => console.log(error))

  }, [id])

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/userapp/like/`,{
      'method':'GET',
      headers: {
        'Content-Type':'application/json',
      }
    })
    .then(resp => resp.json())
    .then(resp => setLikes(resp))
    .catch(error => console.log(error))

  }, []);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/userapp/comment/`,{
      'method':'GET',
      headers: {
        'Content-Type':'application/json',
      }
    })
    .then(resp => resp.json())
    .then(resp => setComments(resp))
    .catch(error => console.log(error))

  }, []);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/userapp/users/${user.id}/`, {
      'method':'GET',
      headers: {
        'Content-Type':'application/json',
      }
    })
    .then(resp => resp.json())
    .then(resp => setCurrent(resp))
    .catch(error => console.log(error))

  }, [user]);

  const getFriend = async() =>{
    let data = await axios.get('http://127.0.0.1:8000/userapp/friend/')
    .then(({data}) => data)
    setFriends(data)
  };

  useEffect(() =>{
    getFriend()
  },[])

  const checkFriend = (userId,friendId) =>{
    if (friends.filter(item=> item.user == userId && item.friend == friendId).length == 0)
      return false
    else return true
  };

  const btnComment = (content,id_post) => {
        var author = parseInt(user.id, 10)
        var post_connected = parseInt(id_post, 10)
        APIService.InsertComment({content,author, post_connected})
        //.then(resp => setToken('mytoken',resp))
        .catch(error => console.log(error))

    };

  const btnLike = (id_post) => { 
        var author = parseInt(user.id, 10)
        var post_connected = parseInt(id_post, 10)
        APIService.InsertLike({author,post_connected})
        .catch(error => console.log(error))
    };
  const dltLike = (id_post) => { 
        var id = parseInt(id_post, 10)
        APIService.DeleteLike(id)
        .catch(error => console.log(error))
    };

  const sendRequest = async(id_sender,id_receiver) =>{
   await axios.post('http://127.0.0.1:8000/userapp/friendrequest/',
    ({sender:id_sender,receiver:id_receiver})).then(res =>{
      console.log(res)
    })
  };

  return (
      <>
        <CardMedia className={classes.media} image={users.img_covert} />
        <Avatar src={users.avatar} className={classes.large} />
        <Typography className={classes.text}>
            @{users.username}
        </Typography><br /><br /><br /><br />
        
        <div className={classes.container}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <div style={{display: 'flex',justifyContent: 'space-around',color: "#848484",}}>
                  <Typography>
                    Friends
                  </Typography>
                  <Typography>
                    Followers
                  </Typography>
                  <Typography>
                    Followings
                  </Typography>
                </div>
                <div style={{display: 'flex',justifyContent: 'space-around',color: "#848484",}}>
                  <Typography>
                    <NumericLabel params={{shortFormat: true,}}>{users.friend_nbr}</NumericLabel>
                  </Typography>
                  <Typography>
                    11k
                  </Typography>
                  <Typography>
                    2k
                  </Typography>
                </div>
                <Divider/>
              </Grid>
              <Grid item xs={12} sm={4}>
                <div className={classes.left}>
                  <div style={{display:'flex'}}>
                    <Cake className={classes.icon}/>
                    <Typography>
                      {users.birth_date}
                    </Typography>
                  </div>
                  <div style={{display:'flex'}}>
                    <Room className={classes.icon}/>
                    <Typography>
                      {users.address}
                    </Typography>
                  </div>
                  <div style={{display:'flex'}}>
                    <Info className={classes.icon}/>
                    <Typography>
                      {users.about_me}
                    </Typography>
                  </div>
                  <ButtonGroup variant="contained" color="primary" >
                  { user.id === users.id ? null :(
                    <Button style={{textTransform: 'capitalize'}}>Follow</Button>)}
                    
                  { user.id === users.id ? null :(
                    checkFriend(user.id,users.id) ? (
                      <Button style={{textTransform: 'capitalize'}}>Message</Button>
                      
                    ) : (
                      <Button onClick={()=>sendRequest(user.id,users.id)} style={{textTransform: 'capitalize'}}>Add friend</Button>
                    ))}
                    
                  </ButtonGroup>
                </div>
              </Grid>
              <Grid item xs={12} sm={8}>
                <div className={classes.right}>
                  {publication && publication.map(pub => {
                    if (pub.user === users.id){
                      return(
                        <Card className={classes.card} key={pub.id}>
                          <CardHeader 
                            avatar={
                              <Avatar src={users.avatar}/>
                            }
                            action={
                              <IconButton aria-label="settings">
                                <MoreVert />
                              </IconButton>
                             }
                            title={
                              <Link  className={classes.link}>
                                <Typography className={classes.name}> {users.username}</Typography>
                              </Link>
                            }
                            subheader={format(pub.date)}
                          />
                          <CardActionArea>
                          <CardMedia className={classes.media} image={pub.image} />
                            <CardContent>
                              <Typography gutterBottom variant="h6">{pub.title}</Typography>
                              <Typography variant="body">{pub.message}</Typography>
                            </CardContent>
                          </CardActionArea>
                          <CardActions className={classes.card_action}>
                            <div className={classes.item_card}>
                              
                              
                              <Button className={classes.link} size="small" variant="text" disabled><NumericLabel params={{shortFormat: true,}}>{pub.like_nbr}</NumericLabel>&nbsp; Like</Button>
                            </div>
                            <div className={classes.item_card}>
                              <Button className={classes.link} size="small" onClick={() => handleExpandClick(pub.id)}><NumericLabel params={{shortFormat: true,}}>{pub.comments_nbr}</NumericLabel>&nbsp; Comment</Button>
                              
                              <IconButton size="small" className={classes.right}>
                                <Share/>
                              </IconButton>
                            </div>
                          </CardActions>
                          <Collapse in={expanded[pub.id]} timeout="auto" unmountOnExit>
                            <CardContent>
                               <div className={classes.item}>
                                <Avatar src={current.avatar}/>&emsp;
                                <FormControl fullWidth>
                                      <Input
                                        placeholder="Your comments "
                                        multiline
                                        value = {comment}
                                        onChange = {e => setComment(e.target.value)}
                                        endAdornment={
                                        <InputAdornment position="end">
                                          <IconButton
                                            aria-label="toggle password visibility"
                                            edge="end"
                                            onClick={() => btnComment(comment,pub.id)}
                                            >
                                            <Telegram />
                                          </IconButton>
                                          </InputAdornment>
                                        }
                                      />
                                  </FormControl>

                               </div>
                               <div style={{maxHeight: 100,overflowY: "scroll",}}>
                                 {auth && auth.map(author => {
                                    return(
                                      <div key={author.id}>
                                        {comments && comments.map(post_com => {
                                            if (author.id === post_com.author && post_com.post_connected === pub.id){
                                              return(
                                                <div key={post_com.id}>
                                                  <div className={classes.item}>
                                                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', overflow: 'auto' }}>
                                                      <ListItem alignItems="flex-start">
                                                        <ListItemAvatar>
                                                          <Avatar src={author.avatar} />
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                          primary=<Link exact to={`${url}/profile/${author.id}`} className={classes.link}>{author.username}</Link>
                                                          secondary={
                                                            <Fragment>
                                                              <Typography
                                                                sx={{ display: 'inline' }}
                                                                component="span"
                                                                variant="body2"
                                                                color="text.primary"
                                                              >
                                                                {post_com.content}
                                                              </Typography>
                                                              {" — ("+format(post_com.date_posted)+")"}
                                                            </Fragment>
                                                          }
                                                        />
                                                      </ListItem>
                                                      <Divider variant="inset" component="li" />
                                                      
                                                    </List>
                                                 </div>
                                                </div>
                                              )
                                            }else return null;
                                         })}
                                      </div>
                                    )

                                 })}
                                </div>
                            </CardContent>
                          </Collapse>
                        </Card>
                      )}else return null;
                    })}
                  
                </div>
              </Grid>
            </Grid>
          </Box>
        </div>
      </>
  );
}
