import React from 'react'
import { Remove,Add } from "@material-ui/icons";
import { connect } from "react-redux";
import { publicRequest,userRequest } from '../../../requestMethods';
import './style.css'
export class index extends React.Component {
	constructor(props){
		super(props);
		this.id = this.props.match.params.id_prod;
		this.state={
			profile:[],
		}
	}
	handleQuantity=(type)=>{
  	if(type === "minus"){
  		this.state.quantity > 1 && this.setState({quantity: this.state.quantity-1})
  	}else{
  		this.state.quantity < 9 && this.setState({quantity: this.state.quantity+1})
  	}
  }

  getCart = async() =>{
		let data = await publicRequest.get('shop/cart')
	  .then(({data})=>data)
	  this.setState({cart: data})
	}
	componentDidMount(){
		this.getCart()
	 };
	render() {
		return (
			<div className="container">
					<table className="table-product">
						<thead>
							<tr>
								<td width="100">Product</td>
								<td width="250">Details</td>
								<td width="75">Price</td>
								<td width="150">Quantity</td>
								<td width="75">Action</td>
								<td width="150">Total</td>
							</tr>
						</thead>
						<tbody>
							{this.props.cart.products.map((product)=>(
								<tr>
									<td height="120">
										<img src={product.pic1} alt="product"/>
									</td>
									<td>
										<p>{product.desc}</p>
									</td>
									<td>&euro;&nbsp;{product.price}</td>
									<td>
										<div className="input-numb">
											<div id="btn" onClick={()=>this.handleQuantity("minus")}><Remove htmlColor="#ff5959"/></div>
											<div className="numb"><input type="text" className="input-text" pattern="[0-9]*" value={product.quantity}/></div>
											<div id="btn" onClick={()=>this.handleQuantity("add")}> <Add htmlColor="#9dceff"/></div>
										</div>
									</td>
									<td>remove</td>
									<td>&euro;&nbsp;{product.price * product.quantity}</td>
								</tr>

							))}
							
						</tbody>
						<tfoot>
							<tr>
								<td colspan="5" align="right">Subtotal</td>
								<td>&euro;&nbsp;{this.props.cart.total ? this.props.cart.total : 0}</td>
							</tr>
						</tfoot>
					</table>
					<div className="amount">
						<table className="table-amount" width="250">
							<thead>
								<tr>
									<td colspan="2" align="left">Order summary</td>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Total H.T</td>
									<td align="right">&euro;&nbsp;{this.props.cart.total ? this.props.cart.total : 0}</td>
								</tr>	
								<tr>
									<td>T.V.A 1.5%</td>
									<td align="right">&euro;&nbsp;{this.props.cart.total ? (this.props.cart.total*1.5/100) : 0}</td>
								</tr>	
								<tr>
									<td>Shipping</td>
									<td align="right">&euro;&nbsp;{this.props.cart.total ? (this.props.cart.total*5/100) : 0}</td>
								</tr>	
							</tbody>
							<tfoot>
								<tr>
									<td>Total</td>
									<td align="right">&euro;&nbsp;{this.props.cart.total ? (this.props.cart.total+(this.props.cart.total*1.5/100)+(this.props.cart.total*5/100)) : 0}</td>
								</tr>
							</tfoot>
						</table>
						<span>Infos:<br/>Delivery time depends on your location.</span>
						<span>Payment method:</span>
						<button>Order Now</button>
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