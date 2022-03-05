import React from 'react'
import { connect } from "react-redux";
import { withRouter } from "react-router";
import ScrollToBottom from 'react-scroll-to-bottom';
import { CircularProgress } from '@material-ui/core';
import { Search,Image,EmojiEmotions,AttachFile,ThumbUp,Telegram,Videocam,ArrowDownward,Call,MoreVert } from '@material-ui/icons';
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
	    };
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
	  	let data = await publicRequest.post('userapp/message/',{sender:this.props.user.id,receiver:this.props.friend.id,content:this.state.message,img:this.state.image})
	  	.then(({data}) => data)

	  	this.setState({message:'',sending:false})
  	}catch(error){
    		throw new Error(error);
    }
  }

	render() {
		return (
			<div className="messenger">
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
										{privateMessage.files ? <a href={privateMessage.files} className="link" download><ArrowDownward style={{cursor: 'pointer',marginRight: '3px'}} /> Files</a> : null}
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
		)
	}
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
});
export default connect(mapStateToProps,null)(withRouter(index))