import React, {Fragment} from 'react'
import { Card,CardHeader,CardActionArea,
        CardMedia,CardContent, Typography,
        CardActions,withStyles, 
        Avatar,IconButton,Collapse,Button,List,
        ListItem,ListItemText,ListItemAvatar,
        InputBase,Divider } from '@material-ui/core';
import { MoreVert,FavoriteBorder,Share,Telegram,PermMedia,Room,EmojiEmotions,Favorite } from '@material-ui/icons';
import {format} from 'timeago.js';
import { Link } from 'react-router-dom';
import NumericLabel from 'react-pretty-numbers';
import axios from 'axios';
import { connect } from "react-redux";
import InfiniteScroll from 'react-infinite-scroll-component';
import _ from 'lodash';
import apiService from '../APIService';
import Story from './Story';


const useStyles = theme => ({
  media:{
    height: 250,
    [theme.breakpoints.down("sm")]:{
      height: 150,
    },
  },
  card:{
    marginBottom: theme.spacing(1),
    boxShadow: 'none',
    backgroundColor: '#424242',
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
    color: "#848484",
  },
  card_action:{
    display: "flex",
    justifyContent: "space-between",
    borderTop: '1px solid #484848',
  },
  card_header:{
    backgroundColor: "#424242",
  },
  item:{
    display: "flex",
    alignItems: "center",
    spacing: theme.spacing(1),
    color: "#848484",
  },
  link:{
    display: "flex",
    textDecoration: "none",
    color: "#848484",
    textTransform: 'capitalize',
  },
  share:{
    backgroundColor: '#424242',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    //boxShadow: '0px 1px 7px 0px rgba(0,0,0,0.37)',
  },
  share_top:{
    display: 'flex',
    alignItems: 'center',
  },
  shareBottom:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '10px'
  },
  options:{
    display: 'flex',
    marginLeft: theme.spacing(6.2),
  },
  option:{
    display: 'flex',
    alignItems: 'center',
    
    padding: theme.spacing(1),
    cursor: 'pointer',
    "&:hover": {
          background: '#454545',
          borderRadius: theme.spacing(1),
    },
    [theme.breakpoints.down("xs")]:{
      marginRight: '2px',
    },
  },
  shareIcon:{
    fontSize: '18px',
    marginRight: '3px',
  },
  shareOptionText:{
    fontSize: '12px',
    fontWeight: '500',
    color: "#848484",
    [theme.breakpoints.down("sm")]:{
      display: 'none',
    },
  },
  shareButton:{
    textTransform: 'none',
    background: 'green',
    color: 'white',
    fontWeight: '500',
    "&:hover": {
          background: 'green',
          fontWeight: 'bold',
    },
    [theme.breakpoints.down("xs")]:{
      width: '45px',
      height: '30px',
      fontSize: '13px',
      padding: '3px',
    },
  },
});



export class Post extends React.Component {
  constructor(props){
    super(props);
    this.refImg = React.createRef();
    this.state={
            expanded:false,
            anchorElP: '',
            comment: '',
            share: '',
            comments: [],
            publication: [],
            users: [],
            current: [],
            next_url: apiService.url+'publication/',
            count: null,
            more_exist: true,
            image: '',
            liked: false,
            like: [],
        };
    this.user = this.props.user
  };

  handleExpandClick = (id) => {
    this.setState({ [`expanded_${id}`]:  _.isUndefined(this.state[`expanded_${id}`])?true:!this.state[`expanded_${id}`] });
  };

  handleProfileMenuOpenP = (event) => {
    this.setState({anchorElP:event.currentTarget});
  };

  handleMenuCloseP = () => {
    this.setState({anchorElP:null});

  };
  getPub = async() =>{
   await axios({
        method: 'get',
        url: this.state.next_url,
        headers:{
          Authorization: `Token ${this.user.token}`,
        },
      }).then(res =>{
        var has_more = false
        if(res.data.next){
          has_more = true
        }
        this.setState({
          next_url: res.data.next,
          count: res.data.count,
          publication: res.data.results,
          more_exist: has_more,
        })
    })
  };
  getLike =   async() =>{
    let data = await axios.get(apiService.url+'like/')
    .then(({data})=>data)
    this.setState({like: data})
  };

  getCom = async() =>{
      let data = await axios({
        method: 'get',
        url: apiService.url+'comment/',
      }).then(({data}) => data)
      this.setState({comments: data})
  };
  getUser = async() =>{
    let data = await axios({
        method: 'get',
        url: apiService.url+'users/',
    }).then(({data}) => data)
    this.setState({users: data})
  };
  getCurrentUser = async() =>{
    let data = await axios({
      method: 'get',
      url: apiService.url+`users/${this.user.id}/`,
        
    }).then(({data}) => data)
    this.setState({current: data})
  };

  btnComment = async(content,id_post) => {
    let author = parseInt(this.user.id, 10)
    let post_connected = parseInt(id_post, 10)
    const contents = {content:content,author:author,post_connected:post_connected}
    let data = await axios.post(apiService.url+'comment/',contents)
    .then(({data}) => data)
    this.setState({comments: this.state.comments.concat(data)})
    this.setState({comment:''})

    };

  btnShare = async()=>{
    let author = parseInt(this.user.id, 10)
    const contents = {user:author,message: this.state.share,image:this.state.image}
    await axios.post(apiService.url+'publication/',contents,{
      headers:{
        Authorization: `Token ${this.user.token}`
      }
    }).then(res=>{
      console.log(res)
    })
    this.setState({share:'',image:''})
  };

  fetchData = async() =>{
    await axios({
        method: 'get',
        url: this.state.next_url,
        headers:{
          Authorization: `Token ${this.user.token}`,
        },
      }).then(res =>{
        var has_more = false
        if(res.data.next){
          has_more = true
        }
        this.setState({
          next_url: res.data.next,
          count: res.data.count,
          publication: this.state.publication.concat(res.data.results),
          more_exist: has_more,
        })
        console.log(this.state.count)
    })
  };

  imageHandler = async (e) => {

      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          this.setState({image:reader.result})
        }
      }
      reader.readAsDataURL(e.target.files[0])
      const file = e.target.files[0];
      const base64 = await this.convertBase64(file);
      this.setState({image:base64})
    };

  convertBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    };

  checkLiked = (userId,postId) =>{
    if (this.state.like.filter(item=> item.author === userId && item.post_connected === postId).length === 0)
      return false
    else return true
  };

  dlt =async(id)=>{
    await axios.delete(apiService.url+`like/${id}`)
    this.getLike()
  };

  dltLike = (userId,postId)=>{
    this.state.like.filter(item=> item.author === userId && item.post_connected === postId).map(cheked=>(this.dlt(cheked.id)))
  };

  postLike = async(author,post_connected) =>{
    let data = await axios.post(apiService.url+'like/',{author,post_connected})
    .then(({data})=>data)
    this.setState({like: this.state.like.concat(data)})
  };

  componentDidMount(){
    this.getUser()
    this.getPub()
    this.getCom()
    this.getCurrentUser()
    this.getLike()
  };
  render() {
    const { classes } = this.props;
    return (
      <InfiniteScroll
        pageStart={0}
        dataLength={this.state.more_exist} //This is important field to render the next data
        next={this.fetchData}
        hasMore={this.state.more_exist}
        loader={
          <p>Loinding ...</p>
          

        }
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        // below props only if you need pull down functionality
        pullDownToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        }
      >
        <Story profile={this.state.current.avatar}/>
        <div className={classes.share}>
          <div className={classes.share_top}>
            <Avatar src={this.state.current.avatar} style={{marginRight: 10}}/>
            <div style={{width: '100%'}}>
              <InputBase
                placeholder="Share your advice ... "
                multiline
                fullWidth
                value = {this.state.share}
                onChange = {e => this.setState({share:e.target.value})}
                style={{color: '#848484'}}
              />
              <Divider style={{backgroundColor: '#848484'}}/>
            </div>
          </div>
          <div className={classes.shareBottom}>
            <div className={classes.options}>
              <div className={classes.option} onClick={(event) => {
                event.preventDefault();
                this.refImg.current.click();
                }}>
                <PermMedia htmlColor="tomato" className={classes.shareIcon}/>
                <span className={classes.shareOptionText}>Photo / video</span>
              </div>
              <input type='file' id='file-img' onChange={(e) => {
                this.imageHandler(e);
              }} ref={this.refImg} style={{display: 'none'}}/>

              <div className={classes.option}>
                <Room htmlColor="green" className={classes.shareIcon}/>
                <span className={classes.shareOptionText}>Location</span>
              </div>

              <div className={classes.option}>
                <EmojiEmotions htmlColor="goldenrod" className={classes.shareIcon}/>
                <span className={classes.shareOptionText}>Feellings</span>
              </div>
            </div>
            <Button className={classes.shareButton} onClick={this.btnShare}>Share</Button>
          </div>
        </div>
        {this.state.publication && this.state.publication.map((pub, index) => {
          return(
          <div key = {pub.id}>
            {this.state.users && this.state.users.map(profile => {
              if (pub.user === profile.id){
                //const id_pub = pub.user
                //const id_aut = this.state.current.id
                return(
                  <div key = {profile.id}>
                    <Card className={classes.card}>
                      <CardHeader 
                        className={classes.card_header}
                        avatar={
                          <Avatar src={profile.avatar}/>
                        }
                        action={
                          <IconButton>
                            <MoreVert/>
                          </IconButton>
                        }
                        title={
                          <Link exact to={`/home/profile/${profile.id}`} className={classes.link}>
                            <Typography className={classes.name}> {profile.username}</Typography>
                          </Link>
                        }
                        subheader={format(pub.date)}
                      />
                      <CardActionArea>
                        <CardMedia className={classes.media} image={pub.image} />
                        <CardContent>
                          <Typography variant="h6">{pub.message}</Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions className={classes.card_action}>
                        <div className={classes.item}>
                          {(this.checkLiked(this.state.current.id,pub.id)) ? (
                            <Favorite htmlColor="pink" style={{cursor: 'pointer'}} onClick={() => this.dltLike(this.state.current.id,pub.id)}/>
                            ):(
                            <FavoriteBorder htmlColor="pink" style={{cursor: 'pointer'}} onClick={() => this.postLike(this.state.current.id,pub.id)}/>
                          )
                          }
                          <Button className={classes.link} size="small" variant="text" disabled><NumericLabel params={{shortFormat: true,}}>{this.state.like.filter(item=> item.post_connected === pub.id).length}</NumericLabel>&nbsp; Like</Button>
                        </div>
                        <div className={classes.item}>
                          <Button className={classes.link} size="small" onClick={() => this.handleExpandClick(pub.id)}
                          aria-expanded={this.state[`expanded_${pub.id}`] || false}
                          ><NumericLabel params={{shortFormat: true,}}>{this.state.comments.filter(item=> item.post_connected === pub.id).length}</NumericLabel>&nbsp; Comment</Button>
                          
                          <IconButton size="small" className={classes.right}>
                            <Share/>
                          </IconButton>
                        </div>
                      </CardActions>
                      <Collapse in={this.state[`expanded_${pub.id}`] || false} timeout="auto" unmountOnExit>
                        <CardContent>
                           <div className={classes.item}>
                            <Avatar src={this.state.current.avatar}/>&emsp;
                            <div style={{width: '100%'}}>
                              <InputBase
                                placeholder="Your comments... "
                                multiline
                                fullWidth
                                value = {this.state.comment}
                                onChange = {e => this.setState({comment:e.target.value})}
                                style={{color: '#848484'}}
                              />
                              <Divider style={{backgroundColor: '#848484'}}/>
                            </div>
                            <IconButton
                              edge="end"
                              onClick={() => this.btnComment(this.state.comment,pub.id)}
                            >
                              <Telegram />
                            </IconButton>

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
                )}else return null
            })}
            
          </div>)
        })}
      </InfiniteScroll>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
});
export default connect(mapStateToProps)(withStyles(useStyles)(Post));