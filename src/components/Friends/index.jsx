import React from 'react'
import { Search } from '@material-ui/icons';
import { connect } from "react-redux";
import { Route,Switch,withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { publicRequest,userRequest } from '../../requestMethods';
import './style.css'
export class index extends React.Component {
	constructor(props){
		super(props);
		
		this.state={
			friends: [],
	    	profiles: [],
		};
	}

	getFriends = async() =>{
		await publicRequest.get('userapp/friend/')
		.then(resp => {this.setState({friends: resp.data})})

		await publicRequest.get('userapp/users/')
		.then(resp => {this.setState({profiles: resp.data})})

		console.log(this.state.friends)
	}
	componentDidMount(){
	  	this.getFriends()
	};
	render() {
		return (
			<div className="friends">
				<div className="left">
					<div className="top">
						<div className="search">
							<label>
								<input type="text" placeholder="Search friend ..."/>
								<span><Search /></span>
							</label>
						</div>
						<span>Total: 2k</span>
					</div>
					<table>
						<tr>
							<td>
								<img src="https://cdn.pixabay.com/photo/2022/02/14/08/53/woman-7012726_960_720.jpg" alt="avatar" />
								Erwan
							</td>
							<td>Since </td>
							<td>
								<span>Block</span> | <span>Delete</span>
							</td>
						</tr>	
					</table>
					<div className="pagination">
						<button className="btnPage"><span>{'<'}</span></button>
						<button className="btnPage">1</button>
						<button className="btnPage">2</button>
						<button className="btnPage">3</button>
						<button className="btnPage"><span>{'>'}</span></button>
					</div>
				</div>
				<div className="right">
					<div className="top">
						<h3>Bonjour</h3>
						<h3>Bonjour</h3>
						<h3>Bonjour</h3>
						<h3>Bonjour</h3>
						<h3>Bonjour</h3>
						<h3>Bonjour</h3>
						<h3>Bonjour</h3>
						<h3>Bonjour</h3>
						<h3>Bonjour</h3>
						<h3>Bonjour</h3>
						<h3>Bonjour</h3>
						<h3>Bonjour</h3>
						<h3>Bonjour</h3>
						<h3>Bonjour</h3>
						<h3>Bonjour</h3>
						<h3>Bonjour</h3>
						<h3>Bonjour</h3>
					</div>
					<div className="bottom">
						<div className="request">
						 <div className="request-profile">
						 	<img src="https://cdn.pixabay.com/photo/2022/02/14/08/53/woman-7012726_960_720.jpg" alt="avatar" />
						 	<div className="profile-text">
						 		<span>Erwan</span>
						 		<small>110k Friends</small>
						 	</div>
						 </div>
						 <div className="request-action">
						 	<button>Accept</button>
						 	<button>Decline</button>
						 </div>
						</div>

						<div className="request">
						 <div className="request-profile">
						 	<img src="https://cdn.pixabay.com/photo/2022/02/14/08/53/woman-7012726_960_720.jpg" alt="avatar" />
						 	<div className="profile-text">
						 		<span>Erwan</span>
						 		<small>110k Friends</small>
						 	</div>
						 </div>
						 <div className="request-action">
						 	<button>Accept</button>
						 	<button>Decline</button>
						 </div>
						</div>

						<div className="request">
						 <div className="request-profile">
						 	<img src="https://cdn.pixabay.com/photo/2022/02/14/08/53/woman-7012726_960_720.jpg" alt="avatar" />
						 	<div className="profile-text">
						 		<span>Erwan</span>
						 		<small>110k Friends</small>
						 	</div>
						 </div>
						 <div className="request-action">
						 	<button>Accept</button>
						 	<button>Decline</button>
						 </div>
						</div>

						<div className="request">
						 <div className="request-profile">
						 	<img src="https://cdn.pixabay.com/photo/2022/02/14/08/53/woman-7012726_960_720.jpg" alt="avatar" />
						 	<div className="profile-text">
						 		<span>Erwan</span>
						 		<small>110k Friends</small>
						 	</div>
						 </div>
						 <div className="request-action">
						 	<button>Accept</button>
						 	<button>Decline</button>
						 </div>
						</div>
						
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
});
export default connect(mapStateToProps,null)(withRouter(index))