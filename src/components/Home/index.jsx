import React, { Component } from 'react'
import { connect } from "react-redux"
import Post from '../Post'
import Add from '../Add'
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import { themeUpdate } from "../../context/userRedux";
import { rmvPub, addPub } from "../../context/allRedux"
import { publicRequest, userRequest, parseRequest } from '../../requestMethods'
import { useQuery } from "react-query";
import Left from '../Left'
import Right from '../Right'
import Weather from '../Weather'
import Personal from '../Personal'
import Messenger from '../Messenger'
import Profile from '../Profile'
import socket from '../../Socket.js'
import Shop from '../shop/Drawer'
import Video from '../VideoList'
import Player from '../VideoPlayer'
import NavBar from '../NavaBar'
import PubPage from '../PubPage'
import getFormattedWeatherData from "../Weather/services/weatherService";
import { toast } from 'react-toastify'
import './style.css'

function Query(props) {
	return (props.children(useQuery(props.keyName, props.fn, props.options)));
}
function QueryPost(props) {
	return (props.children(useQuery(props.keyName, props.fn, {
		refetchInterval: 5000,
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: false
	})));
}
export class index extends Component {
	constructor(props) {
		super(props);
		this.defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		this.container = React.createRef();
		this.socket = React.createRef();
		this.state = {
			theme: '',
			menu1: false,
			menu2: false,
			menu3: false,
			menu4: false,
			publication: [],
			page: 2,
			more_exist: true,
			search: '',
			results: null,
			loading: false,
			engine: '',
			checked: false,
			request: false,
			requests: [],
			modal: false,
			friendReq: [],
			weather: null,
			weatherLoad: false,
			units: 'metric',
			query: {
				q: 'toamasina'
			},

		}

		this.handleToUpdate = this.handleToUpdate.bind(this);
		this.handleSearch = this.handleSearch.bind(this);


		this.postDelete = this.postDelete.bind(this);
		this.sendFriend = this.sendFriend.bind(this);
		this.theme = this.theme.bind(this);
		this.search = this.search.bind(this);
		this.locationWeather = this.locationWeather.bind(this);
		this.handleUnitsChange = this.handleUnitsChange.bind(this);
		this.getPub = this.getPub.bind(this);
	}
	handleToUpdate(data) {
		this.setState({ publication: [data].concat(this.state.publication) });
	}
	handleSearch(type) {
		this.setState({ engine: type })
	}
	activeMenu = () => { }
	getActiveMenu = (newMethod) => {
		this.activeMenu = newMethod;
	}
	postDelete = async (id) => {
		this.props.dispatchs(rmvPub(id))
		const new_data = this.state.publication.filter(pub => {
			if (pub.id === id) {
				return false
			}
			return true;
		})
		this.setState({ publication: new_data })
		let data = await userRequest.delete(`userapp/publication/${id}/`)
			.then(({ data }) => data)
		toast.success('Post deleted')
	}

	sendFriend = async (id) => {
		await userRequest.post('userapp/friendrequest/',
			({ sender: this.props.user.id, receiver: id })).then(res => {
				console.log(res)
			})
		socket.emit("friendRequest", {
			senderId: this.props.user.id,
			receiverId: id,
		})
	}

	getCurrent = async () => {
		if (this.props.user.theme === 'light') {
			this.setState({ theme: '', checked: false })
		} else {
			this.setState({ theme: 'dark', checked: true })
		}
	}

	openBox = (menu) => {
		if (menu === 'menu1') {
			this.setState({ menu1: !this.state.menu1, menu2: false, menu3: false, menu4: false })
		} else if (menu === 'menu2') {
			this.setState({ menu2: !this.state.menu2, menu1: false, menu3: false, menu4: false })
		} else if (menu === 'menu3') {
			this.setState({ menu3: !this.state.menu3, menu1: false, menu2: false, menu4: false })
		} else if (menu === 'menu4') {
			this.setState({ menu4: !this.state.menu4, menu1: false, menu2: false, menu3: false })
		}
	}


	getPub = async () => {
		try {
			this.setState({ loading: true })
			let data = await userRequest.get(`userapp/publication/?page=${this.state.page}`)
				.then(({ data }) => data)
			this.setState({ publication: this.state.publication.concat(data.results), loading: false })
			data.results.map(pub => {
				this.props.dispatchs(addPub(pub))
			})
			if (data.next) {
				this.setState({ page: this.state.page + 1 })
			} else {
				this.setState({ more_exist: false, end: true })
			}

		} catch (error) {
			console.log(error)
		}
	};

	search = async (query) => {
		this.setState({ search: query, loading: true });
		if (this.state.engine === 'publication') {
			let data = await userRequest.get(`userapp/publication/?search=${query}`)
				.then(({ data }) => data)
			this.setState({ results: data.results, loading: false })
		} else if (this.state.engine === 'product') {
			let data = await userRequest.get(`shop/product/?search=${query}`)
				.then(({ data }) => data)
			this.setState({ results: data.results, loading: false })
		} else if (this.state.engine === 'weather') {
			this.setState({ query: { q: query } }, () => {
				fetchWeather();
			});
			const fetchWeather = async () => {
				this.setState({ weatherLoad: true })
				const units = this.state.units
				await getFormattedWeatherData({ ...this.state.query, units }).then((data) => {

					this.setState({ results: data });
				});
				this.setState({ weatherLoad: false })
			};
		}
	}
	theme = async () => {
		let theme = ''
		let formData = new FormData();
		if (this.state.theme !== '') {
			theme = 'light'
			formData.append("color", theme)
			this.props.dispatchs(themeUpdate(theme))
			this.setState({ theme: '', checked: false })
			let data = await publicRequest.patch(`userapp/users/${this.props.user.id}/`, formData).then(({ data }) => data)
		} else {
			theme = 'dark'
			formData.append("color", theme)
			this.props.dispatchs(themeUpdate(theme))
			this.setState({ theme: 'dark', checked: true })
			let data = await publicRequest.patch(`userapp/users/${this.props.user.id}/`, formData).then(({ data }) => data)
		}
	}
	handleClickOutside = () => {
		if (this.state.menu1 || this.state.menu2 || this.state.menu3 || this.state.menu4) {
			this.setState({ menu1: false, menu2: false, menu3: false, menu4: false })
		}
	};
	getCurrentUser = async () => {
		let data = await userRequest.get(`userapp/users/${this.props.user.id}/`)
			.then(({ data }) => data)

		if (data.friendRequests !== 0) {
			this.setState({ request: true })
		} else {
			this.setState({ request: false })
		}
		return data;
	};

	getRequest = async () => {
		let data = await userRequest.get(`userapp/friendrequest/`)
			.then(({ data }) => data)
		this.setState({ requests: data })
		socket.emit("addUser", this.props.user.id);
		socket.on("getUsers", (users) => {
			this.setState({ onlineUser: users })
		});
		socket.on("getRequest", (data) => {
			this.setState({ friendReq: [data].concat(this.state.friendReq) })
		})

	}

	dltRequest = async (id) => {
		let new_data = this.state.requests.filter(req => {
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
		let new_data = this.state.requests.filter(req => {
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

	locationWeather = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				let lat = position.coords.latitude;
				let lon = position.coords.longitude;

				this.setState({
					query: {
						lat,
						lon,
					}
				}, () => {
					fetchWeather()
				});
			});
		}
		const fetchWeather = async () => {
			this.setState({ weatherLoad: true, search: '' })
			const units = this.state.units
			await getFormattedWeatherData({ ...this.state.query, units }).then((data) => {

				this.setState({ weather: data });
			});
			this.setState({ weatherLoad: false })
		};


	};

	handleUnitsChange = async (unit) => {
		this.setState({ units: unit }, () => {
			fetchWeather()
		})
		const fetchWeather = async () => {
			this.setState({ weatherLoad: true })
			const units = this.state.units
			await getFormattedWeatherData({ ...this.state.query, units }).then((data) => {

				this.setState({ weather: data });
			});
			this.setState({ weatherLoad: false })
		};

	};

	componentDidMount() {
		this.getCurrent()
		this.getRequest()
		window.addEventListener('scroll', () => {
			if (window.scrollY + window.innerHeight >=
				document.documentElement.scrollHeight) {
				if (this.state.engine === 'publication') {
					if (this.state.more_exist) {
						this.getPub();
					}
				}
			}
		});
		console.log(this.props.user)
	};
	render() {
		return (
			<div className='home-container' data-theme={this.state.theme}>
				<NavBar theme={this.theme} search={this.search} />
				<main>
					<Left getActiveMenu={this.getActiveMenu} />
					<Switch>
						<div className='central'>
							<Route exact path='/'>
								<Add publication={this.handleToUpdate} />
								<Post publication={this.state.search === '' ? this.props.publication : this.state.results} handleSearch={this.handleSearch}
									postDelete={this.postDelete}  loading={this.props.loading}/>

							</Route>
							<Route path='/shop'>
								<Shop results={this.state.results} search={this.state.search} handleSearch={this.handleSearch} />
							</Route>
							<Route path='/weather'>
								<Weather weather={this.state.search === '' ? this.state.weather : this.state.results} loading={this.state.weatherLoad}
									locationWeather={this.locationWeather} handleUnitsChange={this.handleUnitsChange} handleSearch={this.handleSearch} />
							</Route>
							<Route path={`/messenger`}>
								<Messenger />
							</Route>
							<Route path={`/personnal`}>
								<Personal />
							</Route>
							<Route path={'/video'}>
								<Video />
							</Route>
							<Route path={'/player'}>
								<Player />
							</Route>
							<Route path='/profile/:id'>
								<Profile sendFriend={this.sendFriend} />
							</Route>
							<Route path='/publication/:id'>
								<PubPage />
							</Route>
						</div>
					</Switch>
					<Right />
				</main>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	user: state.user.currentUser,
	publication: state.all.publications,
	users: state.all.users,
});
const mapDispatchToProps = (dispatch) => ({
	dispatchs: dispatch,
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(index))