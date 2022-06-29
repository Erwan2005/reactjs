import React from 'react'
import { connect } from "react-redux";
import { Route, Switch, withRouter, NavLink } from 'react-router-dom';
import { userRequest } from '../../requestMethods';
import BoxMessage from '../Box'
import Post from '../Post'
import { useQuery } from "react-query";
import socket from '../../Socket.js'
import './style.css'

function Query(props) {
	return props.children(useQuery(props.keyName, props.fn, props.options));
}

export class index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			friends: [],
			friend: {},
			box: false,
			publication: [],
			page: 1,
			more_exist: false,
			end: false,
		};
		this.handleClose = this.handleClose.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.sendRequest = this.sendRequest.bind(this);
	};
	handleSearch(type) {
		console.log(type)
	}
	handleOpen = () => {
		this.setState({ box: !this.state.box })
	}

	handleClose = () => {
		this.setState({ box: !this.state.box })
	}

	getFriends = async () => {
		let data = await userRequest.get(`userapp/users/${this.props.match.params.id}`).then(({ data }) => data)
		this.setState({ friend: data })
	}
	getFriend = async () => {
		let data = await userRequest.get('userapp/friend/')
			.then(({ data }) => data)
		this.setState({ friends: data })
	}

	checkFriend = (friendId) => {
		if (this.state.friends.filter(item => item.user === this.props.user.id && item.friend === this.props.match.params.id).length === 0)
			return false
		else return true
	};

	sendRequest = () => {
		this.props.sendFriend(this.props.match.params.id)
	};

	redirect = () => {
		if (this.props.match.params.id == this.props.user.id) {
			this.props.history.push('/personnal')
		}
		if (this.props.user == null){
			this.props.history.push('/')
		}
	}

	getPub = async () => {
		try {
			this.setState({ loading: true })
			let data = await userRequest.get(`userapp/publication/?page=${this.state.page}`)
				.then(({ data }) => data)
			if (data.next) {
				this.setState({ page: this.state.page + 1 })
			} else {
				this.setState({ more_exist: false, end: true })
			}
			data.results && data.results.map((pub, index) => {
				if (pub.user == this.props.match.params.id) {
					this.setState({ publication: this.state.publication.concat(pub) })
					console.log(this.state.publication)
				}
			})

		} catch (error) {
			console.log(error)
		}


	}
	componentDidMount() {
		this.redirect()
		this.getFriend()
		this.getFriends()
		this.getPub()

	};
	render() {
		return (
			<div className="profiles">
				<div className='top'>
					<div className='mur'>
						<img src={this.state.friend.img_covert} alt='' />
					</div>
					<div className='avatar'>
						<img src={this.state.friend.avatar} alt='' />
					</div>
					<div className='action'>

						<div className='right'>
							<span onClick={this.handleOpen}><ion-icon name="mail-outline" /></span>
							<span onClick={this.sendRequest}><ion-icon name="person-add-outline" /></span>
						</div>
						<div className='left'>
							<ul>
								<li>
									<NavLink to={this.props.match.url} className={({ isActive }) => (isActive ? 'link active' : 'link')}>
										Publication
									</NavLink>
								</li>
								<li>Image</li>
								<li>Video</li>
								<li>Page</li>
								<li>Group</li>
							</ul>
						</div>
					</div>
				</div>
				<div className='contents'>
					<div className='left'>
						<span className='about'>{this.state.friend.about_me}</span>
					</div>
					<div className='right'>
						<Switch>
							<Route path='/'>
								<Post publication={this.state.publication} handleSearch={this.handleSearch} />
							</Route>
						</Switch>
					</div>
				</div>
				{this.state.box &&
					<BoxMessage handleClose={this.handleClose} user={this.state.friend}/>}
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	user: state.user.currentUser,
});
export default connect(mapStateToProps, null)(withRouter(index))