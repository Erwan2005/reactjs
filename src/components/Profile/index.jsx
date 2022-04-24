import React from 'react'
import { connect } from "react-redux";
import { Route,Switch,withRouter,Link } from 'react-router-dom';
import { publicRequest,userRequest } from '../../requestMethods';
import { Person,MenuBook,Room,Cake,Favorite,People,Email } from '@material-ui/icons';
import Info from '../Info'
import BoxMessage from '../Box'
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
	    friend: {},
	    box:false,
		};
		this.handleClose = this.handleClose.bind(this);
	}

	handleOpen = () =>{
		this.setState({box:!this.state.box})
	}

	handleClose=()=>{
		this.setState({box:!this.state.box})
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

	checkFriend = (friendId) =>{
	    if (this.state.friends.filter(item=> item.user === this.props.user.id && item.friend === this.props.match.params.id).length === 0)
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
		this.getFriend()
		this.getFriends()
	};
	render() {
		return (
			<div className="profiles">
				<div className="top">
					<div className="image">
						<img src={this.state.friend.img_covert} alt="mur" />
						<img src={this.state.friend.avatar} alt="avatar" />

					</div>
					<div className="about">
						<div className="name">
							<span>@{this.state.friend.username}</span>
							<small>11k friends</small>
						</div>
						<div className="button">
							{this.props.match.params.id === this.props.user.id ? null : (
								this.checkFriend(parseInt(this.props.match.params.id)) && <button onClick={this.sendRequest}>Add friend</button>
							)}
							<button onClick={this.handleOpen}><Email /></button>
						</div>
					</div>
					<div className="tab">
						<ul>
							<li>About</li>
							<li>Group</li>
							<li>Events</li>
							<div className="animation start"></div>
						</ul>
					</div>
				</div>
				<div className="bottom">
					<div className="left">
						<div className="grid">
							<div className="header">
								<span>About</span>
							</div>
							<div className="corp">
								<small>
									Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna
								</small>
							</div>
							<div className="info">
								<div className="data">
									<span><Person /></span>
									<div className="txt">
										<span>Name</span>
										<small>@{this.state.friend.username}</small>
									</div>
								</div>

								<div className="data">
									<span><Cake /></span>
									<div className="txt">
										<span> Date of Birth</span>
										<small>@Erwan</small>
									</div>
								</div>

								<div className="data">
									<span><Room /></span>
									<div className="txt">
										<span>Address</span>
										<small>@Erwan</small>
									</div>
								</div>

								<div className="data">
									<span><Favorite /></span>
									<div className="txt">
										<span>Relationship Status</span>
										<small>@Erwan</small>
									</div>
								</div>

								<div className="data">
									<span><MenuBook /></span>
									<div className="txt">
										<span>Page</span>
										<small>@Erwan</small>
									</div>
								</div>
								<div className="data">
									<span><People /></span>
									<div className="txt">
										<span>Group</span>
										<small>@Erwan</small>
									</div>
								</div>
							</div>
						</div>
						<div className="grid">
							<div className="header">
								<span>Photo</span>
								<small>See all</small>
							</div>
							<div className="images">
								<img src="https://cdn.pixabay.com/photo/2022/03/25/17/54/sakura-7091532_960_720.jpg" alt="" />
								<img src="https://cdn.pixabay.com/photo/2012/03/01/00/55/garden-19830_960_720.jpg" alt="" />
							</div>
						</div>
					</div>
					<div className="right">
						<div className="postCont">
						</div>
					</div>
				</div>
				{this.state.box &&
				<BoxMessage handleClose={this.handleClose} />}
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
});
export default connect(mapStateToProps,null)(withRouter(index))