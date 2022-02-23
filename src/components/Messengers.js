import React from 'react'
import { withRouter } from "react-router";
import { withStyles,InputBase,Avatar,Typography,Badge } from '@material-ui/core';
import { Search,Image,EmojiEmotions,AttachFile,ThumbUp,Telegram,Videocam,ArrowDownward } from '@material-ui/icons';
import ScrollToBottom from 'react-scroll-to-bottom';
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import axios from 'axios';
import {format} from 'timeago.js';
//import PdfThumbnail from 'react-pdf-thumbnail'; 
import _ from 'lodash';
import apiService from '../APIService';

const useStyles = theme => ({
  container: {
    color: "#848484",
    position :"fixed",
    display: 'flex',
    margin: theme.spacing(2),
  },
  left:{
  	width: '20vw',
  	height: '100vh',
  	borderRight: '1px solid #3a3a3a',
  	paddingRight: theme.spacing(1),
  	paddingBottom: theme.spacing(1),
  	[theme.breakpoints.down("sm")]:{
      display: 'none',
    },
  },
  middle:{
  	width: '56vw',
  	height: '100vh',
  	paddingLeft: theme.spacing(1),
  	paddingRight: theme.spacing(1),
  	paddingBottom: theme.spacing(3),
  	position: 'relative',
  	display: 'flex',
  	flexDirection: 'column',
  	justifyContent: 'space-between',
  	[theme.breakpoints.down("sm")]:{
      width: '100vw',
  		height: '100vh',
    },
  },

  top:{
  	display: 'none',
  	[theme.breakpoints.down("sm")]:{
  		width: '85%',
      height: '10%',
      maxHeight: '10%',
  		display: 'flex',
  		overflowX: 'auto'
    },
  },
  bottomMid:{
  	height: '100%',
  	[theme.breakpoints.down("sm")]:{
      height: '80%',
      maxWidth: '90%',
      maxHeight: '80%',
    },

  },

  right:{
  	width: '20vw',
  	borderLeft: '1px solid #3a3a3a',
  	paddingLeft: theme.spacing(1),
  	paddingBottom: theme.spacing(1),
  	[theme.breakpoints.down("sm")]:{
      display: 'none',
    },
  },
  search:{
  	width: '95%',
  	minHeight: '3.5%',
  	backgroundColor: '#3a3a3a',
  	padding: theme.spacing(0.5),
  	marginTop: theme.spacing(0.5),
  	alignItems: 'center',
  	display: 'flex',
  	borderRadius: theme.spacing(3),
  },
  list:{
  	marginTop: theme.spacing(1),
  	marginBottom: theme.spacing(1),
  	width: '95%',
  	maxHeight: '90%',
  	overflowY: 'auto',

  },
  item:{
  	display: 'flex',
  	padding: theme.spacing(1),
  	alignItems: 'center',
  	cursor: 'pointer',
  	"&:hover": {
        background: '#3a3a3a',
        borderRadius: theme.spacing(1),
    },
  },
  name:{
  	marginLeft: theme.spacing(1),
  	spacing: 0,
  },
  messenger:{
  	justifyContent: 'center',
  	height: 'calc(100% - 150px)',
  	maxHeight: 'calc(100% - 150px)',
  	overflowY: 'hide',
  },
  bottom:{
  	backgroundColor: '#3a3a3a',
  	alignItems: 'center',
  	display: 'flex',
  	borderRadius: theme.spacing(3),
  	marginBottom: theme.spacing(2)
  },
  messageInput:{
  	width: '84%',
  	maxWidth:'84%',
  	height: '40px',
  	maxHeight:'40px',
    border: '1px solid #555',
    fontSize: '14px',
    fontWeight: 'bold',
    color: "#848484",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    backgroundColor: '#3a3a3a',
    "&:focus": {
        outline: 'none',
    },
  },

 	message:{
		display: 'flex',
		padding: '10px',
		textTransform: 'capitalize',
	},
	messageText:{
	    padding: '10px',
	    borderTopRightRadius: '20px',
	    borderBottomRightRadius: '20px',
	    borderBottomLeftRadius: '20px',
	    backgroundColor: '#666666',
	    color: 'black',
	    maxWidth: '300px',
	},
	messageOwn:{
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-end',
		padding: '10px',
		textTransform: 'capitalize',
	},

	messageOwnTex:{
			padding: '10px',
	    borderTopLeftRadius: '20px',
	    borderBottomLeftRadius: '20px',
	    borderBottomRightRadius: '20px',
	    backgroundColor: '#2a6db1',
	    color: 'white',
	    maxWidth: '300px',
	},
	emoji:{
		position: 'absolute',
		width: '36%',
		height: '41%',
		backgroundColor: '#3a3a3a',
		bottom: '85px',
		borderRadius: theme.spacing(2),
	},
	badge:{
		backgroundColor: '#44b700',
    color: '#44b700',
    border: '2.5px solid #323232',
    width: '15px',
    height: '15px',
    borderRadius: '50%',
	},
	image:{
		maxWidth: '280px',
		borderRadius: '4px',
	},
	image2:{
		maxWidth: '50px',
		borderRadius: '4px',
		marginRight: '2px',
	},

	link:{
    display: "flex",
    textDecoration: "none",
    color: "#808080",
    alignItems: "center",
  },

})

export class Messenger extends React.Component {
	constructor(props){
	    super(props);
	    this.id = this.props.match.params.id;
	    this.refImg = React.createRef();
	    this.refFl = React.createRef();
	    this.state={
	    	message:'',
	    	messages: [],
	    	chosenEmoji: null,
	    	open: false,
	    	friends: [],
	    	profile: [],
	    	user: [],
	    	private_message: [],
	    	receiver: '',
	    	conversation: false,
	    	last_message: [],
	    	doc_file: '',
	    	image: '',
	    };
	};


	onEmojiClick = (event, emojiObject) => {
	    this.setState({chosenEmoji: emojiObject})
	    this.setState({message: this.state.message+emojiObject.emoji})
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
      if (file.size > 3e6) {
		      window.alert("Please upload a file smaller than 3 MB");
		      return false;
		    }else{
		      const base64 = await this.convertBase64(file);
		      this.setState({image:base64})}
    };

    docHandler = async (e) => {

      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          //this.setState({image:reader.result})
          console.log('file readed')
        }
      }
      reader.readAsDataURL(e.target.files[0])
      const file = e.target.files[0];
      if (file.size > 10e6) {
		      window.alert("Please upload a file smaller than 10 MB");
		      return false;
		    }else {
		      const base64 = await this.convertBase64(file);
		      this.setState({doc_file:base64})}
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

  getUser = async() =>{
    let data = await axios({
        method: 'get',
        url: apiService.url+'users/',
    }).then(({data}) => data)
    this.setState({profile: data})
  };

  getFriend = async() =>{
    let data = await axios({
        method: 'get',
        url: apiService.url+'friend/',
    }).then(({data}) => data)
    this.setState({friends: data})
  };

  getMessage = async(id,username,avatar) =>{
  	this.setState({private_message:[]})
  	this.setState({conversation: true})
  	let data = await axios({
        method: 'get',
        url: apiService.url+'message/',
    }).then(({data}) => data)
    this.setState({messages: _.sortBy(data.results, "id")})
    await this.setState({user: [id,username,avatar]})
    this.setState({receiver: id})
    //await this.state.messages.filter(item=> (item.sender === parseInt(id, 10) && item.receiver=== parseInt(this.id, 10)) || (item.receiver === parseInt(id, 10) && item.sender=== parseInt(this.id, 10))).map(checked=>(this.setState({private_message:checked})))
    await this.state.messages && this.state.messages.map((item) =>{
    	if ((item.sender === parseInt(id, 10) && item.receiver=== parseInt(this.id, 10)) || (item.receiver === parseInt(id, 10) && item.sender=== parseInt(this.id, 10))){
    		this.setState({private_message:this.state.private_message.concat(item)})
    	}
    })
  };

  getLastmessage = async(id) =>{
  	return await this.state.messages.filter(item=> (item.sender === parseInt(id, 10) && item.receiver=== parseInt(this.id, 10)) || (item.receiver === parseInt(id, 10) && item.sender=== parseInt(this.id, 10)))[this.state.messages.filter(item=> (item.sender === parseInt(id, 10) && item.receiver=== parseInt(this.id, 10)) || (item.receiver === parseInt(id, 10) && item.sender=== parseInt(this.id, 10))).length-1]
  };

  sendMessage = async(own,receiver,content)=>{
		if(this.state.image !== '' || this.state.doc_file !== ''){
			if (this.state.image !== ''){
				let data = await axios.post(apiService.url+'message/',{sender:own,receiver:receiver,content:content,img:this.state.image})
				.then(({data}) => data)
				this.setState({messages: this.state.messages.concat(data)})
				this.setState({message: ''})
				this.setState({image: ''})}
			else if (this.state.doc_file !== ''){
				let data = await axios.post(apiService.url+'message/',{sender:own,receiver:receiver,content:content,files:this.state.doc_file})
				.then(({data}) => data)
				this.setState({messages: this.state.messages.concat(data)})
				this.setState({message: ''})
				this.setState({doc_file: ''})}
		}else{
			let data = await axios.post(apiService.url+'message/',{sender:own,receiver:receiver,content:content})
			.then(({data}) => data)
			this.setState({messages: this.state.messages.concat(data)})
			this.setState({message: ''})
			this.setState({image: ''})
	  };

		};
		
  componentDidMount(){
    this.getUser()
    this.getFriend()
  };

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.container}>
				<div className={classes.left}>
					My conversation
					<div className={classes.search}>
						<Search style={{marginRight: '4px'}}/>
						<InputBase
			                placeholder="Search... "
			                fullWidth
			                style={{color: '#848484', fontSize: '16px'}}
			            />
					</div>
					<div className={classes.list}>
						{this.state.friends && this.state.friends.map(friend => {
							if (friend.user === parseInt(this.id, 10)){
								return(
									<div key={friend.id}>
										{this.state.profile.filter(item=> item.id === parseInt(friend.friend,10)).map(checked=>{
											return(
												<div className={classes.item} key={checked.id} onClick={() => this.getMessage(checked.id,checked.username,checked.avatar)}>
													<Avatar src={checked.avatar}/>
													<div className={classes.name}>
														<Typography style={{textTransform:'capitalize'}}>{checked.username}</Typography>
														<Typography style={{fontSize: '10px'}}>last message</Typography>
													</div>
												</div>
											)
										})}
									</div>
								)
							}else return null
						})}
					</div>
				</div>

				<div className={classes.middle}>
					{this.state.conversation ? (<>
					<div style={{height: '5.5%',padding: '5px',backgroundColor: '#3a3a3a',justifyContent: 'space-between',alignItems:'center',display: 'flex'}}>
						<div style={{display: 'flex'}}>
							<Avatar src={this.state.user[2]}/>
							<div className={classes.name}>
								<Typography style={{textTransform:'capitalize'}}>{this.state.user[1]}</Typography>
								<Typography style={{fontSize: '10px'}}>Online</Typography>
							</div>
						</div>
						<Videocam style={{cursor: 'pointer'}}/>
					</div>
					<ScrollToBottom className={classes.messenger}>
						{this.state.private_message && this.state.private_message.map(privateMessage=>{
							return(
								<div key={privateMessage.id}>
									<div className={(privateMessage.sender === parseInt(this.id, 10)) ? classes.messageOwn : classes.message}>
										<div style={{display: 'flex'}}>
											{(privateMessage.sender === parseInt(this.id, 10)) ? null : <Avatar src={this.state.user[2]} style={{marginRight: '10px'}} />}
											<div className={(privateMessage.sender === parseInt(this.id, 10)) ? classes.messageOwnTex : classes.messageText}>
												<Typography > {privateMessage.content} </Typography>
												{privateMessage.img ? <img src={privateMessage.img} className={classes.image} alt='' /> : null}
												{privateMessage.files ? <a href={privateMessage.files} className={classes.link} download><ArrowDownward style={{cursor: 'pointer',marginRight: '3px'}} /> Files</a> : null}
											</div>
										</div>
									</div>
								</div>
							)
						})}
					</ScrollToBottom>
					<div className={classes.bottom}>
						<AttachFile style={{cursor: 'pointer',marginRight: '3px'}} onClick={(event) => {
			                event.preventDefault();
			                this.refFl.current.click();}}/>
						<Image style={{cursor: 'pointer',marginRight: '3px'}} onClick={(event) => {
			                event.preventDefault();
			                this.refImg.current.click();
			                }}/>

						<input type='file' onChange={(e) => {
				                this.imageHandler(e);
				              }} ref={this.refImg} style={{display: 'none'}} accept=".png, .jpg, .jpeg"/>

				    <input type='file'  onChange={(e) => {
				                this.docHandler(e);
				              }} ref={this.refFl} style={{display: 'none'}} accept=".pdf"/>

						<EmojiEmotions style={{cursor: 'pointer',marginRight: '4px'}} onClick={() =>this.setState({open:!this.state.open})}/>
						<img src={this.state.image} className={classes.image2} alt='' />
						<textarea
							className={classes.messageInput}
		                    placeholder="write something..."
		                    value = {this.state.message}
              				onChange = {e => this.setState({message:e.target.value})}
		                ></textarea>
		                {this.state.message ==='' ? (<ThumbUp style={{cursor: 'pointer',marginRight: '3px',marginLeft: '5px'}}/>) : (
		                <Telegram style={{cursor: 'pointer',marginRight: '3px',marginLeft: '5px'}} onClick={() => this.sendMessage(this.id,parseInt(this.state.receiver,10),this.state.message)}/>)}
					</div>
					{this.state.open && (
						<div className={classes.emoji}>
							<Picker
								style={{backgroundColor: '#3a3a3a'}}
						        onEmojiClick={this.onEmojiClick}
						        disableAutoFocus={true}
						        skinTone={SKIN_TONE_MEDIUM_DARK}
						        groupNames={{ smileys_people: "PEOPLE" }}
						        native
						    />
						</div>
					)}
					</>) : (<div><Typography style={{fontSize: '35px'}}>No conversation selected</Typography></div>)}
				</div>

				<div className={classes.right}>
					Online Friends
					<div className={classes.search}>
						<Search style={{marginRight: '4px'}}/>
						<InputBase
			                placeholder="Search... "
			                fullWidth
			                style={{color: '#848484', fontSize: '16px' }}
			            />
					</div>
					<div className={classes.list}>
						<div className={classes.item}>
							<Badge overlap="circular" badgeContent="" variant="dot" classes={{ badge: classes.badge }} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Avatar />
              </Badge>
							<div className={classes.name}>
								<Typography>Manohisoa</Typography>
								<Typography style={{fontSize: '10px'}}>Online</Typography>
							</div>
						</div>
					</div>

				</div>
			</div>
		)
	}
}

export default withRouter(withStyles(useStyles)(Messenger))