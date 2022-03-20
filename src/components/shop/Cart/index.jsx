import React from 'react'
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { publicRequest,userRequest } from '../../../requestMethods';
import axios from 'axios'
import visa from './visa.png'
import './style.css'
export class index extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	        countryName: '',
	        countryCode: ''
	    }
	}

	getGeoInfo = () => {
	    axios.get('https://ipapi.co/json/').then((response) => {
	        let data = response.data;
	        this.setState({
	            countryName: data.country_name,
	            countryCode: data.country_calling_code
	        });

	    }).catch((error) => {
	        console.log(error);
	    });
	};

	componentDidMount(){
	    this.getGeoInfo();
	}
	render() {
		return (
			<div className="cart">
				<div className="details">
					<div className="cardHeader">
					<Link exact to='/shop' className="link">
						<h2>&#8592;</h2>
					</Link>
					<span className="btn">Clear all</span>
					</div>
					<table>
						<thead>
							<tr>
								<td>Product</td>
								<td>Name</td>
								<td>Price</td>
								<td>Action</td>
								<td>Total</td>
							</tr>
						</thead>
						<tbody>
							{this.props.cart.products.map((product)=>(
								<tr>
									<td>
										<img src={product.pic1} alt="product" />
									</td>
									<td>
										{product.name}<br/>
										<span>Quantity: {product.quantity}</span>
									</td>
									<td>&euro;&nbsp;{product.price}</td>
									<td>
										<span className="edit">&#9998;</span>
										<span className="delete">&#x2716;</span>
									</td>
									<td>&euro;&nbsp;{product.price * product.quantity}</td>
								</tr>
							))}
							
						</tbody>
					</table>
				</div>
				<div className="summary">
					<div className="cardHeader">
						<h2>Summary orders</h2>
					</div>
					<table>
						<tr>
							<td>SubTotal</td>
							<td>&euro;&nbsp;{this.props.cart.total ? this.props.cart.total : 0}</td>
						</tr>
						<tr>
							<td>T.V.A 1.5%</td>
							<td>&euro;&nbsp;{this.props.cart.total ? ((this.props.cart.total*1.5/100).toFixed(2)) : 0}</td>
						</tr>
						<tr>
							<td>Shipping</td>
							<td>&euro;&nbsp;{this.props.cart.total ? ((this.props.cart.total*5/100).toFixed(2)) : 0}</td>
						</tr>
						<tr>
							<td>Net payable</td>
							<td>&euro;&nbsp;{this.props.cart.total ? ((this.props.cart.total+(this.props.cart.total*1.5/100)+(this.props.cart.total*5/100)).toFixed(2)) : 0}</td>
						</tr>
					</table>
					<br />
					<p>Country:&nbsp;{this.state.countryName}</p>
					<p>NB: The duration of the delivery will depend on your location</p>
					<p>Payment method:</p>
					{this.state.countryName == 'Madagascar' && <p>&nbsp;&nbsp;Mobile money</p>}
					<p>&nbsp;&nbsp;<img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" alt="PayPal" />,<img src="https://www.freepnglogos.com/uploads/visa-card-logo-9.png" alt="visa"/></p><visa/>
					<button>Order now</button>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	user: state.user.currentUser,
  cart: state.cart,
});


export default connect(mapStateToProps)(index)