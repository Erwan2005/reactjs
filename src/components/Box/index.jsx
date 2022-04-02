import React from 'react'
import { Videocam,Call,Close,AttachFile,EmojiEmotions,ThumbUp } from '@material-ui/icons';
import './style.css'
export class index extends React.Component {
	constructor(props){
		super(props);
	}

	close = () =>{
		this.props.handleClose()
	}
	render() {
		return (
			<div className="box-message">
				<div className="box-header">
					<div className="header-left">
						<img src="https://cdn.pixabay.com/photo/2022/03/25/17/54/sakura-7091532_960_720.jpg" alt="" />
						<div className="userInfo">
							<span>Erwan</span>
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
					<span><AttachFile /></span>
					<span><EmojiEmotions /></span>
					<textarea placeholder="Enter your message ..." />
					<span><ThumbUp /></span>
				</div>
			</div>
		)
	}
}

export default index