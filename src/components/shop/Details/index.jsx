import React from 'react'
import { withRouter, Link } from "react-router-dom";
import { publicRequest, userRequest } from '../../../requestMethods';
import { connect } from "react-redux";
import { addCart } from "../../../context/cartRedux";
import User from '../../../assets/user.svg'
import "./style.css"

export class index extends React.Component {
	constructor(props) {
		super(props);
		this.id = this.props.match.params.id_prod;
		this.state = {
			quantity: 1,
			product: [],
			user: [],
			image: '',
		}

	}

	handleQuantity = (type) => {
		if (type === "minus") {
			this.state.quantity > 1 && this.setState({ quantity: this.state.quantity - 1 })
		} else {
			this.state.quantity < 9 && this.setState({ quantity: this.state.quantity + 1 })
		}
	}

	insertCart = async () => {
		let user = this.props.user.id;
		let id_prod = this.id
		let quantity = this.state.quantity
		let data = await publicRequest.post('shop/cart/', { user, id_prod, quantity })
			.then(({ data }) => data)
	}

	addCart = (quantity) => {
		this.insertCart()
		
	}

	getUser = async () => {
		let data = await publicRequest.get('userapp/users/')
			.then(({ data }) => data)
		this.setState({ user: data })
	}

	getProduct = async () => {
		let data = await userRequest.get(`shop/product/${this.id}`)
			.then(({ data }) => data)
		this.setState({ product: data })
		console.log(this.state.product.proprietary[0])
	}

	handleMouseOver = (src) => {
		console.log(src)
		this.setState({ image: src })
	}
	componentDidMount() {
		this.getProduct()
		this.getUser()
	};

	render() {
		return (
			<div className="det-prod">
				<div className="card-left">
					<img src={this.state.image !== '' ? this.state.image : this.state.product.images && this.state.product.images[0].image} alt="" />
					<div className="pic-bottom">
						{this.state.product.images && this.state.product.images.map(img =>{
							return(
								<img src={img.image} alt="" onMouseOver={() => this.handleMouseOver(img.image)} />
							)
						})}
					</div>
				</div>
				<div className="card-right">
					<Link exact to='/shop' className="link">
						<span className="return">&#8592;</span>
					</Link>
					<div className="cardHeader">
						<small className="categories">Home/woman/hair</small>
						<div className='seller-contact'>
							<span className='icon'><ion-icon name="chatbubbles-outline"/></span>
							<img src={this.state.product.proprietary ? this.state.product.proprietary : User} alt='' />
						</div>
					</div>
					<h3>{this.state.product.name}</h3>
					<small>{this.state.product.desc}</small>
					<div className="rating">
						&#9733;
						&#9733;
						&#9733;&nbsp;
						<div className="grey">
							&#9733;
							&#9733;
						</div>
					</div>
					<div className="quantity">
						<span className="minus" onClick={() => this.handleQuantity("minus")}>&minus;</span>
						<input type="text" value={this.state.quantity} />
						<span className="plus" onClick={() => this.handleQuantity("plus")}>&#43;</span>
					</div>
					<div className="btn-action">
						<button onClick={() => this.addCart(this.state.quantity)}>Add to cart</button>
						<button>Add to wishlist</button>
					</div>

				</div>
			</div>
		)
	}
}

const mapDispatchToProps = (dispatch) => ({
	dispatchs: dispatch,
});

const mapStateToProps = (state) => ({
	user: state.user.currentUser,
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(index))