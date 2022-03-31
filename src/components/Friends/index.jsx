import React from 'react'
import { Search } from '@material-ui/icons';
import { connect } from "react-redux";
import { Route,Switch,withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { publicRequest,userRequest } from '../../requestMethods';
import NumericLabel from 'react-pretty-numbers';
import { useQuery } from "react-query";
import Table from '../Table'
import axios from "axios";
import './style.css'

function Query(props) {
  return (props.children(useQuery(props.keyName, props.fn, props.options)));
}

export class index extends React.Component {
	constructor(props){
		super(props);
		
		this.state={
			friends: [],
	    	profiles: [],
		};
	}

	friends = async() =>{
		let data
		await userRequest.get('userapp/friendrequest/').then(resp => (data=resp.data))
		return data
	}

	dltRequest = async(id) =>{
    let data = await userRequest.delete(`userapp/friendrequest/${id}`)
    .then(({data}) => data)
  };
	getFriends = async() =>{
		await userRequest.get('userapp/friend/')
		.then(resp => {this.setState({friends: resp.data})})

		await userRequest.get('userapp/users/')
		.then(resp => {this.setState({profiles: resp.data})})

		console.log(this.state.friends)
	}

	addFriend = async(friend,id) =>{
    await userRequest.post('userapp/friend/',{user:this.props.user.id,friend:friend}).then(resp => (console.log(resp)));
    await userRequest.post('userapp/friend/',{user:friend,friend:this.props.user.id}).then(resp => (console.log(resp)));
    await userRequest.delete(`userapp/friendrequest/${id}`).then(resp => (console.log(resp)));
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
							<Table />
						</div>
						<div className="right">
							<div className="top">
								<div className="profile-container">
									<div className="profile-left">
										<img src="https://cdn.pixabay.com/photo/2022/02/14/08/53/woman-7012726_960_720.jpg" alt="avatar" />
									 	<div className="profile-text">
									 		<span>Erwan</span>
									 		<small>110k Friends</small>
									 	</div>
									</div>
									<span>Unblock</span>
								</div>
							</div>
							<div className="bottom">
								<Query
									keyName="friend"
									fn={() => this.friends()}
								>
									{({ data, isLoading, error }) => {
				          if (error) return <h1>Error</h1>;
				          const events = data ?? []
				          return(
				          	events.map((request) =>{
					          	return(
					          		this.state.profiles.map((sender) => {
					          			if (request.receiver === this.props.user.id && request.sender === sender.id){
					          				return(
															<div className="request" key={request.id}>
															 <div className="request-profile">
															 	<img src={sender.avatar} alt="avatar" />
															 	<div className="profile-text">
															 		<span>{sender.username}</span>
															 		<small><NumericLabel params={{shortFormat: true,}}>{sender.friend_nbr}</NumericLabel> Friends</small>
															 	</div>
															 </div>
															 <div className="request-action">
															 	<button onClick={() => this.addFriend(sender.id,request.id)}>Accept</button>
															 	<button onClick={()=>this.dltRequest(request.id)}>Decline</button>
															 </div>
															</div>
					          				)
					          			}else return null;
					          		})
												
					          	)

					          }) 	
				          )
				          }}
								</Query>
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