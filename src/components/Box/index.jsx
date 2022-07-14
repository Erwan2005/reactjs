import React from 'react'
import {
	Videocam, Call, Close, AttachFile,
	EmojiEmotions, ThumbUp, Telegram
} from '@material-ui/icons';
import { toast } from 'react-toastify';
import socket from '../../Socket.js'
import User from '../../assets/user.svg'
import CallFriend from '../Call'
import './style.css'
export class index extends React.Component {
	constructor(props) {
		super(props);
		this.refFl = React.createRef();
		this.state = {
			message: '',
			doc_file: null,
			image: null,
			video: null,
			isCalling: false,
		}
		this.handleClose = this.handleClose.bind(this)
		this.calling = this.calling.bind(this)
	}

	docHandler = async (e) => {

		const reader = new FileReader();
		reader.onload = () => {
			if (reader.readyState === 2) {
				console.log('file readed')
			}
		}
		reader.readAsDataURL(e.target.files[0])
		const file = e.target.files[0];
		if (file.size > 20e6) {
			toast.error("Please upload a file smaller than 20 MB");
			return false;
		} else {
			if (file.type.split('/')[0] === 'image') {
				this.setState({ image: file })
			} else if (file.type.split('/')[0] === 'video') {
				this.setState({ video: file })
			} else {
				this.setState({ doc_file: file })
			}
		}
	};

	close = () => {
		this.props.handleClose()
	}
	call = () => {
		this.setState({ isCalling: !this.state.isCalling })
		this.calling()
	}
	handleClose = () => {
		this.setState({ isCalling: !this.state.isCalling })
	}

	calling = () => {
		this.props.call(this.props.idCall)
	}
	componentDidMount() {
		const textarea = document.querySelector("textarea");
		textarea.addEventListener("keyup", e => {
			textarea.style.height = '35px'
			let scHeight = e.target.scrollHeight;
			textarea.style.height = `${scHeight}px`
		})
	}
	render() {
		return (
			<div className="box-message">
				<div className="box-header">
					<div className="header-left">
						<img src={this.props.user.avatar ? this.props.user.avatar : User} alt="" />
						<div className="userInfo">
							<span>{this.props.user.username}</span>
							<small>Online</small>
						</div>
					</div>
					<div className="header-right">
						<span onClick={this.call}><Call /></span>
						<span><Videocam /></span>
						<span><Close onClick={this.close} /></span>
					</div>
				</div>
				<div className="box-middle">
					<div className='friend'>
						<img src="https://cdn.pixabay.com/photo/2022/06/27/07/22/woman-7286907_960_720.jpg" alt="" className='avatar' />
						<div className='ms-contents'>
							<span>Hello</span>
						</div>
					</div>
					<div className='me'>
						<div className='owner'>
							<div className='ms-contents'>
								max-width: 60%;
								display: flex;
								flex-direction: column;
							</div>
							<small>5min ago <ion-icon name="checkmark-done-outline"/></small>
						</div>
					</div>

					<div className='friend'>
						<img src="https://cdn.pixabay.com/photo/2022/06/27/07/22/woman-7286907_960_720.jpg" alt="" className='avatar' />
						<div className='ms-contents'>
							<span>Hello</span>
						</div>
					</div>
					<div className='me'>
						<div className='owner'>
							<div className='ms-contents'>
								max-width: 60%;
								display: flex;
								flex-direction: column;
							</div>
							<small>5min ago <ion-icon name="checkmark-done-outline"/></small>
						</div>
					</div>

					<div className='friend'>
						<img src="https://cdn.pixabay.com/photo/2022/06/27/07/22/woman-7286907_960_720.jpg" alt="" className='avatar' />
						<div className='ms-contents'>
							<span>Hello</span>
						</div>
					</div>
					<div className='me'>
						<div className='owner'>
							<div className='ms-contents'>
								max-width: 60%;
								display: flex;
								flex-direction: column;
							</div>
							<small>5min ago <ion-icon name="checkmark-done-outline"/></small>
						</div>
					</div>

					<div className='friend'>
						<img src="https://cdn.pixabay.com/photo/2022/06/27/07/22/woman-7286907_960_720.jpg" alt="" className='avatar' />
						<div className='ms-contents'>
							<span>Hello</span>
						</div>
					</div>
					<div className='me'>
						<div className='owner'>
							<div className='ms-contents'>
								max-width: 60%;
								display: flex;
								flex-direction: column;
							</div>
							<small>5min ago <ion-icon name="checkmark-done-outline"/></small>
						</div>
					</div>
				</div>
				<div className="box-footer">
					<span onClick={(event) => {
						event.preventDefault();
						this.refFl.current.click();
					}}><AttachFile /></span>
					<span><EmojiEmotions /></span>
					<textarea placeholder="Aa..."
						value={this.state.message}
						onChange={e => this.setState({ message: e.target.value })} />
					{this.state.message === '' ? (
						<span>
							<ThumbUp />
						</span>) : (
						<span>
							<Telegram />
						</span>
					)}
					<input type='file' onChange={(e) => {
						this.docHandler(e);
					}} ref={this.refFl} style={{ display: 'none' }} />
				</div>
				{this.state.isCalling &&
					<CallFriend handleClose={this.handleClose} currentVideo={this.props.currentVideo} friendVideo={this.props.friendVideo} />
				}
			</div>
		)
	}
}

export default index