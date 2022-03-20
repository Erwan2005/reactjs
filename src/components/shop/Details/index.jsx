import React from 'react'
import { withRouter,Link } from "react-router-dom";
import { FavoriteBorder,Favorite,AddShoppingCart,Remove,Add,ArrowLeft } from "@material-ui/icons";
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
			product: [],
			user: [],
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

	getUser = async() =>{
		let data = await publicRequest.get('userapp/users/')
		.then(({data})=>data)
		this.setState({user:data})
	}

  getProduct = async() =>{
		let data = await publicRequest.get(`shop/product/${this.id}`)
	  .then(({data})=>data)
	  this.setState({product: data})
	}
	componentDidMount(){
		this.getProduct()
		this.getUser()
	};

	render() {
		return (
			<div className="det-prod">
				<div className="card-left">
					<img src={this.state.product.pic1} alt="product" />
					<div className="pic-bottom">
						<img src={this.state.product.pic1} alt="product" />
						<img src={this.state.product.pic2 ? this.state.product.pic2: ""} alt=" " />
						<img src={this.state.product.pic3 ? this.state.product.pic3: ""} alt=" " />
						<img src={this.state.product.pic4 ? this.state.product.pic4: ""} alt=" " />
					</div>
				</div>
				<div className="card-right">
					<Link exact to='/shop' className="link">
						<span className="return">&#8592;</span>
					</Link>
					<div className="cardHeader">

						<small className="categories">Home/woman/hair</small>
							{this.state.user && this.state.user.map(profile =>{
								if(this.state.product.seller === profile.id){
									return(
										<div className="rights">
											<small>{profile.username}</small>
											<img src={profile.avatar} alt="" />
										</div>
									)
								}else return null;
							})}
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
						<span className="minus" onClick={()=> this.handleQuantity("minus")}>&minus;</span>
						<input type="text" value={this.state.quantity}/>
						<span className="plus" onClick={()=> this.handleQuantity("plus")}>&#43;</span>
					</div>
					<div className="btn-action">
						<button onClick={()=>this.addCart(this.state.quantity)}>Add to cart</button>
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
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(index))