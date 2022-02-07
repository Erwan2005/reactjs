import React from 'react'
import {
  Avatar,Typography,
  Badge,IconButton
} from "@material-ui/core";
import { 
     ShoppingCart,Search } from "@material-ui/icons";
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";

import './style.css';
import axios from 'axios';
import apiService from '../../../APIService';
import { connect } from "react-redux";

export class index extends React.Component {
	constructor(props){
		super(props);
		this.state={
			profile:[]
		};
		this.user = this.props.user;
		this.quantity = this.props.quantity;

	}

	getCurrentUser = async() =>{
    let data = await axios({
      method: 'get',
      url: apiService.url+`users/${this.user.id}/`,
        
    }).then(({data}) => data)
    this.setState({profile: data})
  };

  componentDidMount(){
    this.getCurrentUser()
  };
	render() {
		return (
			<div className="contains">
				<div>
					<Link exact to={`${this.props.match.url}`} style={{textDecoration:'none'}}>
						<Typography variant="h6" noWrap component="div" style={{color: '#c8c8c8'}} id="txt">
	              Shop
	          </Typography>
	        </Link>
				</div>
				<div className="input-search">
          <Search className="search"/>
            <input type='text' className="custom-input" placeholder='Search products ...'/>
          </div>
				<div className="userprofile">
					<Link exact to={`${this.props.match.url}/cart`}>
					<IconButton
            aria-label="Show basket contents"
            color="inherit"
          >
						<Badge badgeContent={this.quantity} color="secondary">
	            <ShoppingCart className="custom-basket" />
	          </Badge>
	        </IconButton></Link>
	        <IconButton
            aria-label="Show basket contents"
            color="inherit"
          >
						<Avatar src={this.state.profile.avatar} />
					</IconButton>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
  quantity: state.cart.quantity,
});

export default connect(mapStateToProps)(withRouter(index))