import React from 'react'
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { parseRequest,publicRequest } from '../../../requestMethods';
import { toast } from 'react-toastify';

import _ from 'lodash';
import './style.css'
export class index extends React.Component {
	fileObj = [];
	fileArray = [];
	constructor(props) {
		super(props);
		this.refImg = React.createRef();
		this.state = {
			images: null,
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
		this.fileObj = [];
		this.fileArray = [];
		this.setState({ images: null, img: false })
		const reader = new FileReader();
		reader.onload = () => {
			if (reader.readyState === 2) {
				console.log('File ready')
			}
		}
		this.fileObj.push(e.target.files)
		reader.readAsDataURL(e.target.files[0])
		const file = e.target.files;
		let size = 0;
		let ext = [];
		for (let i = 0; i < file.length; i++) {
			let type = file[i].type.split('/')[0];
			if (ext.indexOf(type) < 0) {
				ext.push(type)
			}
			size += file[i].size
		}
		if (size > 25e6) {
			toast.error("Please upload a file smaller than 25 MB");
			this.fileObj = [];
			this.fileArray = [];
			return false;
		} else if (ext.length > 1) {
			toast.error("Please upload only image");
			this.fileObj = [];
			this.fileArray = [];
			return false;
		} else {
			if (ext[0] === 'image') {
				for (let i = 0; i < this.fileObj[0].length; i++) {
					this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]))
				}
				this.setState({ images: file, img: true})
			} else {
				toast.error("Please upload image only");
				this.fileObj = [];
				this.fileArray = [];
				return false;
			}
		}
	};

	addProd = async () => {
		const formData = new FormData();
		formData.append("seller", this.props.user.id)
		formData.append("name", this.state.name)
		formData.append("desc", this.state.desc)
		formData.append("price", this.state.price)
		formData.append("images", this.state.images)
		if (this.state.images !== null) {
			for (let i = 0; i < this.state.images.length; i++) {
				formData.append("images", this.state.images[i]);
			}
		}
		let data = await parseRequest.post('shop/product/', formData)
			.then(({ data }) => data)

		toast.success("Product added succefully !")
		this.setState({ products: this.state.products.concat(data), images: null, name: '', price: '', qty: '', desc: '', img: false })
	}

	getProduct = async () => {
		let data = await publicRequest.get('shop/product')
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
		await publicRequest.delete(`shop/product/${id}`)
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
								{(this.fileArray || []).map(img => {
                                    return (
                                        <img src={img} alt="" />
                                    )
                                })}
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
										<th><img className="product-img" src={product.images && product.images[0].image} alt="" /></th>
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