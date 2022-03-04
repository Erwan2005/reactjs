import React from 'react'
import { Home,People,List,Image,PlayCircleOutline,Settings,LocalMall,Forum,
        WbSunny,Menu,Search,Brightness4,Notifications,Mail,Person,ExitToApp,ArrowRight,
        ArrowLeft,Lock,Brightness2 } from '@material-ui/icons';
import { connect } from "react-redux";
import { Route,Switch,withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { publicRequest,userRequest } from '../../requestMethods';
import	Post from '../Post'
import Messenger from '../Messenger'
import './style.css'

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
	    open: false,
	    checked: false,
		};

		this.handler = this.handler.bind(this);
	}

	handler(friend) {
    this.setState({friend:friend})
  }

	styleElement = () =>{
		let toggle = document.querySelector('.toggles')
		let navigation = document.querySelector('.navigations')
		let main = document.querySelector('.mains')

		navigation.classList.toggle('active')
		main.classList.toggle('active')
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

  changeTheme = async () =>{
  		if(this.state.profile.theme == null){
				if(this.state.checked){
					let data = await publicRequest.post('userapp/theme/',{id:this.props.user.id,theme:'light'})
					.then(({data}) => data)
		  		this.setState({theme: data.theme, checked: false})
		  	}else{
		  		let data = await publicRequest.post('userapp/theme/',{id:this.props.user.id,theme:'dark'})
					.then(({data}) => data)
		  		this.setState({theme: data.theme, checked: true})
		  	}
  		}else{
  			if(this.state.profile.theme[0] == "dark"){
					let data = await publicRequest.patch(`userapp/theme/${this.props.user.id}/`,{theme:'light'})
					.then(({data}) => data)
			  	this.setState({theme: data.theme, checked: false})
			  	this.getCurrentUser()
			  	
			  }else {
			  	let data = await publicRequest.patch(`userapp/theme/${this.props.user.id}/`,{theme:'dark'})
					.then(({data}) => data)
			  	this.setState({theme: data.theme, checked: true})
			  	this.getCurrentUser()
			  }
  		}
	  	
  }

  getCurrentUser = async() =>{
    let data = await publicRequest.get(`userapp/users/${this.props.user.id}/`)
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
  getUser = async() =>{
    let data = await publicRequest.get('userapp/users/')
    .then(({data}) => data)
    this.setState({profiles: data})
  };

  getFriend = async() =>{
    let data = await publicRequest.get('userapp/friend/')
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
			<div className="home" data-theme={this.state.theme}>
				<div className="navigations">
					<ul>
						<li>
							<div className="ahref">
								<span className="icon"><Home /></span>
								<span className="title"> WanWork</span>
							</div>
						</li>
						<li>
							<div className="ahref">
								<span className="icon"><People /></span>
								<span className="title"> Friends</span>
							</div>
						</li>
						<li>
							<div className="ahref">
								<span className="icon"><List /></span>
								<span className="title"> Lists</span>
							</div>
						</li>
						<li>
							<div className="ahref">
								<span className="icon"><Image /></span>
								<span className="title"> Image Gallery</span>
							</div>
						</li>
						<li>
							<div className="ahref" onClick={this.teste}>
								<span className="icon"><PlayCircleOutline /></span>
								<span className="title"> Videos</span>
							</div>
						</li>
						<li>
							<Link exact to={'/shop'} className="link">
								<div className="ahref">
									<span className="icon"><LocalMall /></span>
									<span className="title"> Shop</span>
								</div>
							</Link>
						</li>
						<li>
							<Link exact to={`${this.props.match.url}/messenger`} className="link">
								<div className="ahref">
									<span className="icon"><Forum /></span>
									<span className="title"> Messenger</span>
								</div>
							</Link>
						</li>
						<li>
							<div className="ahref">
								<span className="icon"><WbSunny /></span>
								<span className="title"> Weather</span>
							</div>
						</li>
						<li>
							<Link to={'/settings'} className="link">
								<div className="ahref">
									<span className="icon"><Settings /></span>
									<span className="title"> Settings</span>
								</div>
							</Link>
						</li>
					</ul>
				</div>

				<div className="mains">
					<div className="topbars">
						<div className="toggles" onClick={this.styleElement}>
							<Menu className="themes"/>
						</div>
						<div className="searchs">
							<label>
								<input type="text" placeholder="Search ..."/>
								<span><Search /></span>
							</label>
						</div>
						<div className="main-right">
							<div className="topbarStyle">
								<Person/>
							</div>
							<div className="topbarStyle">
								<Notifications/>
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
											<div className="topbarStyle">
												<Lock />
											</div>
											<span>Password</span>
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
							<Switch>
	              <Route exact path={this.props.match.url}>
	                <Post />
	              </Route>
	              <Route exact path={`${this.props.match.url}/messenger`}>
	              	<Messenger friend = {this.state.friend}/>
	              </Route>
	          </Switch>
						</div>
						<div className="right-bar">
							<div className="right-top">

								<div className="friend">
									<div className="avatar">
										<img src="https://cdn.pixabay.com/photo/2022/02/14/08/53/woman-7012726_960_720.jpg" alt="" />
										<span></span>
									</div>
								</div>
								<div className="friendText">
										<span>Erwan</span>
										<small>Online</small>
									</div>
							</div>
							<div className="history">
								<h4>History</h4>
								
									{this.state.friends && this.state.friends.map(friend => {
										if (friend.user === parseInt(this.props.user.id, 10)){
											return(
												<div className="right-top" key={friend.id}>
														{this.state.profiles.filter(item=> item.id === parseInt(friend.friend,10)).map(checked=>{
															return(
																<>
																	<div className="friend" >
																		<div className="avatar">
																			<img src={checked.avatar} alt="avatar" />
																		</div>
																	</div>
																	<div className="friendText" onClick={() => this.handler(checked)}>
																			<span>{checked.username}</span>
																			<small>Online time ago</small>
																	</div>
																</>
															)
														})}
												</div>		
											)
										}else return null
									})}
							</div>
							<div className="other-link">
								<Link className="link" to="#"><small>Sport</small></Link>
								<Link className="link" to="#"><small>News</small></Link>
								<Link className="link" to="#"><small>Movies</small></Link>
								<Link className="link" to="#"><small>Techno</small></Link>
								<Link className="link" to="#"><small>© WanTech corp&nbsp;{new Date().getFullYear()}</small></Link>
							</div>
						</div>
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