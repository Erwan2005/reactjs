import React from 'react'
import { Route,Switch,withRouter,Link } from "react-router-dom"
import { connect } from "react-redux";
import { Menu,Notifications,ShoppingCart,
				Mail,ExitToApp,Settings,
				EnhancedEncryption,Category,Shop } from "@material-ui/icons"
import { publicRequest,userRequest } from '../../../requestMethods';
import Products from '../Products'
import Details from '../Details'
import Manage from '../Manage'
import Cart from '../Cart'
import './style.css'
export class index extends React.Component {
	constructor(props){
		super(props);
		this.state={
			profile:[],
			open: false,
		};
	}
	getCurrentUser = async() =>{
    let data = await publicRequest.get(`userapp/users/${this.props.user.id}/`)
    .then(({data}) => data)
    this.setState({profile: data})
  }
  openBox = () =>{
	  	this.setState({open: !this.state.open})
	}

  componentDidMount(){
    this.getCurrentUser()
  };
	render() {
		return (
			<div className="shop">
				<div className="topbar">
					<div className="toggle" onClick={this.props.styleElement}>
						<Menu />
					</div>
					<div className="main-right">
						<div className="topbarStyle">
							<Notifications/>
						</div>
						<div className="topbarStyle">
							<Mail/>
						</div>
						<Link exact to={`${this.props.match.url}/cart`} className="link cart-badge">
							<div className="topbarStyle">
								<ShoppingCart/>
							</div>
							<span>{this.props.quantity}+</span>
						</Link>
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
									<div className="topbarStyle">
										<Settings />
									</div>
									<span>Seller settings</span>
								</li>
								<li onClick={this.openBox}>
									<Link exact to={`${this.props.match.url}/manage`} className="link">
										<div className="topbarStyle">
											<EnhancedEncryption />
										</div>
										<span>Manage Products</span>
									</Link>
								</li>
								
								</ul>
						</div>)}
					</div>
				<Switch>
						<Route exact path={this.props.match.url}>
							<Products />
						</Route>
						<Route exact path={`${this.props.match.url}/cart`} component={Cart} />
						<Route exact path={`${this.props.match.url}/manage`} component={Manage} />
						<Route exact path={`${this.props.match.url}/products/:id_prod`} component={Details} />
				</Switch>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
  quantity: state.cart.quantity,
});

export default connect(mapStateToProps)(withRouter(index))