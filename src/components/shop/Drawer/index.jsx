import React from 'react'
import { Route,Switch,withRouter } from "react-router"
import {
  Badge
} from "@material-ui/core";
import { Notifications,
		 EnhancedEncryption,
		 Category,
		 Settings,Home,Menu,
		 ShoppingCart,ArrowDropDown,
		 FlashOn,Search,Brightness4 } from "@material-ui/icons"
		 import { Link } from 'react-router-dom';
import Products from '../Products'
import Cart from '../Cart'
import Details from '../Details'
import { publicRequest,userRequest } from '../../../requestMethods';
import axios from 'axios';
import apiService from '../../../APIService';
import { connect } from "react-redux";
import './style.css'
export class index extends React.Component {
	constructor(props){
		super(props);
		this.defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		this.state={
			profile:[],
			search: "",
			theme: '',
		};
	}
	

	styleElement = () =>{
		let toggle = document.querySelector('.toggle')
		let navigation = document.querySelector('.navigation')
		let main = document.querySelector('.main')

		navigation.classList.toggle('active')
		main.classList.toggle('active')
	}

	getCurrentUser = async() =>{
    let data = await publicRequest.get(`userapp/users/${this.props.user.id}/`)
    .then(({data}) => data)
    this.setState({profile: data})
    if(this.state.profile.theme == []){
	  	if (this.defaultDark){
	  		this.setState({theme: 'dark'})
	  	}
	  }else{
	  	this.setState({theme: this.state.profile.theme[0]})
	  }
  };

  switchTheme = () =>{
  	const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
  	this.setState({theme: newTheme})
  }
  componentDidMount(){
    this.getCurrentUser()
  };
	render() {
		return (
			<div className="container" data-theme={this.state.theme}>
				<div className="navigation">
					<ul>
						<li>
							<Link to={'/Home'} className="link">
								<div className="ahref">
									<span className="icon"><Home /></span>
									<span className="title"> WanWork</span>
								</div>
							</Link>
						</li>
						<li>
							<div className="ahref">
								<span className="icon"><Notifications /></span>
								<span className="title"> Notification</span>
							</div>
						</li>
						<li>
							<div className="ahref">
								<span className="icon"><EnhancedEncryption /></span>
								<span className="title"> Add products</span>
							</div>
						</li>
						<li>
							<div className="ahref">
								<span className="icon"><Category /></span>
								<span className="title"> Manage products</span>
							</div>
						</li>
						<li>
							<div className="ahref">
								<span className="icon"><Settings /></span>
								<span className="title"> Seller settings</span>
							</div>
						</li>
					</ul>
				</div>

				<div className="main">
					<div className="topbar">
						<div className="toggle" onClick={this.styleElement}>
							<Menu className="theme"/>
						</div>
						<div className="search">
							<label>
								<input type="text" placeholder="Search ..."/>
								<span><Search /></span>
							</label>
						</div>
						<div className="right">
							<Brightness4 className="theme" onClick={this.switchTheme}/>
							<Link exact to={`${this.props.match.url}/cart`}>
								<Badge badgeContent={this.props.quantity} color="secondary">
			            <ShoppingCart className="custom-basket" />
			          </Badge>
		          </Link>
		          <Link to="/Home">
								<div className="user">
									<img src={this.state.profile.avatar} alt="profile"/>
								</div>
							</Link>
						</div>
					</div>
					<Switch>
						<Route exact path={this.props.match.url}>
							<Products />
						</Route>
						<Route exact path={`${this.props.match.url}/cart`} component={Cart} />
						<Route exact path={`${this.props.match.url}/products/:id_prod`} component={Details} />
				</Switch>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
  quantity: state.cart.quantity,
});

export default connect(mapStateToProps)(withRouter(index))