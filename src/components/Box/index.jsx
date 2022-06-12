import React from 'react'
import { Videocam,Call,Close,AttachFile,
	EmojiEmotions,ThumbUp,Telegram } from '@material-ui/icons';
import { toast } from 'react-toastify';
import './style.css'
export class index extends React.Component {
	constructor(props){
		super(props);
		this.refFl = React.createRef();
		this.state={
			message: '',
			doc_file: null,
			image: null,
			video: null,
		}
	}

	docHandler = async (e) => {

		const reader = new FileReader();
		reader.onload = () =>{
		  if(reader.readyState === 2){
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

	close = () =>{
		this.props.handleClose()
	}
	render() {
		return (
			<div className="box-message">
				<div className="box-header">
					<div className="header-left">
						<img src={this.props.user.avatar} alt="" />
						<div className="userInfo">
							<span>{this.props.user.username}</span>
							<small>Online</small>
						</div>
					</div>
					<div className="header-right">
						<span><Call/></span>
						<span><Videocam/></span>
						<span><Close onClick={this.close}/></span>
					</div>
				</div>
				<div className="box-middle">
				</div>
				<div className="box-footer">
					<span onClick={(event) => {
						event.preventDefault();
						this.refFl.current.click();}}><AttachFile /></span>
					<span><EmojiEmotions /></span>
					<textarea placeholder="Enter your message ..." 
					value = {this.state.message}
					onChange = {e => this.setState({message:e.target.value})}/>
					{this.state.message ==='' ?(
						<span>
							<ThumbUp />
						</span>) : (
						<span>
							<Telegram />
						</span>
					)}
					<input type='file'  onChange={(e) => {
					this.docHandler(e);
					}} ref={this.refFl} style={{display: 'none'}}/>
				</div>
			</div>
		)
	}
}

export default index