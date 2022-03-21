import React from 'react'
import { connect } from "react-redux";
import { withRouter,Link } from "react-router-dom";
import { Search } from "@material-ui/icons"
import { Table,TableBody,TableCell,TableContainer,TableHead,TableRow } from '@material-ui/core';
import Resizer from "react-image-file-resizer";
import { publicRequest,userRequest, BASE_URL } from '../../../requestMethods';
import _ from 'lodash';
import './style.css'
export class index extends React.Component {
	constructor(props){
	    super(props);
	    this.refImg = React.createRef();
	    this.state={
	    	images: [],
	    	img: false,
	    	name:'',
	    	desc:'',
	    	price:'',
	    	qty:'',
	    	products:[],
	    	item:[]
	    }
	};

	imageHandler = async (e) => {
		const MAX_LENGTH = 5;
		if (Array.from(e.target.files).length > MAX_LENGTH) {
		    e.preventDefault();
		    alert(`Cannot upload files more than ${MAX_LENGTH}`);
		    return;
		  }else{
	      	let files = Array.from(e.target.files).map(file => {
	            let reader = new FileReader();
	            return new Promise(resolve => {
	                reader.onload = () => resolve(reader.result);
	                reader.readAsDataURL(file)
	                
	            });
	            
	        });
	        let res = await Promise.all(files);
	        this.setState({images:res, img:true})}
    };

  	addProd = async() =>{
  		if (this.state.name ==='' || this.state.desc ==='' || this.state.price ==='' || this.state.qty ==='' || this.state.images.length === 0){
  			console.log("Something wrong !")
  		}else{
  			let data = await publicRequest.post('shop/product/',{seller:this.props.user.id,name:this.state.name,desc:this.state.desc
  				,price:this.state.price,qtystock:this.state.qty,pic1:this.state.images[0],pic2:this.state.images[1] && this.state.images[1]
  				,pic3:this.state.images[2] && this.state.images[2],pic4:this.state.images[3] && this.state.images[3],pic5:this.state.images[4] && this.state.images[4]})
  			.then(({data}) => data)
  			this.setState({products:this.state.products.concat(data),images:[],name:'',price:'',qty:'',desc:'',img:false})

  		}
  	}

  	getProduct = async() =>{
	  	let data = await publicRequest.get('shop/product')
	  	.then(({data}) => data)
	    this.setState({item: _.sortBy(data, "id")})
	    //await this.state.messages.filter(item=> (item.sender === parseInt(id, 10) && item.receiver=== parseInt(this.id, 10)) || (item.receiver === parseInt(id, 10) && item.sender=== parseInt(this.id, 10))).map(checked=>(this.setState({private_message:checked})))
	    await this.state.item && this.state.item.map((item) =>{
	    	if (item.seller === this.props.user.id){
	    		this.setState({products:this.state.products.concat(item)})
	    	}
	    })
	  };

	 delProd = async(id)=>{
	 	let data = await publicRequest.delete(`shop/product/${id}`)
	  	.then(({data}) => data)
	  	const new_data = this.state.products.filter(product => {
	      if(product.id === id) {
	        return false
	      }
	      return true;
	    })
	    this.setState({products:new_data})
	 }
	componentDidMount(){
	  	this.getProduct()
	};
	render() {
		return (
			<div className="manage">
				<div className="left">
					<div className="header">
					<Link exact to='/shop' className="link">
						<span>&#8592;</span>
					</Link>
					<span>Product</span></div><br/>
					<input type="text" name="" id="" required placeholder="Product name..."
					value={this.state.name}
					onChange={e=> this.setState({name:e.target.value})}/>

					<textarea placeholder="Product description..." 
					value={this.state.desc}
					onChange={e => this.setState({desc:e.target.value})}/>
					<div className="price">
						<input type="text" placeholder="Price..." required 
						value={this.state.price}
						onChange={e=> this.setState({price:parseFloat(e.target.value) ? parseFloat(e.target.value) : ''})}/>
						<input type="text" placeholder="Quantity in stock..." required
						value={this.state.qty}
						onChange={e=> this.setState({qty:parseInt(e.target.value) ? parseInt(e.target.value) : ''})}/>
					</div>
					<div className="pic" onClick={(event) => {
				                event.preventDefault();
				                this.refImg.current.click();
				                }}><span>&#10009;</span><small>Product pic</small></div>
					<input type='file' id='file-img' onChange={(e) => {
				                this.imageHandler(e);
				              }} ref={this.refImg} style={{display: 'none'}} multiple accept="image/*"/>
				    {this.state.img &&
					    <div className="images">
					    	{this.state.images.map(image =>{
					    		return(
									<img src={image} alt="pic" />
					    		)
					    	})
					    		
					    	}
					    </div>}
					<div className="action"><span></span><button onClick={this.addProd}>Add</button></div>
				</div>
				<div className="right">
					<div className="header">
						<input type="text" placeholder="Search..."/>
						<span><Search/></span>
					</div>
					<TableContainer className="table">
				      <Table sx={{ minWidth: 650 }} aria-label="simple table">
				        <TableHead>
				          <TableRow>
				            <TableCell className="tableCell">Product</TableCell>
				            <TableCell className="tableCell">Name</TableCell>
				            <TableCell className="tableCell">Quatinty</TableCell>
				            <TableCell className="tableCell">Price</TableCell>
				            <TableCell className="tableCell">Action</TableCell>
				          </TableRow>
				        </TableHead>
				         <TableBody>
					        {this.state.products && this.state.products.map(product =>{
					         	return(
					         		<>
										<TableRow key={product.id}>
								          	<TableCell className="tableCell">
								          		<div className="cellWraper">
								          			<img src={product.pic1} alt="" />
								          		</div>
								          	</TableCell>
								          	<TableCell className="tableCell">{product.name}</TableCell>
								          	<TableCell className="tableCell">{product.qtystock}</TableCell>
								          	<TableCell className="tableCell">&euro;&nbsp;{product.price}</TableCell>
								          	<TableCell className="tableCell">
								          		<div className="tableAction"><span>&#9998;</span><span onClick={()=>this.delProd(product.id)}>&#x2716;</span></div>
								          	</TableCell>
								        </TableRow>
							        </>
					         	)
					        })}
				        </TableBody>
				      </Table>
				    </TableContainer>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
});
export default connect(mapStateToProps,null)(withRouter(index))