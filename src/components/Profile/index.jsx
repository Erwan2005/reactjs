import React from 'react'
import { connect } from "react-redux";
import { Route,Switch,withRouter,Link } from 'react-router-dom';
import { publicRequest,userRequest } from '../../requestMethods';
import Info from '../Info'
import './style.css'
export class index extends React.Component {
	constructor(props){
		super(props);
		this.state={
			friends: [],
	    	profile: {},
		};
	}

	getProfile = async() =>{
		let data = await publicRequest.get(`userapp/users/${this.props.match.params.id}`)
		.then(({data}) => data)
		this.setState({profile: data})
	}

	getFriend = async() =>{
		let data = await publicRequest.get('userapp/friend/')
		.then(({data}) => data)
		this.setState({friends: data})
	}

	checkFriend = (userId,friendId) =>{
	    if (this.state.friends.filter(item=> item.user == userId && item.friend == friendId).length == 0)
	      return false
	    else return true
	};

	componentDidMount(){
	  	this.getProfile()
	  	this.getFriend()
	  	
	 };
	render() {
		return (
			<div className="profiles">
				<div className="image-to">
					<div className="action">
						<span>@{this.state.profile.username}</span>
						<div>
							<small>11k Friends</small>
							<small>11k Followers</small>
						</div>
						{this.props.match.params.id == this.props.user.id ? null : (
							this.checkFriend(this.props.user.id,this.props.match.params.id) ? <button>Message</button> : <button>Add friend</button>
						)}
						
						<button>Follow</button>
					</div>
					<img src={this.state.profile.img_covert} alt="mur" />
					<img src={this.state.profile.avatar} alt="avatar" />
				</div>
				<div className="details">
					<ul>
						<li><Link to={this.props.match.url} className="link">Info</Link></li>
						<li>Photo</li>
						<li>Videos</li>
						<li>Friends</li>
						<li>Followers</li>
					</ul>
					<div className="info">
						<Switch>
			              <Route exact path={this.props.match.url}>
			                <Info />
			              </Route>
			            </Switch>
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