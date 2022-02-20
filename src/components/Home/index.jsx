import React from 'react'
import { Home,People,List,Image,PlayCircleOutline,Settings,LocalMall,Forum,
        WbSunny,Menu,Search,Brightness4,Notifications,Mail,Person } from '@material-ui/icons';
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';
import { publicRequest,userRequest } from '../../requestMethods';
import	Post from '../Post'
import './style.css'

export class index extends React.Component {
	constructor(props){
		super(props);
		this.defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		this.state={
			theme: '',
			profile:[],
		};
	}
	styleElement = () =>{
		let toggle = document.querySelector('.toggles')
		let navigation = document.querySelector('.navigations')
		let main = document.querySelector('.mains')

		navigation.classList.toggle('active')
		main.classList.toggle('active')
	}
	preferedTheme = () =>{
	  	if (this.defaultDark){
	  		this.setState({theme: 'dark'})
	  	}
  	}
  	getCurrentUser = async() =>{
    let data = await publicRequest.get(`userapp/users/${this.props.user.id}/`)
    .then(({data}) => data)
    this.setState({profile: data})
  };
  	componentDidMount(){
	  	this.preferedTheme()
	  	this.getCurrentUser()
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
							<Link exact to={`/shop/${this.props.user.id}`} className="link">
								<div className="ahref">
									<span className="icon"><LocalMall /></span>
									<span className="title"> Shop</span>
								</div>
							</Link>
						</li>
						<li>
							<div className="ahref">
								<span className="icon"><Forum /></span>
								<span className="title"> Messenger</span>
							</div>
						</li>
						<li>
							<div className="ahref">
								<span className="icon"><WbSunny /></span>
								<span className="title"> Weather</span>
							</div>
						</li>
						<li>
							<div className="ahref">
								<span className="icon"><Settings /></span>
								<span className="title"> Settings</span>
							</div>
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
							<div className="topbarStyle">
								<img src={this.state.profile.avatar} alt="avatar" />
							</div>
						</div>
					</div>
					<div className="central">
						<div className="posts">
							<Post />
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
								<div className="right-top">
									<div className="friend">
										<div className="avatar">
											<img src="https://cdn.pixabay.com/photo/2022/02/14/08/53/woman-7012726_960_720.jpg" alt="" />
										</div>
									</div>
									<div className="friendText">
											<span>Erwan</span>
											<small>Online time ago</small>
										</div>
								</div>
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