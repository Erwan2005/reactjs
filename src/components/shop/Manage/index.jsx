import React from 'react'
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import Resizer from "react-image-file-resizer";
import { userRequest } from '../../../requestMethods';
import { toast } from 'react-toastify';

import _ from 'lodash';
import './style.css'
export class index extends React.Component {
	constructor(props) {
		super(props);
		this.refImg = React.createRef();
		this.state = {
			images: [],
			img: false,
			name: '',
			desc: '',
			price: '',
			qty: '',
			products: [],
			item: []
		}
	};

	imageHandler = async (e) => {
		const MAX_LENGTH = 5;
		if (Array.from(e.target.files).length > MAX_LENGTH) {
			e.preventDefault();
			alert(`Cannot upload files more than ${MAX_LENGTH}`);
			return;
		} else {
			let files = Array.from(e.target.files).map(file => {
				let reader = new FileReader();
				return new Promise(resolve => {
					reader.onload = () => resolve(reader.result);
					reader.readAsDataURL(file)

				});

			});
			let res = await Promise.all(files);
			this.setState({ images: res, img: true })
		}
	};

	addProd = async () => {
		if (this.state.name === '' || this.state.desc === '' || this.state.price === '' || this.state.qty === '' || this.state.images.length === 0) {
			console.log("Something wrong !")
		} else {
			let data = await userRequest.post('shop/product/', {
				seller: this.props.user.id, name: this.state.name, desc: this.state.desc
				, price: this.state.price, qtystock: this.state.qty, pic1: this.state.images[0], pic2: this.state.images[1] && this.state.images[1]
				, pic3: this.state.images[2] && this.state.images[2], pic4: this.state.images[3] && this.state.images[3], pic5: this.state.images[4] && this.state.images[4]
			})
				.then(({ data }) => data)
			toast.success("Product added succefully !")
			this.setState({ products: this.state.products.concat(data), images: [], name: '', price: '', qty: '', desc: '', img: false })

		}
	}

	getProduct = async () => {
		let data = await userRequest.get('shop/product')
			.then(({ data }) => data)
		this.setState({ item: _.sortBy(data.results, "id") })
		//await this.state.messages.filter(item=> (item.sender === parseInt(id, 10) && item.receiver=== parseInt(this.id, 10)) || (item.receiver === parseInt(id, 10) && item.sender=== parseInt(this.id, 10))).map(checked=>(this.setState({private_message:checked})))
		await this.state.item && this.state.item.map((item) => {
			if (item.seller === this.props.user.id) {
				this.setState({ products: this.state.products.concat(item) })
			}
		})
	};

	delProd = async (id) => {
		let data = await userRequest.delete(`shop/product/${id}`)
			.then(({ data }) => data)
		const new_data = this.state.products.filter(product => {
			if (product.id === id) {
				return false
			}
			return true;
		})
		this.setState({ products: new_data })
	}

	componentDidMount() {
		this.getProduct()
	};

	render() {
		return (
			<div className="manage">
				<div className='header'>
					<Link exact to='/shop' className="link">
						<span className='icon'><ion-icon name="arrow-undo-outline" /></span>
					</Link>
					<span>Manage product</span>
				</div>
				<div className='middle'>
					<div className='left'>
						<input type='type' placeholder='Product name'
							value={this.state.name}
							onChange={e => this.setState({ name: e.target.value })} />
						<textarea placeholder='Product description'
							value={this.state.desc}
							onChange={e => this.setState({ desc: e.target.value })} />
						<input type='text' placeholder='Quanity in stock'
							value={this.state.qty}
							onChange={e => this.setState({ qty: parseInt(e.target.value) ? parseInt(e.target.value) : '' })} />
						<input type='text' placeholder='Price'
							value={this.state.price}
							onChange={e => this.setState({ price: parseFloat(e.target.value) ? parseFloat(e.target.value) : '' })} />
					</div>
					<div className='right'>
						<div className='drag-drop'
							onClick={(event) => {
								event.preventDefault();
								this.refImg.current.click();
							}} ref={this.wrapperRef}>
							<span>Drop here </span>
							<span className='icon'><ion-icon name="add-circle-outline" /></span>

						</div>
						<input type='file' id='file-img' onChange={(e) => {
							this.imageHandler(e);
						}} ref={this.refImg} style={{ display: 'none' }} multiple accept="image/*" />
						{this.state.img &&
							<div className="pic">
								{this.state.images.map(image => {
									return (
										<img src={image} alt="pic" />
									)
								})

								}
							</div>}
						<button onClick={this.addProd}>Add</button>
					</div>
				</div>
				<div className='bottom'>
					<label>
						<span><ion-icon name="search-outline" /></span>
						<input type='text' placeholder='Search' />
					</label>
					<table>
						<tbody>
							{this.state.products && this.state.products.map(product => {
								return (
									<tr key={product.id}>
										<th><img className="product-img" src={product.pic1} alt="" /></th>
										<th>
											<div className='desc'>
												<span>{product.name}</span>
												<span>Qty in stock: {product.qtystock}</span>
												<span>Price: $ {product.price}</span>
											</div>
										</th>
										<th>
											<div className='action'>
												<span><ion-icon name="pencil-outline" /></span>
												<span onClick={() => this.delProd(product.id)}><ion-icon name="trash-outline" /></span>
											</div>
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
});
export default connect(mapStateToProps, null)(withRouter(index))