import React from 'react'
import { useQuery } from "react-query";
import { connect } from "react-redux";
import { Route,Switch,withRouter,Link } from 'react-router-dom';
import { Home,People,List,Image,PlayCircleOutline,Settings,LocalMall,Forum,
        WbSunny,Menu,Search,Brightness4,Notifications,Mail,Person,ExitToApp,ArrowRight,
        ArrowLeft,Lock,Brightness2 } from '@material-ui/icons';
import { publicRequest,userRequest } from '../../requestMethods';

import Post from '../Post'
import './style.css'

function Query(props) {
  return (props.children(useQuery(props.keyName, props.fn, props.options)));
}
export class index extends React.Component {
	constructor(props){
		super(props);
		
		this.state={
			theme: '',
			profile:[],
			friends: [],
	    profiles: [],
	    user: [],
	    friend:{},
	    conversation: false,
	    messages: [],
	    private_message:[],
	    open: false,
	    checked: false,
		};
	}
	getCurrent = async() =>{
		let data;
		await userRequest.get(`userapp/users/${this.props.user.id}`).then((res) => (data = res.data))
		return data;
	}

	subMenu = () =>{
		let  menuBar = document.querySelector('.menu-bar')
		let  menuSettings = document.querySelector('.menu-settings')
		menuBar.style.marginLeft = "-250px";
		setTimeout(() =>{
			menuSettings.style.display = "block";
		}, 100)
	}

	submenuReturn = () =>{
		let  menuBar = document.querySelector('.menu-bar')
		let  menuSettings = document.querySelector('.menu-settings')

		menuBar.style.marginLeft = "0";
		menuSettings.style.display = "none";
	}

	  getCurrentUser = async() =>{
	    let data = await userRequest.get(`userapp/users/${this.props.user.id}/`)
	    .then(({data}) => data)
	    this.setState({profile: data})
	    if(this.state.profile.theme[0] == ''){
			  	if (this.defaultDark){
			  		this.setState({theme: 'dark', checked: true})
			  	}
			  }else{
			  	if(this.state.profile.theme[0] == "dark"){
				  	this.setState({theme: this.state.profile.theme[0], checked: true})	
				  }else {
				  	this.setState({theme: this.state.profile.theme[0], checked: false})
				  }
			  }
	  };

	  getProfile = async() =>{
			let data = await userRequest.get(`userapp/users/${this.props.match.params.id}`)
			.then(({data}) => data)
			this.setState({profile: data})
		}

	  getUser = async() =>{
	    let data = await userRequest.get('userapp/users/')
	    .then(({data}) => data)
	    this.setState({profiles: data})
	  };

	  getFriend = async() =>{
	    let data = await userRequest.get('userapp/friend/')
	    .then(({data}) => data)
	    this.setState({friends: data})
	  };

	  logout = () => {
	    localStorage.clear()
	    window.location.reload(false);
	  };

	  openBox = () =>{
	  	this.setState({open: !this.state.open})
	  }

	  componentDidMount(){
		  	
		  	this.getCurrentUser()
		  	this.getUser()
	    	this.getFriend()
	 };
	render() {
		return (
			<div className="cont-principal">
				<div className="topbars">
					<div className="toggles" onClick={this.props.styleElement}>
						<Menu className="themes"/>
					</div>
					<div className="searchs">
						<label>
							<input type="text" placeholder="Search ..."/>
							<span><Search /></span>
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
				          				return(
				          					<>
															<Person/>
															
																{events.friendRequests ? <span>{events.friendRequests}</span> : null}
															
														</>
				          				)
				          			}}
								</Query>
							</div>
						</div>
						<div className="topbarStyle">
							<Notifications className="icons" />
						</div>

						<div className="topbarStyle">
							<Mail/>
						</div>
						<div className="topbarStyle" onClick={this.openBox}>
							<img src={this.state.profile.avatar} alt="avatar" />
						</div>
					</div>
					{this.state.open && (
						<div className="wrapper">
							<ul className="menu-bar">
								<li>
									<div className="topbarStyle">
										<img src={this.state.profile.avatar} alt="avatar" />
									</div>
									<span>{this.state.profile.username}</span>
								</li>
								<li>
									<div className="with-submenu" onClick={this.subMenu}>
										<div className="topbarStyle">
											<Settings />
										</div>
										<span>Settings</span>
									</div>
									<ArrowRight className="right-menu"/>
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
											<div className="topbarStyle">
												<Person/>
											</div>
											<span>Personal info</span>
									</li>
									<li>
										<Link exact to='/setting/password' className="link">
											<div className="topbarStyle">
												<Lock />
											</div>
											<span>Password</span>
										</Link>
									</li>
									<li>
										<div>
											<input type="checkbox" className="checkbox" id="checkbox" defaultChecked={this.state.checked} onChange={this.changeTheme}/>
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
						<Post />
					</div>
					<div className="right-bar">
						<div className="right-top">top</div>
						<div className="right-bottom">bottom</div>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
});
export default connect(mapStateToProps,null)(withRouter(index))