import React from 'react'
import { useQuery } from "react-query";
import { connect } from "react-redux";
import { CircularProgress } from '@material-ui/core';
import { Route, Switch, withRouter, Link } from 'react-router-dom';
import {
	Settings, Menu, Search, Notifications, Mail, Person, ExitToApp, ArrowRight,
	ArrowLeft, Lock
} from '@material-ui/icons';
import { publicRequest, userRequest } from '../../requestMethods';
import BoxMessage from '../Box'
import Post from '../Post'
import { toast } from 'react-toastify';
import './style.css'

function Query(props) {
	return (props.children(useQuery(props.keyName, props.fn, props.options)));
}
export class index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			theme: '',
			profile: [],
			request: [],
			profiles: [],
			user: [],
			friend: {},
			conversation: false,
			messages: [],
			private_message: [],
			open: false,
			checked: false,
			box: false,
			search: '',
			results: [],
			loading: false,
		};
		this.handleClose = this.handleClose.bind(this);
	}

	handleOpen = () => {
		this.setState({ box: !this.state.box })
	}

	handleClose = () => {
		this.setState({ box: !this.state.box })
	}

	getCurrent = async () => {
		let data;
		await userRequest.get(`userapp/users/${this.props.user.id}`).then((res) => (data = res.data))
		return data;
	}

	subMenu = () => {
		let menuBar = document.querySelector('.menu-bar')
		let menuSettings = document.querySelector('.menu-settings')
		menuBar.style.marginLeft = "-250px";
		setTimeout(() => {
			menuSettings.style.display = "block";
		}, 100)
	}

	submenuReturn = () => {
		let menuBar = document.querySelector('.menu-bar')
		let menuSettings = document.querySelector('.menu-settings')

		menuBar.style.marginLeft = "0";
		menuSettings.style.display = "none";
	}

	getCurrentUser = async () => {
		let data = await userRequest.get(`userapp/users/${this.props.user.id}/`)
			.then(({ data }) => data)
		this.setState({ profile: data })
	};

	getUser = async () => {
		let data = await userRequest.get('userapp/users/')
			.then(({ data }) => data)
		this.setState({ profiles: data })
	};

	getRequest = async () => {
		let data = await userRequest.get('userapp/friendrequest/')
			.then(({ data }) => data)
		this.setState({ request: data })
	};

	logout = () => {
		localStorage.clear()
		window.location.reload(false);
	};

	openBox = () => {
		this.setState({ open: !this.state.open })
	}

	dltRequest = async (id) => {
		let new_data = this.state.request.filter(req => {
			if (req.id === id) {
				return false
			}
			return true;
		})
		this.setState({ request: new_data })

		let data = await userRequest.delete(`userapp/friendrequest/${id}`)
			.then(({ data }) => data)
		toast.warning('Request denied')
	};

	addFriend = async (friend, id) => {
		let new_data = this.state.request.filter(req => {
			if (req.id === id) {
				return false
			}
			return true;
		})
		this.setState({ request: new_data })
		await userRequest.post('userapp/friend/', { user: this.props.user.id, friend: friend }).then(resp => (console.log(resp)));
		await userRequest.post('userapp/friend/', { user: friend, friend: this.props.user.id }).then(resp => (console.log(resp)));
		await userRequest.delete(`userapp/friendrequest/${id}`).then(resp => (console.log(resp)));
		toast.info('Request accepted')
	}
	openModal = () => {
		this.props.openModal()
		this.setState({ open: !this.state.open })
	}

	search = async (e) => {
		this.setState({ search: e.target.value, loading: true });
		let data = await userRequest.get(`userapp/publication/?search=${e.target.value}`)
			.then(({ data }) => data)
		this.setState({ results: data.results, loading: false })
	}

	componentDidMount() {
		this.getCurrentUser()
		this.getUser()
		this.getRequest()
	};
	render() {
		return (
			<div className="cont-principal">
				<div className="topbars">
					<div className="toggles" onClick={this.props.styleElement}>
						<span className="icon"><ion-icon name="menu-outline" /></span>
					</div>
					<div className="searchs">
						<label>
							<input type="text" placeholder="Search ..."
								value={this.state.search}
								onChange={this.search} />
							<span className='s1'><Search /></span>
							{this.state.loading &&
								<span className='s2'><CircularProgress color="gray" size="15px" /></span>}
						</label>
					</div>
					<div className="main-right">
						<div className="badge">
							<div className="topbarStyle">
								<Query
									keyName="users"
									fn={() => this.getCurrent()}
								>
									{({ data, isLoading, error }) => {
										if (error) return <h1>Error</h1>;
										const events = data ?? []
										return (
											<>
												<ion-icon name="person-outline"></ion-icon>
												{events.friendRequests ? <span>{events.friendRequests}</span> : null}
											</>
										)
									}}
								</Query>
							</div>
						</div>
						<div className="topbarStyle">
							<span className="icons" ><ion-icon name="notifications-outline"></ion-icon></span>
						</div>

						<div className="topbarStyle">
							<ion-icon name="chatbubbles-outline"></ion-icon>
						</div>
						<div className="topbarStyle" onClick={this.openBox}>
							<img src={this.props.user.avatar} alt="avatar" />
						</div>
					</div>
					{this.state.open && (
						<div className="wrapper">
							<ul className="menu-bar">
								<li>
									<div className="topbarStyle">
										<img src={this.props.user.avatar} alt="avatar" />
									</div>
									<span>{this.props.user.username}</span>
								</li>
								<li>
									<div className="with-submenu" onClick={this.subMenu}>
										<div className="topbarStyle">
											<Settings />
										</div>
										<span>Settings</span>
									</div>
									<ArrowRight className="right-menu" />
								</li>
								<li onClick={this.logout}>
									<div className="topbarStyle">
										<ExitToApp />
									</div>
									<span>Logout</span>
								</li>
							</ul>

							<ul className="menu-settings">
								<li onClick={this.submenuReturn}><ArrowLeft /><span>Settings</span></li>
								<li>
									<Link exact to='/setting/personnal' className="link">
										<div className="topbarStyle">
											<Person />
										</div>
										<span>Personal info</span>
									</Link>
								</li>
								<li onClick={this.openModal}>
									<div className="topbarStyle">
										<Lock />
									</div>
									<span>Password</span>
								</li>
								<li>
									<div>
										<input type="checkbox" className="checkbox" id="checkbox" defaultChecked={this.state.checked} onChange={this.changeTheme} />
										<label htmlFor="checkbox" className="label" >
											<span>&#9788;</span>
											<span>&#9790;</span>
											<div className="ball"></div>
										</label>
									</div>
								</li>
							</ul>
						</div>)}
				</div>
				<div className="central">
					<div className="posts">
						<Post search={this.state.search} results={this.state.results} />
					</div>
					<div className="right-bar">
						<div className="right-top">
							<div className="headers">
								<span>Friend request</span>
								<span>See all</span>
							</div>
							<div className="corp">
								{this.state.request && this.state.request.map(req => {
									return (
										<>
											{this.state.profiles && this.state.profiles.map(profile => {
												if (req.sender === profile.id && req.receiver === this.props.user.id) {
													return (
														<div className="requested">
															<div className="top">
																<img src={profile.avatar} alt="avatar" />
																<div className="text">
																	<span>{profile.username}</span>
																	<small>11k friends</small>
																</div>
															</div>
															<div className="bottom">
																<button onClick={() => this.addFriend(profile.id, req.id)}>Confirm</button>
																<button onClick={() => this.dltRequest(req.id)}>Delete</button>
															</div>
														</div>
													)
												} else return null
											})}
										</>
									)
								})}

							</div>
						</div>
						<div className="right-bottom">
							<div className="headers">
								<span>Online friends</span>
								<span>See all</span>
							</div>
							<div className="corp">
								<div className="friend" onClick={this.handleOpen}>
									<div className="avatar">
										<img src="https://cdn.pixabay.com/photo/2022/02/24/15/17/cat-7032641_960_720.jpg" alt="avatar" />
										<span></span>
									</div>
									<span>Erwan</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				{this.state.box &&
					<BoxMessage handleClose={this.handleClose} />}
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	user: state.user.currentUser,
});
export default connect(mapStateToProps, null)(withRouter(index))