import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from "react-redux";
import Details from '../Details'
import Product from '../Products'
import './style.css'
export class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
		}
		this.handleSearch = this.handleSearch.bind(this)
	}
	open = () => {
		this.setState({ open: !this.state.open })
	}
	seller = () => {
		console.log('mande')
	}
	handleSearch = () =>{
		this.props.handleSearch('product')
	}
	componentDidMount() {
		this.handleSearch()
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
									<span className='icon'><ion-icon name="server-outline" /> <small className='icon-text'>Manage product</small></span>
									<span className='icon'><ion-icon name="analytics-outline" /> <small className='icon-text'>Product Analytics</small></span>
								</div>
							</div>}
					</span>
					<span className='icon nav-icon'><ion-icon name="cart-outline" />{this.props.quantity ? <small>{this.props.quantity}</small> : null}</span>
					<span>Qty: </span>
					<span>Price: </span>
				</div>
				<Switch>
					<Route exact path={this.props.match.url}>
						<Product search={this.props.search} results={this.props.results} />
					</Route>
					<Route exact path={`${this.props.match.path}/products/:id_prod`} component={Details} />
				</Switch >
			</div >
		)
	}
}

const mapStateToProps = (state) => ({
	user: state.user.currentUser,
	quantity: state.cart.quantity,
});

export default connect(mapStateToProps)(withRouter(index))