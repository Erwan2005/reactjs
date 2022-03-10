import React from 'react'
import { Home,Info,
        Security,Menu,Search,Notifications,Mail,Person,People
        } from '@material-ui/icons';
import { connect } from "react-redux";
import { Route,Switch,withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { publicRequest,userRequest } from '../../requestMethods';
import Friends from '../Friends';
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

  	styleElement = () =>{
		let toggle = document.querySelector('.toggles')
		let navigation = document.querySelector('.navigations')
		let main = document.querySelector('.mains')

		navigation.classList.toggle('active')
		main.classList.toggle('active')
	}

  	componentDidMount(){
	  	this.getCurrentUser()
	 };
	render() {
		return (
			<div className="settings">
				<div className="navigations">
					<ul>
						<li>
							<Link to={'/Home'} className="link">
								<div className="ahref">
									<span className="icon"><Home /></span>
									<span className="title"> WanWork</span>
								</div>
							</Link>
						</li>
						<li>
							<Link to={this.props.match.url} className="link">
								<div className="ahref">
									<span className="icon"><People /></span>
									<span className="title"> Friends</span>
								</div>
							</Link>
						</li>
						<li>
							<div className="ahref">
								<span className="icon"><Person /></span>
								<span className="title"> Follows</span>
							</div>
						</li>
						<li>
							<div className="ahref" onClick={this.teste}>
								<span className="icon"><Info /></span>
								<span className="title"> Personnal info</span>
							</div>
						</li>
						<li>
							<Link exact to={`/shop/${this.props.user.id}`} className="link">
								<div className="ahref">
									<span className="icon"><Security /></span>
									<span className="title"> Security & privacy</span>
								</div>
							</Link>
						</li>
					</ul>
				</div>
				<div className="mains">
					<div className="topbars">
						<div className="toggles" onClick={this.styleElement}>
							<Menu className="themes"/>
						</div>
						<div className="main-right">
							<div className="topbarStyle">
								<Query
										keyName="users"
										fn={() => this.getCurrent()}
									>
										{({ data, isLoading, error }) => {
		          				if (error) return <h1>Error</h1>;
		          				const events = data ?? []
		          				return(
		          					<div className="badge">
													<Person/>
													<span>{events.friendRequests}</span>
												</div>
		          				)
		          			}}
									</Query>
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