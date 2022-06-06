import React, { Component } from 'react'
import { connect } from "react-redux"
import Post from '../Post'
import Add from '../Add'
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import { themeUpdate } from "../../context/userRedux";
import { publicRequest, userRequest, parseRequest } from '../../requestMethods'
import { useQuery } from "react-query";
import User from '../../assets/user.jpg'
import Left from '../Left'
import Right from '../Right'
import Weather from '../Weather'
import Personal from '../Personal'
import Modal from '../Modal'
import Shop from '../shop/Drawer'
import { toast } from 'react-toastify'
import './style.css'
import { FormatListNumberedRtlTwoTone } from '@material-ui/icons'
import { light } from '@material-ui/core/styles/createPalette'

function Query(props) {
	return (props.children(useQuery(props.keyName, props.fn, props.options)));
}
export class index extends Component {
	constructor(props) {
		super(props);
		this.defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		this.container = React.createRef();

		this.state = {
			theme: '',
			menu1: false,
			menu2: false,
			menu3: false,
			menu4: false,
			publication: [],
			page: 1,
			search: '',
			results: [],
			loading: '',
			engine: '',
			checked: false,
			request: false,
			modal : false,	
		}
		this.handleToUpdate = this.handleToUpdate.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.openModal = this.openModal.bind(this);
		this.postDelete = this.postDelete.bind(this);
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
	postDelete = async (id)=>{
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
	logout = () => {
		this.setState({ menu1: !this.state.menu1 })
		localStorage.clear()
		window.location.reload(false);
		this.props.navigate('/')
	};

	getPub = async () => {
		try {
			this.setState({ loading: true })
			let data = await userRequest.get(`userapp/publication/?page=${this.state.page}`)
				.then(({ data }) => data)
			this.setState({ publication: this.state.publication.concat(data.results), loading: false })
			if (data.next) {
				this.setState({ page: this.state.page + 1 })
			} else {
				this.setState({ more_exist: false, end: true })
			}

		} catch (error) {
			window.location.reload(true);
		}

	};

	search = async (e) => {
		this.setState({ search: e.target.value, loading: true });
		if (this.state.engine === 'publication') {
			let data = await userRequest.get(`userapp/publication/?search=${e.target.value}`)
				.then(({ data }) => data)
			this.setState({ results: data.results, loading: false })
		} else if (this.state.engine === 'product') {
			let data = await userRequest.get(`shop/product/?search=${e.target.value}`)
				.then(({ data }) => data)
			this.setState({ results: data.results, loading: false })
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
	};
	openModal = () => {
		this.setState({ modal: !this.state.modal })
	}

	handleClose = () => {
		this.setState({ modal: !this.state.modal })
	}
	componentDidMount() {
		this.getCurrent()
		this.getPub()
	};
	render() {
		return (
			<div onClick={this.handleClickOutside} className='home-container' data-theme={this.state.theme}>
				<nav>
					<span className='logo'>WanTech</span>
					<span className='menu' onClick={this.activeMenu}><ion-icon name="menu-outline" /></span>
					<label>
						<input type='text' placeholder='Search ...'
							value={this.state.search}
							onChange={this.search} />
						<span className='icon'><ion-icon name="search-outline" /></span>
					</label>
					<div className='nav-right'>
						{this.state.checked ? <span className='icon' onClick={this.theme}><ion-icon name="sunny-outline" /></span> :
							<span className='icon' onClick={this.theme}><ion-icon name="moon-outline" /></span>
						}

						<span className='icon nav-icon' onClick={() => this.openBox('menu4')}><ion-icon name="person-outline" />
							<Query
								keyName="users"
								fn={() => this.getCurrentUser()}
							>
								{({ data, isLoading, error }) => {
									if (error) return <h1>Error</h1>;
									const events = data ?? []
									return (
										<>

											{events.friendRequests ? <small>{events.friendRequests > 9 ? '9+' : events.friendRequests}</small> : null}
										</>
									)
								}}
							</Query>
						</span>
						<span className='icon nav-icon' onClick={() => this.openBox('menu3')}><ion-icon name="notifications-outline" /><small>9+</small></span>
						<span className='icon nav-icon' onClick={() => this.openBox('menu2')}><ion-icon name="chatbubble-outline" /><small>9+</small></span>
						<img src={this.props.user.avatar ? this.props.user.avatar : User} alt='' onClick={() => this.openBox('menu1')} />
						{this.state.menu1 &&
							<div className='menu1'>
								<div className='menu-container'>
									<div className='flex-box'>
										<Link exact to='/personnal' className="link">
											<img src={this.props.user.avatar ? this.props.user.avatar : User} alt='' />
											<span>{this.props.user.username}</span>
										</Link>
									</div>
									<div className='flex-box' onClick={this.openModal}>
										<span className='icon'><ion-icon name="key-outline" /></span>
										<span>Change password</span>
									</div>
									<div className='flex-box' onClick={this.logout}>
										<span className='icon'><ion-icon name="log-out-outline" /></span>
										<span>Logout</span>
									</div>
								</div>
							</div>}
						{this.state.menu2 &&
							<div className='menu2'>
								<div className='menu-container2'>
									<div className='flex-box nav-mes'>
										<img src={this.props.user.avatar} alt='' />
										<div className='nav-text'>
											<span>{this.props.user.username}</span>
											<small>Ceci est un message le plus longue au monde jusqu'ici</small>
										</div>

									</div>

									<div className='flex-box nav-mes'>
										<img src={this.props.user.avatar} alt='' />
										<div className='nav-text'>
											<span>{this.props.user.username}</span>
											<small>Ceci est un message le plus longue au monde jusqu'ici
												et n'a jamais été battu
											</small>
										</div>

									</div>

								</div>
							</div>}
						{this.state.menu3 &&
							<div className='menu3'>
								<div className='menu-container3'>
									<div className='flex-box nav-mes'>
										<img src={this.props.user.avatar} alt='' />
										<div className='nav-text'>
											<span>{this.props.user.username}</span>
											<small>Partage une video</small>
										</div>
									</div>
								</div>
							</div>}
						{this.state.menu4 &&
							<div className='menu4'>
								<div className='menu-container4'>
									{this.state.request ? 
										<div className='flex-box nav-mes'>
											<img src={this.props.user.avatar} alt='' />
											<div className='nav-text'>
												<span>{this.props.user.username}</span>
												<small>11k friend</small>
												<div className='nav-button'>
													<span><ion-icon name="checkmark-outline" /></span>
													<span><ion-icon name="close-outline" /></span>
												</div>
											</div>
										</div> : <small>No request</small>
									}

								</div>
							</div>}
					</div>

				</nav>
				{this.state.modal &&
					<Modal handleClose={this.handleClose} />}
				<main>
					<Left getActiveMenu={this.getActiveMenu} />
					<Switch>
						<div className='central'>
							<Route exact path='/'>
								<Add publication={this.handleToUpdate} />
								<Post publication={this.state.search === '' ? this.state.publication : this.state.results} handleSearch={this.handleSearch} 
								postDelete ={this.postDelete}/>
							</Route>
							<Route path='/shop'>
								<Shop results={this.state.results} search={this.state.search} handleSearch={this.handleSearch} />
							</Route>
							<Route path='/weather'>
								<Weather />
							</Route>
							<Route path={`/personnal`}>
								<Personal/>
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
});
const mapDispatchToProps = (dispatch) => ({
	dispatchs: dispatch,
  });
  export default connect(mapStateToProps, mapDispatchToProps)(withRouter(index))