import React from 'react'
import { Search,Image,EmojiEmotions,AttachFile,
				ThumbUp,Telegram,Videocam,Call,MoreVert, 
				Menu, Notifications} from '@material-ui/icons';
import { toast } from 'react-toastify';
import { connect } from "react-redux";
import ScrollToBottom from 'react-scroll-to-bottom';
import { CircularProgress } from '@material-ui/core';
import { Route,Switch,withRouter,Link } from 'react-router-dom';
import { publicRequest,userRequest,parseRequest } from '../../requestMethods';
import _ from 'lodash';
import './style.css'
export class index extends React.Component {
	constructor(props){
		super(props);
		this.refImg = React.createRef();
	  this.refFl = React.createRef();
	  this.socket = React.createRef();
	  this.state={
	    message:'',
	    messages: [],
	    chosenEmoji: null,
	    open: false,
	    last_message: {},
	    doc_file: null,
	    image: null,
	    video: null,
	    sending: false,
	    friend:[],
	    profile: [],
	    currentUser: {},
	    conversation: false,
	  };
	}

	getProfile = async() =>{
		let data = await userRequest.get('userapp/users/')
		.then(({data}) => data)
		this.setState({profile: data})	
	}

	getCurrent = async() =>{
		let data = await userRequest.get(`userapp/users/${this.props.user.id}`)
		.then(({data}) => data)
		this.setState({currentUser: data})	
	}

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
      if (file.size > 20e6) {
		      toast.error("Please upload a file smaller than 20 MB");
		      return false;
		    }else {
		      if(file.type.split('/')[0] ==='image'){
		      	this.setState({image:file})
		      }else if(file.type.split('/')[0] ==='video'){
		      	this.setState({video: file})
		      }else{
		      	this.setState({doc_file:file})
		      }
		    }
  };

  sendMessage = async() =>{
  	if(this.state.video !==null){
				let formData = new FormData();
				formData.append("sender",this.props.user.id);
				formData.append("receiver",this.state.friend[0]);
				formData.append("content",this.state.message);
				formData.append(
	        "video",
	        this.state.video,
	        this.state.video.name
	      );
				let data = await parseRequest.post('userapp/message/',formData)
				.then(({data}) => data)
	      this.setState({message:'',sending:false, image:'', doc_file:'',private_message: this.state.private_message.concat(data)})
		}else if(this.state.image !==null){
				let formData = new FormData();
				formData.append("sender",this.props.user.id);
				formData.append("receiver",this.state.friend[0]);
				formData.append("content",this.state.message);
				formData.append(
	        "img",
	        this.state.image,
	        this.state.image.name
	      );
				let data = await parseRequest.post('userapp/message/',formData)
				.then(({data}) => data)
	      this.setState({message:'',sending:false, image:'', doc_file:'',private_message: this.state.private_message.concat(data)})
		}else if(this.state.doc_file !==null){
				let formData = new FormData();
				formData.append("sender",this.props.user.id);
				formData.append("receiver",this.state.friend[0]);
				formData.append("content",this.state.message);
				formData.append(
	        "files",
	        this.state.doc_file,
	        this.state.doc_file.name
	      );
				let data = await parseRequest.post('userapp/message/',formData)
				.then(({data}) => data)
	      this.setState({message:'',sending:false, image:'', doc_file:'',private_message: this.state.private_message.concat(data)})
		}else{
			let formData = new FormData();
				formData.append("sender",this.props.user.id);
				formData.append("receiver",this.state.friend[0]);
				formData.append("content",this.state.message);
				let data = await parseRequest.post('userapp/message/',formData)
				.then(({data}) => data)
				this.setState({message:'',sending:false, image:'', doc_file:'',private_message: this.state.private_message.concat(data)})
		}
  }

  getMessage = async(id,username,avatar) =>{
  	this.setState({private_message:[]})
  	this.setState({conversation: true})
  	let data = await userRequest.get('userapp/message')
  	.then(({data}) => data)
    this.setState({messages: _.sortBy(data.results, "id")})
    await this.setState({friend: [id,username,avatar]})
    console.log(this.state.onlineUser)
    this.setState({receiver: id})
    //await this.state.messages.filter(item=> (item.sender === parseInt(id, 10) && item.receiver=== parseInt(this.id, 10)) || (item.receiver === parseInt(id, 10) && item.sender=== parseInt(this.id, 10))).map(checked=>(this.setState({private_message:checked})))
    await this.state.messages && this.state.messages.map((item) =>{
    	if ((item.sender === parseInt(id, 10) && item.receiver=== parseInt(this.props.user.id, 10)) || (item.receiver === parseInt(id, 10) && item.sender=== parseInt(this.props.user.id, 10))){
    		this.setState({private_message:this.state.private_message.concat(item)})
    	}
    })
  };

	componentDidMount(){
	  	this.getProfile()
	  	this.getCurrent()
	  	
	 };
	render() {
		return (
			<div className="messenger">
				<div className='topBar'>
					<div className="toggles" onClick={this.props.styleElement}> <Menu /> </div>

					<div className="main-right">
						<div className="topbarStyle">
							<Notifications/>
						</div>
						<div className="topbarStyle">
							<img src={this.state.currentUser.avatar} alt="avatar" />
						</div>
					</div>
				</div>
				<div className="central">
					<div className="left">
						{this.state.conversation ? (<>
							<div className="top">
								<div className="profile">
									<img src={this.state.friend[2]} alt="avatar" />
									<div>
										<span>{this.state.friend[1]}</span>
										<small>Online</small>
									</div>	
								</div>
								<div className="right-action">
									<Videocam className="icon"/>
									<Call className="icon"/>
									<MoreVert className="icon"/>
								</div>
							</div>
							<ScrollToBottom className="middle">
								{this.state.private_message && this.state.private_message.map(privateMessage=>{
									return(
										<div key={privateMessage.id}>
											<div className={(privateMessage.sender === parseInt(this.props.user.id, 10)) ? "owner" : "friend-sm"}>
												{(privateMessage.sender === parseInt(this.props.user.id, 10)) ? null :<img src={this.state.friend[2]} alt="avatar" className="avatar"/>}
												<div className={(privateMessage.sender === parseInt(this.props.user.id, 10)) ? "owner-message" : "friend-message"}>
													<h4>{privateMessage.content}</h4>
													{privateMessage.img ? <img src={privateMessage.img} alt="image" /> : null}
													{privateMessage.video ? <video src={privateMessage.video} controls /> : null}
													{privateMessage.files ? <a href={privateMessage.files} download>&#x2913; Files</a> : null}
													<small>&#10003;</small>
												</div>
											</div>
										</div>
									)
								})}
							</ScrollToBottom>
							<div className="bottom">
								<div className="bot-icons">
							    <input type='file'  onChange={(e) => {
							                this.docHandler(e);
							              }} ref={this.refFl} style={{display: 'none'}}/>
									<div className="topbarStyle">
										<AttachFile onClick={(event) => {
						                event.preventDefault();
						                this.refFl.current.click();}}/>
									</div>
									<div className="topbarStyle">
										<EmojiEmotions />
									</div>
								</div>
								<>
									<textarea placeholder="Enter your message ..."
									value = {this.state.message}
									onChange = {e => this.setState({message:e.target.value})}></textarea>
									{this.state.message ==='' ?(
										<div className="topbarStyle">
											 <ThumbUp />
										</div>) : (
										<div className="topbarStyle" onClick = {this.sendMessage}>
											{this.state.sending ? <CircularProgress /> : <Telegram />}
										</div>
									)}
								</>
							</div></>) :
								<div className="no-conversation">No conversion selected</div>
							}

					</div>
					<div className="right-bar">
						<div className="right-top">
							{this.state.onlineUser && this.state.onlineUser.map(f=>{
								return(
									<>
										{this.state.profile && this.state.profile.map(p=>{
											if(f.friend_id === p.id){
												return(
													<div className="online">	
														<div className="friend">
																<div className="avatar">
																	<img src={p.avatar} alt="" />
																	<span></span>
																</div>
														</div>
														<div className="friendText" onClick={() => this.handler(1)}>
															<span>{p.username}</span>
															<small>Online</small>
														</div>
													</div>
												)
											}else return null;
										})}
									</>
								)
								
								})}
						</div>
						<div className="right-bottom">
							{this.state.currentUser.friends && this.state.currentUser.friends.map(friend =>{
								return(
									<>
										{
											this.state.profile && this.state.profile.map(user =>{
												if(user.id === friend.friend_id){
													return(
														<div className="chat" key={friend.id}>	
															<div className="friend-sm">
																	<div className="avatar">
																		<img src={user.avatar} alt="avatar" />
																		<span></span>
																	</div>
															</div>
															<div className="friendText" onClick={() => this.getMessage(user.id,user.username,user.avatar)}>
																<span>{user.username}</span>
																<small>{this.state.last_message.content}</small>
															</div>
														</div>
													)
												}else return null
											})
										}
									</>
								)
							})}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
});
export default connect(mapStateToProps,null)(withRouter(index))