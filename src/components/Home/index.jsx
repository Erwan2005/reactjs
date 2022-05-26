import React, { Component } from 'react'
import { connect } from "react-redux"
import Post from '../Post'
import Add from '../Add'
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import { publicRequest, userRequest, BASE_URL, parseRequest } from '../../requestMethods'
import User from '../../assets/user.jpg'
import Left from '../Left'
import Right from '../Right'
import Weather from '../Weather'
import Personal from '../Personal';
import Shop from '../shop/Drawer';
import './style.css'
import { FormatListNumberedRtlTwoTone } from '@material-ui/icons'
export class index extends Component {
	constructor(props) {
		super(props);
		this.defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
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
		}
		this.handleToUpdate = this.handleToUpdate.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
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
			let data = await publicRequest.patch(`userapp/users/${this.props.user.id}/`, formData).then(({ data }) => data)
			this.setState({ theme: '', checked: FormatListNumberedRtlTwoTone })
		} else {
			theme = 'dark'
			formData.append("color", theme)
			let data = await publicRequest.patch(`userapp/users/${this.props.user.id}/`, formData).then(({ data }) => data)
			this.setState({ theme: 'dark', checked: true })
		}
	}
	componentDidMount() {

		this.getCurrent()
		this.getPub()
	};
	render() {
		return (
			<div className='home-container' data-theme={this.state.theme}>
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
						<div>
							<input type="checkbox" className="checkbox" id="checkbox" defaultChecked={this.state.checked} onChange={this.theme} />
							<label htmlFor="checkbox" className="label" >
								<small>&#9788;</small>
								<small>&#9790;</small>
								<div className="ball"></div>
							</label>
						</div>
						<span className='icon nav-icon' onClick={() => this.openBox('menu4')}><ion-icon name="person-outline" /><small>9+</small></span>
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
									<div className='flex-box'>
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
									</div>
								</div>
							</div>}
					</div>

				</nav>
				<main>
					<Left getActiveMenu={this.getActiveMenu} />
					<Switch>
						<div className='central'>
							<Route exact path='/'>
								<Add publication={this.handleToUpdate} />
								<Post publication={this.state.search === '' ? this.state.publication : this.state.results} handleSearch={this.handleSearch} />
							</Route>
							<Route path='/shop'>
								<Shop results={this.state.results} search={this.state.search} handleSearch={this.handleSearch} />
							</Route>
							<Route path='/weather'>
								<Weather />
							</Route>
							<Route path={`/personnal`}>
								<Personal />
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
export default connect(mapStateToProps, null)(withRouter(index))