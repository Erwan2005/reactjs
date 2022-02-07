import React from 'react'
import { Link } from 'react-router-dom';
import {
  Divider,Typography
} from "@material-ui/core";
import './style.css'
import {SideBarData} from './sideBarData'
import { withRouter } from "react-router";

export class index extends React.Component {
	render() {
		return (
			<div className="conte">
				<div className="sidebar">
					<Link to="/Home" style={{textDecoration:'none'}}>
						<Typography variant="h4" noWrap component="div" style={{color: '#c8c8c8', marginLeft: '5px',height: '50px'}} id="txt">
	              WanWork
	          </Typography>
	         </Link>
					<ul className="sidebarList">
						{SideBarData.map((val,key) =>{
							return(
								<Link to={`${this.props.match.url+val.link}`} style={{textDecoration:'none',textTransform:'none'}}>
									<li key={key} 
										className="row"
										id={this.props.match.url == this.props.match.url+val.link ? "Active" : ""}
									 >
								 	
										<div id="icon">
											{val.icon}
										</div>
										<div id="title">
											{val.title}
										</div>
									
									</li>
								</Link>
							)
						})}
						<Divider />
					</ul>
				</div>
			</div>
		)
	}
}

export default withRouter(index)