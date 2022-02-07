import React from 'react'
import { withRouter } from "react-router";
import { FavoriteBorder,Favorite,AddShoppingCart,Remove,Add } from "@material-ui/icons";
import { publicRequest,userRequest } from '../../../requestMethods';
import { connect } from "react-redux";
import { addProduct } from "../../../context/cartRedux";
import "./style.css"

export class index extends React.Component {
	constructor(props){
		super(props);
		this.id = this.props.match.params.id_prod;
		this.state={
			quantity: 1,
			product: []
		}

	}

  handleQuantity=(type)=>{
  	if(type === "minus"){
  		this.state.quantity > 1 && this.setState({quantity: this.state.quantity-1})
  	}else{
  		this.state.quantity < 9 && this.setState({quantity: this.state.quantity+1})
  	}
  }

  	insertCart = async() =>{
		let user = this.props.user.id;
		let id_prod = this.id
		let quantity = this.state.quantity
		let data = await publicRequest.post('shop/cart/',{user,id_prod,quantity})
	  .then(({data})=>data)
	}

  addCart = (quantity) =>{
  		this.insertCart()
		this.props.dispatchs(
			addProduct({...this.state.product,quantity})
		);
	}

  getProduct = async() =>{
		let data = await publicRequest.get(`shop/product/${this.id}`)
	    .then(({data})=>data)
	    this.setState({product: data})
	}

	componentDidMount(){
		this.getProduct()
	};

	render() {
		return (
			<div className="det-container">
				<div class="product">
				        <div class="product-img">
				            <img src={this.state.product.pic1} alt="product" />
				        </div>
				        <div class="product-listing">
				            <div class="content">
				                <h3 class="name">{this.state.product.name}</h3>
				                <p class="info">{this.state.product.desc}</p>
				                <p class="price">&euro;{this.state.product.price}</p>
				                <div class="btn-and-rating-box">
				                    <div class="rating">
				                        <img src="https://github.com/kunaal438/product-page/blob/master/img/star.png?raw=true" alt="" />
				                        <img src="https://github.com/kunaal438/product-page/blob/master/img/star.png?raw=true" alt="" />
				                        <img src="https://github.com/kunaal438/product-page/blob/master/img/star.png?raw=true" alt="" />
				                        <img src="https://github.com/kunaal438/product-page/blob/master/img/star.png?raw=true" alt="" />
				                        <img src="https://github.com/kunaal438/product-page/blob/master/img/star%20stroke.png?raw=true" alt="" />
				                    </div>
				                    <button class="btn">buy now</button>
				                </div>
				            </div>
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
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(index))