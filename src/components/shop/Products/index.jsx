import React from 'react'
import { Info,FavoriteBorder,Favorite,AddShoppingCart,StarRate } from "@material-ui/icons";
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import { publicRequest,userRequest } from '../../../requestMethods';
import { connect } from "react-redux";
import { addProduct } from "../../../context/cartRedux";
import './style.css'
export class index extends React.Component {
	constructor(props){
		super(props);
		this.state={
			product: [],
			quantity: 1
			
		}
	}

	getProduct = async() =>{
		let data = await publicRequest.get('shop/product')
	    .then(({data})=>data)
	    this.setState({product: data})
	}
	insertCart = async(id) =>{
		let user = this.props.user.id;
		let id_prod = id
		let quantity = this.state.quantity
		let data = await publicRequest.post('shop/cart/',{user,id_prod,quantity})
	  .then(({data})=>data)
	}
	addCart = (product) =>{
		this.insertCart(product.id)
		let quantity = this.state.quantity
		this.props.dispatchs(
			addProduct({...product, quantity})
		);
	}
	componentDidMount(){
		this.getProduct()
	  };
	render() {
		return (
			<div className="container">
				{this.state.product && this.state.product.map((prod, index) => {
					return(
						<div className="card" key={prod.id}>
							<div className="imgBox">
								<img src={prod.pic1} alt="product" />
								<ul className="action">
									<Link exact to={`${this.props.match.url}/products/${prod.id}`} style={{textDecoration:'none'}}>
										<li>
											<Info />
											<span>View Details</span>
										</li>
									</Link>
									<li>
										<FavoriteBorder />
										<span>Add to Wishlist</span>
									</li>
									<li onClick={()=>this.addCart(prod)}>
										<AddShoppingCart />
										<span>Add to Cart</span>
									</li>
								</ul>
							</div>
							<div className="content">
								<div className="productName">
									<h3>{prod.name}</h3>
								</div>
								<div className="price">
									<h2>&euro;{prod.price}</h2>
									<div className="rating">
										&#9733;
										&#9733;
										&#9733;&nbsp;
										<div className="grey">
											&#9733;
											&#9733;
										</div>
									</div>
								</div>
							</div>
						</div>
					)
				})}
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
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(index))