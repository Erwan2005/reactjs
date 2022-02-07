import React from 'react';
import { withStyles,Avatar,Typography,InputBase } from '@material-ui/core';
import { Telegram,EmojiEmotions,Close,Videocam,PhotoCamera,AttachFile,ThumbUp,ArrowDownward } from '@material-ui/icons';
import axios from 'axios';
import {format} from 'timeago.js';
import {io} from "socket.io-client";
import ScrollToBottom from 'react-scroll-to-bottom';
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import apiService from '../APIService';
import _ from 'lodash';

const useStyles = theme => ({
	container:{
		width: '350px',
		height: '450px',
		position: 'fixed',
		bottom: '0px',
		right: '30px',
		zIndex:2,
		[theme.breakpoints.down("xs")]:{
      width: "100vw",
      height: "100vh",
      overflowY: "auto",
      borderRadius: 0,
    },
	},
	contItemBottom:{
		width: '100%',
		height: 'calc(100% - 105px)',
		
	},
	itemTop:{
		width: '100%',
		height: '10%',
		alignItems: 'center',
		justifyContent: 'space-between',
		display: 'flex',
		textTransform: 'capitalize',
		color: "#848484",
		fontSize: "20px",
		fontWeight: 500,
		borderBottom: '1px solid #464646',
	},

	messageInput:{
  	width: '75%',
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
	    color: 'white',
	    maxWidth: '200px',
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
	  color: 'black',
	  maxWidth: '200px',
	},

	messageBottom:{
	    fontSize: '8px',
	    alignItems: 'flex-end',
	},

	inputCustom:{
		width: '95%',
		minHeight: '8%',
		textTransform: 'capitalize',
		backgroundColor: ' #464646',
		borderRadius: theme.spacing(3),
		display: 'flex',
		alignItems: 'center',
		color: "#ececec",
		paddingLeft: '10px',
		paddingRight: '10px',
		position: 'relative',

	},
	contItem:{
		width: "100%",
		height: "100%",
		borderTopLeftRadius: theme.spacing(2),
		borderTopRightRadius: theme.spacing(2),
		backgroundColor: '#3e3e3e',
	},
	image:{
		maxWidth: '180px',
		borderRadius: '4px',
	},

	emoji:{
		position: 'absolute',
		width: '36%',
		height: '41%',
		backgroundColor: '#3a3a3a',
		bottom: '350px',
		borderRadius: theme.spacing(2),
	},
	link:{
    display: "flex",
    textDecoration: "none",
    color: "#808080",
    alignItems: "center",
  },

});
export class BoxMessage extends React.Component {
	constructor(props){
    	super(props);
    	this.refImg = React.createRef();
    	this.socket = React.createRef();
    	this.state={
    		message:'',
    		messages:[],
    		profile:[],
    		image: '',
    		arrivalMessage: null,
    		chosenEmoji: null,
    		open: false,
    	};
    	this.scrollRef = React.createRef();
	};
	getProfile = async()=>{
		let data = await axios.get(apiService.url+`users/${this.props.receiver}/`)
		.then(({data}) => data)
		this.setState({profile:data})
	};
	getMessage = async()=>{
		let data = await axios.get(apiService.url+'message/')
		.then(({data}) => data)
		this.setState({messages:_.sortBy(data.results, "id")})

	};

	sendMessage = async(own,receiver,content)=>{
		if(this.state.image !== ''){
			let data = await axios.post(apiService.url+'message/',{sender:own,receiver:receiver,content:content,img:this.state.image})
			.then(({data}) => data)
			this.setState({messages: data.results})
			this.setState({message: ''})
		}else{
			this.props.socket.emit("sendMessage", {
	      senderId: own,
	      receiverId:receiver,
	      text: content,
	    });

			let data = await axios.post(apiService.url+'message/',{sender:own,receiver:receiver,content:content})
			.then(({data}) => data)
			this.setState({messages: this.state.messages.concat(_.sortBy(data.results, "id"))})
			this.setState({message: ''})

		}
		
	};

	onlineMes = () =>{
		this.props.socket.on("getMessage", (data) => {
			console.log(data)
    	this.setState({arrivalMessage: data})
    });
	};

	closeBox = () =>{
		this.props.open()
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

  onEmojiClick = (event, emojiObject) => {
	    this.setState({chosenEmoji: emojiObject})
	    this.setState({message: this.state.message+emojiObject.emoji})
	};

	componentDidMount(){
			this.onlineMes()
	    this.getProfile()
	    this.getMessage()
	    
	  };
	render() {
		const { classes } = this.props;
		return (
			<div className={classes.container}>
				<div className={classes.contItem}>
					<div className={classes.itemTop}>
						<div style={{display: 'flex',alignItems: 'center',paddingLeft: '5px',paddingBottom: '2px'}}>
							<Avatar src={this.state.profile.avatar}/>
							<Typography style={{marginLeft: '6px',}} >
								{this.state.profile.username}
							</Typography>
						</div>
						<div style={{display: 'flex',alignItems: 'center',paddingRight: '5px'}}>
							<Videocam style={{marginRight:'6px', cursor: 'pointer'}}/>
							<Close style={{cursor: 'pointer'}} onClick={this.closeBox}/>
						</div>
					</div>
					<ScrollToBottom className={classes.contItemBottom}>
						{this.state.messages && this.state.messages.map(privateMessage=>{
							
							if((this.props.own === privateMessage.sender || this.props.own === privateMessage.receiver) && (this.props.receiver === privateMessage.sender || this.props.receiver === privateMessage.receiver)){
								return(
									<div key={privateMessage.id}>
										<div className={(privateMessage.sender === this.props.own) ? classes.messageOwn : classes.message}>
											<div style={{display: 'flex'}}>
												{(privateMessage.sender === this.props.own) ? null : <Avatar src={this.state.profile.avatar} style={{marginRight: '5px'}} />}
												<div className={(privateMessage.sender === this.props.own) ? classes.messageOwnTex : classes.messageText}>
													<Typography > {privateMessage.content} </Typography>
													{privateMessage.img ? <img src={privateMessage.img} className={classes.image} alt='' /> : null}
													{privateMessage.files ? <a href={privateMessage.files} className={classes.link} download><ArrowDownward style={{cursor: 'pointer',marginRight: '3px'}} /> Files</a> : null}
												</div>
											</div>
										</div>
									</div>
								)
							}else return null
						})}
						
					</ScrollToBottom>
					<div style={{padding:"10px"}}>
						<div className={classes.inputCustom}>
							<AttachFile style={{cursor: 'pointer'}}/>
							<PhotoCamera style={{cursor:'pointer',marginRight: '1px'}} onClick={(event) => {
			                event.preventDefault();
			                this.refImg.current.click();
			                }}/>
							<input type='file' id='file-img' onChange={(e) => {
				                this.imageHandler(e);
				              }} ref={this.refImg} style={{display: 'none'}}/>
							<EmojiEmotions style={{cursor:'pointer',marginRight: '1px'}} onClick={() =>this.setState({open:!this.state.open})}/>
							<textarea
								className={classes.messageInput}
		            placeholder="write something..."
		            value = {this.state.message}
              	onChange = {e => this.setState({message:e.target.value})}
		          ></textarea>
		          {this.state.message ==='' ? (<ThumbUp style={{cursor: 'pointer',marginRight: '3px',marginLeft: '5px'}}/>) : (
		            <Telegram style={{cursor: 'pointer',marginRight: '3px',marginLeft: '5px'}} onClick={() => this.sendMessage(this.props.own,this.state.profile.id,this.state.message)}/>)}
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
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default withStyles(useStyles)(BoxMessage)