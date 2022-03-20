import React from 'react'
import { Search,Image,EmojiEmotions,AttachFile,
				ThumbUp,Telegram,Videocam,Call,MoreVert, 
				Menu, Notifications} from '@material-ui/icons';
import { connect } from "react-redux";
import ScrollToBottom from 'react-scroll-to-bottom';
import { CircularProgress } from '@material-ui/core';
import { Route,Switch,withRouter,Link } from 'react-router-dom';
import { publicRequest,userRequest } from '../../requestMethods';
import _ from 'lodash';
import './style.css'
export class index extends React.Component {
	constructor(props){
		super(props);
		this.refImg = React.createRef();
	  this.refFl = React.createRef();
	  this.state={
	    message:'',
	    messages: [],
	    chosenEmoji: null,
	    open: false,
	    last_message: [],
	    doc_file: '',
	    image: '',
	    sending: false,
	    friend:[],
	    profile: [],
	    currentUser: [],
	    conversation: false,
	  };
	}

	getProfile = async() =>{
		let data = await publicRequest.get('userapp/users/')
		.then(({data}) => data)
		this.setState({profile: data})	
	}

	getCurrent = async() =>{
		let data = await publicRequest.get(`userapp/users/${this.props.user.id}`)
		.then(({data}) => data)
		this.setState({currentUser: data})	
		//console.log(this.state.currentUser.friends)
	}

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
      if (file.size > 3e6) {
		      window.alert("Please upload a file smaller than 3 MB");
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

  sendMessage = async() =>{
  	try{
  		this.setState({seding: true})
  		if(this.state.image == '' && this.state.doc_file == ''){
		  	let data = await publicRequest.post('userapp/message/',{sender:this.props.user.id,receiver:this.state.friend[0],content:this.state.message})
		  	.then(({data}) => data)
		  	this.setState({message:'',sending:false})
		  	this.state.private_message.concat(data)
		  }else if (this.state.image !== '' && this.state.doc_file == ''){
		  	let data = await publicRequest.post('userapp/message/',{sender:this.props.user.id,receiver:this.state.friend[0],content:this.state.message,img:this.state.image})
		  	.then(({data}) => data)
		  	this.setState({message:'',sending:false, image:''})
		  	this.state.private_message.concat(data)
		  }else if (this.state.doc_file !== '' && this.state.image == ''){
		  	let data = await publicRequest.post('userapp/message/',{sender:this.props.user.id,receiver:this.state.friend[0],content:this.state.message,files:this.state.doc_file})
		  	.then(({data}) => data)
		  	this.setState({message:'',sending:false, doc_file:''})
		  	this.state.private_message.concat(data)
		  }else{
		  	let data = await publicRequest.post('userapp/message/',{sender:this.props.user.id,receiver:this.state.friend[0],content:this.state.message,img:this.state.image,files:this.state.doc_file})
		  	.then(({data}) => data)
		  	this.setState({message:'',sending:false, image:'', doc_file:''})
		  	this.state.private_message.concat(data)
		  }

  	}catch(error){
    		throw new Error(error);
    }
  }

  getMessage = async(id,username,avatar) =>{
  	this.setState({private_message:[]})
  	this.setState({conversation: true})
  	let data = await publicRequest.get('userapp/message')
  	.then(({data}) => data)
    this.setState({messages: _.sortBy(data.results, "id")})
    await this.setState({friend: [id,username,avatar]})
    console.log(this.state.friend)
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
											<div className={(privateMessage.sender === parseInt(this.props.user.id, 10)) ? "owner" : "friend"}>
												{(privateMessage.sender === parseInt(this.props.user.id, 10)) ? null :<img src={this.state.friend[2]} alt="avatar" className="avatar"/>}
												<div className={(privateMessage.sender === parseInt(this.props.user.id, 10)) ? "owner-message" : "friend-message"}>
													<h4>{privateMessage.content}</h4>
													{privateMessage.img ? <img src={privateMessage.img} alt="image" /> : null}
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
									<div className="topbarStyle">
										<Image onClick={(event) => {
						                event.preventDefault();
						                this.refImg.current.click();
						                }}/>
									</div>
									<input type='file' onChange={(e) => {
							                this.imageHandler(e);
							              }} ref={this.refImg} style={{display: 'none'}} accept=".png, .jpg, .jpeg"/>

							    <input type='file'  onChange={(e) => {
							                this.docHandler(e);
							              }} ref={this.refFl} style={{display: 'none'}} accept=".pdf"/>
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
							<div className="online">	
								<div className="friend">
										<div className="avatar">
											<img src="https://cdn.pixabay.com/photo/2022/02/14/08/53/woman-7012726_960_720.jpg" alt="" />
											<span></span>
										</div>
								</div>
								<div className="friendText" onClick={() => this.handler(1)}>
									<span>Erwan</span>
									<small>Online</small>
								</div>
							</div>
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
															<div className="friend">
																	<div className="avatar">
																		<img src={user.avatar} alt="avatar" />
																		<span></span>
																	</div>
															</div>
															<div className="friendText" onClick={() => this.getMessage(user.id,user.username,user.avatar)}>
																<span>{user.username}</span>
																<small>Last messages</small>
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