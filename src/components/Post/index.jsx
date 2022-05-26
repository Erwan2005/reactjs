import React, { Component } from 'react'
import {
	Card, CardHeader, CardContent,
	CardActions, Collapse, CircularProgress
} from '@material-ui/core'
import { connect } from "react-redux"
import { withRouter } from "react-router"
import NumericLabel from 'react-pretty-numbers';
import { format } from 'timeago.js';
import _ from 'lodash';
import { userRequest } from '../../requestMethods'
import User from '../../assets/user.jpg'
import './style.css'
import { ThreeSixtyTwoTone } from '@material-ui/icons';
export class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			like: [],
			expanded: false,
			comment: '',
			comments: [],
		}
		this.handleSearch = this.handleSearch.bind(this)
	}
	handleExpandClick = (id) => {
		this.setState({ [`expanded_${id}`]: _.isUndefined(this.state[`expanded_${id}`]) ? true : !this.state[`expanded_${id}`] });
	};
	getLike = async () => {
		let data = await userRequest.get('userapp/like/')
			.then(({ data }) => data)
		this.setState({ like: data })
	};
	checkLiked = (userId, postId) => {
		if (this.state.like.filter(item => item.author === userId && item.post_connected === postId).length === 0)
			return false
		else return true
	};

	dlt = async (id) => {
		await userRequest.delete(`userapp/like/${id}`)
		this.getLike()
	};

	dltLike = (userId, postId) => {
		this.state.like.filter(item => item.author === userId && item.post_connected === postId).map(cheked => (this.dlt(cheked.id)))
	};


	postLike = async (author, post_connected) => {
		let data = await userRequest.post('userapp/like/', { author, post_connected })
			.then(({ data }) => data)
		this.setState({ like: this.state.like.concat(data) })
	};

	getCom = async () => {
		let data = await userRequest.get('userapp/comment/')
			.then(({ data }) => data)
		this.setState({ comments: data })
	};

	btnComment = async (content, id_post) => {
		let author = parseInt(this.props.user.id, 10)
		let post_connected = parseInt(id_post, 10)
		var contents = { content: content, author: author, post_connected: post_connected }
		let data = await userRequest.post('userapp/comment/', contents)
			.then(({ data }) => data)
		this.setState({ comments: [data].concat(this.state.comments) })
		this.setState({ comment: '' })

	};
	handleSearch = () => {
		this.props.handleSearch('publication')
	}
	componentDidMount() {
		this.getLike()
		this.getCom()
		this.handleSearch()
	};

	render() {
		return (
			<div className='post-container'>
				{this.props.publication && this.props.publication.map((pub, index) => {
					return (
						<Card className="card" key={pub.id}>
							<CardHeader
								className="cardHeader"
								avatar={
									<img src={pub.proprietary[0].avatar ? pub.proprietary[0].avatar : User} alt="" />
								}
								action={
									<div className="menu">

									</div>

								}
								title={
									<span><h3>{pub.proprietary[0].username}</h3></span>
								}
								subheader={<small>{format(pub.date)}</small>}
							/>
							{pub.image && <img src={pub.image} alt="" />}
							{pub.video && (
								<div><video src={pub.video} controls /></div>)}
							<CardContent>
								<h3>{pub.title}</h3>
								<h4>{pub.message}</h4>
							</CardContent>
							<CardActions className="card-action">
								<div className="item">
									{(this.checkLiked(this.props.user.id, pub.id)) ? (
										<span className='icon' onClick={() => this.dltLike(this.props.user.id, pub.id)}><ion-icon name="heart" /></span>
									) : (
										<span className='icon' onClick={() => this.postLike(this.props.user.id, pub.id)}><ion-icon name="heart-outline" /></span>
									)
									}
									<small className='text'><NumericLabel params={{ shortFormat: true, }}>{this.state.like.filter(item => item.post_connected === pub.id).length}</NumericLabel></small>
								</div>
								<div className="item">
									<span className='icon'
										onClick={() => this.handleExpandClick(pub.id)}
										aria-expanded={this.state[`expanded_${pub.id}`] || false}><ion-icon name="chatbubble-ellipses-outline" /></span>
									<small className='text'><NumericLabel params={{ shortFormat: true, }}>{this.state.comments.filter(item => item.post_connected === pub.id).length}</NumericLabel></small>
									<span className='icon'><ion-icon name="share-social-outline" /></span>
									<small className='text'>11k</small>
								</div>
							</CardActions>
							<Collapse in={this.state[`expanded_${pub.id}`] || false} timeout="auto" unmountOnExit>
								<CardContent>
									<div className='col-head'>
										<img src={this.props.user.avatar ? this.props.user.avatar : User} alt='' />
										<input type='text' value={this.state.comment} placeholder="What you thing?" onChange={e => this.setState({ comment: e.target.value })} />
										<span className='send'
											onClick={() => this.btnComment(this.state.comment, pub.id)}><ion-icon name="send-outline" /></span>
									</div>
									<div className='col-feet'>
										{this.state.comments && this.state.comments.map(com => {
											if (com.post_connected === pub.id) {
												return (
													<div className='comment' key={com.id}>
														<img src={com.commented[0].avatar ? com.commented[0].avatar : User} alt='' />
														<div className='text'>
															<span>{com.content}</span>
															<small>{format(com.date_posted)}</small>
														</div>
													</div>
												)
											} else return null
										})}
									</div>
								</CardContent>
							</Collapse>
						</Card>
					)
				})}
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	user: state.user.currentUser,
});
export default connect(mapStateToProps, null)(withRouter(index))