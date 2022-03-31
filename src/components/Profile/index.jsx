import React from 'react'
import { connect } from "react-redux";
import { Route,Switch,withRouter,Link } from 'react-router-dom';
import { publicRequest,userRequest } from '../../requestMethods';
import Info from '../Info'
import { useQuery } from "react-query";
import './style.css'

function Query(props) {
  return props.children(useQuery(props.keyName, props.fn, props.options));
}

export class index extends React.Component {
	constructor(props){
		super(props);
		this.state={
			friends: [],
	    current: {},
	    friend: {},
		};
	}

	getCurrent = async() =>{
		let data = await userRequest.get(`userapp/users/${this.props.match.params.id}`)
		.then(({data}) => data)
		this.setState({profile: data})
	}

	getFriends = async() =>{
		
	let data =	await userRequest.get(`userapp/users/${this.props.match.params.id}`).then(({data}) => data)
	this.setState({friend: data})
	}
	getFriend = async() =>{
		let data = await userRequest.get('userapp/friend/')
		.then(({data}) => data)
		this.setState({friends: data})
	}

	checkFriend = (userId,friendId) =>{
	    if (this.state.friends.filter(item=> item.user == this.props.user.id && item.friend == this.props.match.params.id).length == 0)
	      return false
	    else return true
	};

	sendRequest = async() =>{
   await userRequest.post('userapp/friendrequest/',
    ({sender:this.props.user.id,receiver:this.props.match.params.id})).then(res =>{
      console.log(res)
    })
  };

  componentDidMount(){
		this.getCurrent()
		this.getFriend()
		this.getFriends()
	};
	render() {
		return (
			<div className="profiles">
				<div className="image-to">
					<div className="action">
						<span>@{this.state.friend.username}</span>
						<div>
							<small>11k Friends</small>
							<small>11k Followers</small>
						</div>
						{this.props.match.params.id == this.props.user.id ? null : (
							this.checkFriend(this.props.user.id,this.props.match.params.id) ? <button>Message</button> : <button onClick={this.sendRequest}>Add friend</button>
						)}
										
						<button>Follow</button>
					</div>
					<Link to='/' className="link"><div className="return"><span>&#8592;</span></div></Link>
						<img src={this.state.friend.img_covert} alt="mur" />
						<img src={this.state.friend.avatar} alt="avatar" />
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