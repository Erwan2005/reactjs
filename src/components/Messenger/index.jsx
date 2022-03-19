import React from 'react'
import { Search,Image,EmojiEmotions,AttachFile,
				ThumbUp,Telegram,Videocam,Call,MoreVert, 
				Menu, Notifications} from '@material-ui/icons';
import { connect } from "react-redux";
import ScrollToBottom from 'react-scroll-to-bottom';
import { CircularProgress } from '@material-ui/core';
import { Route,Switch,withRouter,Link } from 'react-router-dom';
import { publicRequest,userRequest } from '../../requestMethods';
import './style.css'
export class index extends React.Component {
	constructor(props){
		super(props);
		this.state={
			profile:[],
			conversation: false,
		}
	}
	getProfile = async() =>{
		let data = await publicRequest.get(`userapp/users/${this.props.user.id}`)
		.then(({data}) => data)
		this.setState({profile: data})
	}
	componentDidMount(){
	  	this.getProfile()
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
							<img src={this.state.profile.avatar} alt="avatar" />
						</div>
					</div>
				</div>
				<div className="central">
					<div className="left">
						{this.props.conversation ? (<>
					<div className="top">
						<div className="profile">
							<img src={this.props.friend.avatar} alt="avatar" />
							<div>
								<span>{this.props.friend.username}</span>
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
						{this.props.private_message && this.props.private_message.map(privateMessage=>{
							return(
								<div key={privateMessage.id}>
									<div className={(privateMessage.sender === parseInt(this.props.user.id, 10)) ? "owner" : "friend"}>
										{(privateMessage.sender === parseInt(this.props.user.id, 10)) ? null :<img src={this.props.friend.avatar} alt="avatar" className="avatar"/>}
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
						<div className="right-top">top</div>
						<div className="right-bottom">bottom</div>
					</div>
				</div>>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
});
export default connect(mapStateToProps,null)(withRouter(index))