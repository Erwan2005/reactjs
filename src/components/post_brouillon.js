import { useEffect,useState,Fragment } from 'react';
import { Card,CardHeader,CardActionArea,
        CardMedia,CardContent, Typography,
        CardActions,makeStyles, 
        Avatar,IconButton,Collapse,Button,
        InputAdornment,FormControl,Input,List,
        ListItem,Divider,ListItemText,ListItemAvatar,
        Menu,MenuItem } from '@material-ui/core';
import { MoreVert,FavoriteBorder,Share,Telegram,DeleteForever,Edit } from '@material-ui/icons';
import {useCookies} from 'react-cookie';
import {format} from 'timeago.js';
import { Link,useRouteMatch } from 'react-router-dom';
import NumericLabel from 'react-pretty-numbers';
import APIService from '../APIService';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


const useStyles = makeStyles((theme) => ({
  media:{
    height: 250,
    [theme.breakpoints.down("sm")]:{
      height: 150,
    },
  },
  card:{
    marginBottom: theme.spacing(3),
  },
  tile:{
    height: theme.spacing(40),
    display: "flex",
    flexDirection: "column",
    margin: 5,

  },
  name:{
    fontSize: 16,
    fontWeight: 500,
    color: "#555",
  },
  card_action:{
    display: "flex",
    justifyContent: "space-between"
  },
  item:{
    display: "flex",
    alignItems: "center",
    spacing: theme.spacing(2),
    color: "#555",
  },
  link:{
    display: "flex",
    textDecoration: "none",
    color: "#555",
    textTransform: 'capitalize',
  },
}));
export default function Post(props) {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const [user1,setUser1] = useState([]);
  const [current,setCurrent] = useState([]);
  const [comment,setComment] = useState('');
  const [comments,setComments] = useState([]);
  const [likes,setLikes] = useState([]);
  const [expanded, setExpanded] = useState(false);
  let { url } = useRouteMatch();
  const [anchorElP, setAnchorElP] = useState(null);
  const isMenuOpenP = Boolean(anchorElP);

  const handleExpandClick = (id) => {
    setExpanded({
      ...expanded,
      [id]: !expanded[id]
    });
  };

  const handleProfileMenuOpenP = (event) => {
    setAnchorElP(event.currentTarget);
  };

  const handleMenuCloseP = () => {
    setAnchorElP(null);

  };

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
    fetch(`http://127.0.0.1:8000/userapp/users/`,{
      'method':'GET',
      headers: {
        'Content-Type':'application/json',
      }
    })
    .then(resp => resp.json())
    .then(resp => setUser1(resp))
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

  }, []);

  const btnComment = (content,id_post) => {
        var author = parseInt(user.id, 10)
        var post_connected = parseInt(id_post, 10)
        APIService.InsertComment({content,author, post_connected})
        .then(resp => insertedComments(resp))
        .catch(error => console.log(error))

    };


  const dltPub = (id_post) => {
        var user = user.token
        var post_connected = parseInt(id_post, 10)
        APIService.DeletePublication(post_connected,user)
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

  const insertedComments = (commenter) => {
    const new_comments = [...comments, commenter]
    setComments(new_comments)

  }

  const menuId = 'friend';
  const ITEM_HEIGHT = 25


  return (
    <div>
      {props.publication && props.publication.map(pub => {
        return(
          <div key = {pub.id}>
            {user1 && user1.map(profile => {
              if (pub.user === profile.id){
                const id_pub = pub.user
                const id_aut = user.id
                return(
                  <div key = {profile.id}>
                    <Card className={classes.card}>
                      <CardHeader 
                          avatar={
                            <Avatar src={profile.avatar}/>
                          }
                          action={
                            <IconButton>
                              <MoreVert onClick={id_pub === id_aut ? handleProfileMenuOpenP : null}/>
                            </IconButton>
                          }
                          title={
                            <Link exact to={`${url}/profile/${profile.id}`} className={classes.link}>
                              <Typography className={classes.name}> {profile.username}</Typography>
                            </Link>
                          }
                          subheader={format(pub.date)}
                      />
                      <CardActionArea>
                        <CardMedia className={classes.media} image={pub.image} />
                        <CardContent>
                          <Typography gutterBottom variant="h5">{pub.title}</Typography>
                          <Typography variant="body">{pub.message}</Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions className={classes.card_action}>
                        <div className={classes.item}>
                          {(!likes.length) ?(
                            likes && likes.map(like => {
                              return(
                                <div>

                                  <IconButton size="small" >
                                    <FavoriteBorder onClick={() => like.author === user.id && like.post_connected === pub.id ? dltLike(like.id) : btnLike(pub.id)}/>
                                  </IconButton>
                                </div>
                              )
                            })) : (
                              <IconButton size="small" >
                                <FavoriteBorder onClick={() => btnLike(pub.id)}/>
                              </IconButton>
                            )}
                          
                          <Button className={classes.link} size="small" variant="text" disabled><NumericLabel params={{shortFormat: true,}}>{pub.like_nbr}</NumericLabel>&nbsp; Like</Button>
                        </div>
                        <div className={classes.item}>
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
                           <div style={{maxHeight: 150,overflowY: "scroll",}}>
                             {user1 && user1.map(author => {
                                return(
                                  <div key={author.id}>
                                    {comments && comments.map(post_com => {
                                        if (author.id === post_com.author && post_com.post_connected === pub.id){
                                          return(
                                            <div key={post_com.id} style={{overflowY: "scroll",}}>
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
                      <Menu
                        anchorEl={anchorElP}
                        getContentAnchorEl={null}
                        id={menuId}
                        keepMounted={false}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        open={isMenuOpenP}
                        onClose={handleMenuCloseP}
                        PaperProps={{
                            style: {
                              maxHeight: ITEM_HEIGHT * 4.5,
                              width: '5ch',
                              boxShadow: 'none',
                              border: '1px solid #ece7e7',
                              
                            },
                          }}
                      >
                        <MenuItem onClick={handleMenuCloseP}>
                          <DeleteForever fontSize="small" onClick={()=>dltPub(pub.id)}/>
                        </MenuItem>
                        <MenuItem onClick={handleMenuCloseP}>
                          <Edit fontSize="small" />
                        </MenuItem>
                      </Menu>
                    </Card>
                  </div>
                )
              }else return null;
            })
            }
          </div>
        )
      })}
    </div>
  );
}


{this.props.publication && this.props.publication.map(pub => {
          return(
          <div key = {pub.id}>
            {this.state.users && this.state.users.map(profile => {
              if (pub.user === profile.id){
                const id_pub = pub.user
                const id_aut = this.state.current.id
                return(
                  <div key = {profile.id}>
                    <Card className={classes.card}>
                      <CardHeader 
                        avatar={
                          <Avatar src={profile.avatar}/>
                        }
                        action={
                          <IconButton>
                            <MoreVert/>
                          </IconButton>
                        }
                        title={
                          <Link exact to='#' className={classes.link}>
                            <Typography className={classes.name}> {profile.username}</Typography>
                          </Link>
                        }
                        subheader={format(pub.date)}
                      />
                      <CardActionArea>
                        <CardMedia className={classes.media} image={pub.image} />
                        <CardContent>
                          <Typography gutterBottom variant="h5">{pub.title}</Typography>
                          <Typography variant="body">{pub.message}</Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions className={classes.card_action}>
                        <div className={classes.item}>.
                          <IconButton size="small" >
                            <FavoriteBorder/>
                          </IconButton>
                          <Button className={classes.link} size="small" variant="text" disabled><NumericLabel params={{shortFormat: true,}}>{pub.like_nbr}</NumericLabel>&nbsp; Like</Button>
                        </div>
                        <div className={classes.item}>
                          <Button className={classes.link} size="small" onClick={() => this.handleExpandClick(pub.id)}
                          aria-expanded={this.state[`expanded_${pub.id}`] || false}
                          ><NumericLabel params={{shortFormat: true,}}>{pub.comments_nbr}</NumericLabel>&nbsp; Comment</Button>
                          
                          <IconButton size="small" className={classes.right}>
                            <Share/>
                          </IconButton>
                        </div>
                      </CardActions>
                      <Collapse in={this.state[`expanded_${pub.id}`] || false} timeout="auto" unmountOnExit>
                        <CardContent>
                           <div className={classes.item}>
                            <Avatar src={this.state.current.avatar}/>&emsp;
                            <FormControl fullWidth>
                                  <Input
                                    placeholder="Your comments "
                                    multiline
                                    value = {this.state.comment}
                                    onChange = {e => this.setState({comment:e.target.value})}
                                    endAdornment={
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        edge="end"
                                        onClick={() => this.btnComment(this.state.comment,pub.id)}
                                        >
                                        <Telegram />
                                      </IconButton>
                                      </InputAdornment>
                                    }
                                  />
                              </FormControl>
                            </div>
                            <div style={{maxHeight: 150,overflowY: "scroll",}}>
                              {this.state.users && this.state.users.map(author => {
                                return(
                                  <div key={author.id}>
                                    {this.state.comments && this.state.comments.map(post_com => {
                                      if (author.id === post_com.author && post_com.post_connected === pub.id){
                                        return(
                                          <div key={post_com.id}>
                                            <div className={classes.item}>
                                              <List sx={{ width: '100%', bgcolor: 'background.paper', overflow: 'auto' }}>
                                                <ListItem alignItems="flex-start">
                                                  <ListItemAvatar>
                                                    <Avatar src={author.avatar} />
                                                  </ListItemAvatar>
                                                  <ListItemText
                                                    primary=<Link className={classes.link}>{author.username}</Link>
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
                                              </List>
                                            </div>
                                          </div>
                                        )
                                      }else return null
                                    })}
                                  </div>
                                )
                              })}
                            </div>
                          </CardContent>
                      </Collapse>
                    </Card>
                  </div>
                )}
            })}
            
          </div>)
        })}