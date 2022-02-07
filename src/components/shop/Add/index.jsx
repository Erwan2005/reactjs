import React from 'react'
import { Add } from "@material-ui/icons";
import './style.css'
export class index extends React.Component {
	render() {
		return (
			<div className="container">
				<input type="text" placeholder="Name of product" required/>
				<input type="text" placeholder="Description of product" required/>
				<input type="text"  placeholder="Price" required/>
				<input type="text" placeholder="Quantity in stock" required/>
				<div className="group">
					<input type="file" placeholder="Quantity in stock"/>
					<input type="file" placeholder="Quantity in stock"/>
					<input type="file" placeholder="Quantity in stock"/>
					<input type="file" placeholder="Quantity in stock"/>
					<input type="file" placeholder="Quantity in stock"/>
					<div className="img"> 
						<span>Product pic</span>
						<button></button>
						<button></button>
						<button></button>
						<button></button>
						<button></button>
					</div>
					<button>Add product</button>
				</div>
				
			</div>
		)
	}
}

export default index