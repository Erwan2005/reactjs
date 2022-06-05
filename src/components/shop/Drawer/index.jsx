import React, { Component } from 'react'
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import { connect } from "react-redux";
import Details from '../Details'
import Product from '../Products'
import Manage from '../Manage'
import Cart from '../Cart'
import './style.css'
export class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			total: 0,
		}
		this.handleSearch = this.handleSearch.bind(this)
	}
	open = () => {
		this.setState({ open: !this.state.open })
	}
	seller = () => {
		console.log('mande')
	}
	handleSearch = () => {
		this.props.handleSearch('product')
	}
	total = () => {
		let price = 0;
		this.props.cart.map((ele, k) => {
			price = ele.price * ele.quantity + price
		});
		this.setState({ total: price })

	};
	componentDidMount() {
		this.handleSearch()
		this.total()
	};
	render() {
		return (
			<div className='shop-container'>
				<div className='shop-menu'>
					<span className='icon label-menu' onClick={this.open}><ion-icon name="menu-outline" />
						{this.state.open &&
							<div className='dropdown'>
								<div className='menu-list'>
									<span className='icon' onClick={this.seller}><ion-icon name="construct-outline" /> <small className='icon-text'>Seller</small></span>
									<Link to={`${this.props.match.url}/manage`} style={{ textDecoration: 'none' }} exact={true}>
										<span className='icon'><ion-icon name="server-outline" /> <small className='icon-text'>Manage product</small></span>
									</Link>
									<span className='icon'><ion-icon name="analytics-outline" /> <small className='icon-text'>Product Analytics</small></span>
								</div>
							</div>}
					</span>
					<Link to={`${this.props.match.url}/cart`} style={{ textDecoration: 'none' }} exact={true}>
						<span className='icon nav-icon'><ion-icon name="cart-outline" />{this.props.cart.length ? <small>{this.props.cart.length}</small> : null}</span>
					</Link>
					<span className='flag'>Qty: {this.props.cart.length ? this.props.cart.length : 0}</span>
					<span className='flag'>Price: $ {this.state.total}</span>
				</div>
				<Switch>
					<Route exact path={this.props.match.url}>
						<Product search={this.props.search} results={this.props.results} />
					</Route>
					<Route exact path={`${this.props.match.path}/products/:id_prod`} component={Details} />
					<Route exact path={`${this.props.match.path}/cart`} component={Cart} />
					<Route exact path={`${this.props.match.path}/manage`} component={Manage} />
				</Switch >
			</div >
		)
	}
}

const mapStateToProps = (state) => ({
	user: state.user.currentUser,
	cart: state.cart.carts,
});

export default connect(mapStateToProps)(withRouter(index))