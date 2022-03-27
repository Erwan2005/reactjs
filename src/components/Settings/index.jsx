import React from 'react'
import { Home,Info,
        Security,Menu,Search,Notifications,Mail,Person,People
        } from '@material-ui/icons';
import { connect } from "react-redux";
import { Route,Switch,withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { publicRequest,userRequest } from '../../requestMethods';
import Friends from '../Friends';
import Password from '../Password';
import { useQuery } from "react-query";
import './style.css'

function Query(props) {
  return (props.children(useQuery(props.keyName, props.fn, props.options)));
}

export class index extends React.Component {
	constructor(props){
		super(props);
		
		this.state={
			theme: '',
			profile:[],
			friends: [],
	    profiles: [],
	    user: [],
	    friend:{},
	    open: false,
	    checked: false,
		};
	}

	getCurrent = async() =>{
		let data;
		await publicRequest.get(`userapp/users/${this.props.user.id}`).then((res) => (data = res.data))
		return data;
	}

	getCurrentUser = async() =>{
    let data = await publicRequest.get(`userapp/users/${this.props.user.id}/`)
    .then(({data}) => data)
    this.setState({profile: data})
    if(this.state.profile.theme[0] == ''){
		  	if (this.defaultDark){
		  		this.setState({theme: 'dark', checked: true})
		  	}
		  }else{
		  	if(this.state.profile.theme[0] == "dark"){
			  	this.setState({theme: this.state.profile.theme[0], checked: true})	
			  }else {
			  	this.setState({theme: this.state.profile.theme[0], checked: false})
			  }
		  }
  	};

  	componentDidMount(){
	  	this.getCurrentUser()
	 };
	render() {
		return (
			<div className="settings">
					<div className="topbars">
						<div className="toggles" onClick={this.props.styleElement}>
							<Menu className="themes"/>
						</div>
						<div className="main-right">
							<div className="badge">
							<div className="topbarStyle">
								<Query
										keyName="users"
										fn={() => this.getCurrent()}
									>
										{({ data, isLoading, error }) => {
		          				if (error) return <h1>Error</h1>;
		          				const events = data ?? []
		          				return(
		          						<>
														<Person/>
														{events.friendRequests ? <span>{events.friendRequests}</span> : null}
													</>
		          				)
		          			}}
									</Query>
								</div>
								</div>
							<div className="topbarStyle">
								<Notifications/>
							</div>

							<div className="topbarStyle">
								<Mail/>
							</div>
						</div>
					</div>
					<div className="centrals">
						<Switch>
				      <Route exact path={this.props.match.url}>
				        <Friends />
				      </Route>
				      <Route exact path={`${this.props.match.url}/password`}>
	              <Password/>
	         	</Route>
				    </Switch>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
});
export default connect(mapStateToProps,null)(withRouter(index))