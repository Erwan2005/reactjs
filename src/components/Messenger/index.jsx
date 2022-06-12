import React from 'react'
import {
	Search, Image, EmojiEmotions, AttachFile,
	ThumbUp, Telegram, Videocam, Call, MoreVert,
	Menu, Notifications
} from '@material-ui/icons';
import { toast } from 'react-toastify';
import { connect } from "react-redux";
import ScrollToBottom from 'react-scroll-to-bottom';
import { CircularProgress } from '@material-ui/core';
import { Route, Switch, withRouter, Link } from 'react-router-dom';
import { publicRequest, userRequest, parseRequest } from '../../requestMethods';
import _ from 'lodash';
import './style.css'
export class index extends React.Component {
	constructor(props) {
		super(props);
		this.refImg = React.createRef();
		this.refFl = React.createRef();
		this.socket = React.createRef();
		this.state = {
			message: '',
			messages: [],
			chosenEmoji: null,
			open: false,
			last_message: {},
			doc_file: null,
			image: null,
			video: null,
			sending: false,
			friend: [],
			profile: [],
			currentUser: {},
			conversation: false,
		};
	}

	getProfile = async () => {
		let data = await userRequest.get('userapp/users/')
			.then(({ data }) => data)
		this.setState({ profile: data })
	}

	getCurrent = async () => {
		let data = await userRequest.get(`userapp/users/${this.props.user.id}`)
			.then(({ data }) => data)
		this.setState({ currentUser: data })
	}

	docHandler = async (e) => {

		const reader = new FileReader();
		reader.onload = () => {
			if (reader.readyState === 2) {
				//this.setState({image:reader.result})
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

	sendMessage = async () => {
		if (this.state.video !== null) {
			let formData = new FormData();
			formData.append("sender", this.props.user.id);
			formData.append("receiver", this.state.friend[0]);
			formData.append("content", this.state.message);
			formData.append(
				"video",
				this.state.video,
				this.state.video.name
			);
			let data = await parseRequest.post('userapp/message/', formData)
				.then(({ data }) => data)
			this.setState({ message: '', sending: false, image: '', doc_file: '', private_message: this.state.private_message.concat(data) })
		} else if (this.state.image !== null) {
			let formData = new FormData();
			formData.append("sender", this.props.user.id);
			formData.append("receiver", this.state.friend[0]);
			formData.append("content", this.state.message);
			formData.append(
				"img",
				this.state.image,
				this.state.image.name
			);
			let data = await parseRequest.post('userapp/message/', formData)
				.then(({ data }) => data)
			this.setState({ message: '', sending: false, image: '', doc_file: '', private_message: this.state.private_message.concat(data) })
		} else if (this.state.doc_file !== null) {
			let formData = new FormData();
			formData.append("sender", this.props.user.id);
			formData.append("receiver", this.state.friend[0]);
			formData.append("content", this.state.message);
			formData.append(
				"files",
				this.state.doc_file,
				this.state.doc_file.name
			);
			let data = await parseRequest.post('userapp/message/', formData)
				.then(({ data }) => data)
			this.setState({ message: '', sending: false, image: '', doc_file: '', private_message: this.state.private_message.concat(data) })
		} else {
			let formData = new FormData();
			formData.append("sender", this.props.user.id);
			formData.append("receiver", this.state.friend[0]);
			formData.append("content", this.state.message);
			let data = await parseRequest.post('userapp/message/', formData)
				.then(({ data }) => data)
			this.setState({ message: '', sending: false, image: '', doc_file: '', private_message: this.state.private_message.concat(data) })
		}
	}

	getMessage = async (id, username, avatar) => {
		this.setState({ private_message: [] })
		this.setState({ conversation: true })
		let data = await userRequest.get('userapp/message')
			.then(({ data }) => data)
		this.setState({ messages: _.sortBy(data.results, "id") })
		await this.setState({ friend: [id, username, avatar] })
		console.log(this.state.onlineUser)
		this.setState({ receiver: id })
		//await this.state.messages.filter(item=> (item.sender === parseInt(id, 10) && item.receiver=== parseInt(this.id, 10)) || (item.receiver === parseInt(id, 10) && item.sender=== parseInt(this.id, 10))).map(checked=>(this.setState({private_message:checked})))
		await this.state.messages && this.state.messages.map((item) => {
			if ((item.sender === parseInt(id, 10) && item.receiver === parseInt(this.props.user.id, 10)) || (item.receiver === parseInt(id, 10) && item.sender === parseInt(this.props.user.id, 10))) {
				this.setState({ private_message: this.state.private_message.concat(item) })
			}
		})
	};

	componentDidMount() {
		this.getProfile()
		this.getCurrent()

	};
	render() {
		return (
			<div className="messenger">
				<div className='top'>
					<span className='avatar'>
						<img src='https://cdn.pixabay.com/photo/2021/12/04/04/44/woman-6844349_960_720.jpg' alt='' />
						<small></small>
					</span>

				</div>
				<div className='bottom'>
					<div className='header'>
						<div className='left'>
							<img src='https://cdn.pixabay.com/photo/2021/12/04/04/44/woman-6844349_960_720.jpg' alt='' />
							<span>Erwan</span>
						</div>
						<div className='right'>
							<span className='ms-icon'><ion-icon name="call-outline" /></span>
							<span className='ms-icon'><ion-icon name="videocam-outline" /></span>
						</div>
					</div>
					<div className='contents'>
						<div className='friend-ms'>
							<div className='friand-avatar'>
								<img src='https://cdn.pixabay.com/photo/2021/12/04/04/44/woman-6844349_960_720.jpg' alt='' />
							</div>
							<div className='chat-friend'>
								<div className='contents-flex'>
									<span>Message text</span>
									<img src='https://cdn.pixabay.com/photo/2021/12/04/04/44/woman-6844349_960_720.jpg' alt='' />
								</div>
								<small className='timestamp'>11h10</small>
							</div>
						</div>
						<div className='owner-ms'>
							<di className='owner-chat'>
								<div className='contents-flex'>
									<span>Message text</span>
									<img src='https://cdn.pixabay.com/photo/2021/12/04/04/44/woman-6844349_960_720.jpg' alt='' />
								</div>
								<small className='timestamp'>11h15</small>
							</di>
						</div>
					</div>
					<div className='bot'>
						<span className='ms-icon'><ion-icon name="attach-outline" /></span>
						<span className='ms-icon'><ion-icon name="happy-outline" /></span>
						<textarea placeholder='Text ...' />
						<span className='ms-icon'><ion-icon name="thumbs-up-outline" /></span>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	user: state.user.currentUser,
});
export default connect(mapStateToProps, null)(withRouter(index))