import React from 'react'
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { publicRequest, userRequest } from '../../../requestMethods';
import axios from 'axios'
import { rmvCart } from "../../../context/cartRedux";
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
	dlt = (id)=>{
        this.props.dispatchs(rmvCart(id))
    }

	componentDidMount() {
		this.getGeoInfo();
	}
	render() {
		return (
			<div className="cart">
				<div className='cart-header'>
					<Link exact to='/shop' className="link">
						<span className='icon'><ion-icon name="arrow-undo-outline" /></span>
					</Link>
					<span>Checkout now</span>
				</div>
				<div className='contents'>
					<table>
						<tbody>
							{this.props.cart && this.props.cart.map(prod => {
								return (
									<tr>
										<th>
											<img src={prod.pic1} alt='' />
										</th>
										<th>
											<div className='prod-desc'>
												<span>{prod.name}</span>
												<span>Price: $ {prod.price}</span>
												<span>Quantity: {prod.quantity}</span>
											</div>
										</th>
										<th>
											<span className='icon red' onClick={()=> this.dlt(prod.id)}><ion-icon name="trash-outline"/></span>
										</th>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	user: state.user.currentUser,
	cart: state.cart.carts,
});

const mapDispatchToProps = (dispatch) => ({
	dispatchs: dispatch,
});


export default connect(mapStateToProps,mapDispatchToProps)(index)