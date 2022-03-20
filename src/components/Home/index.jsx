import React from 'react'
import { Home,People,List,Image,PlayCircleOutline,Settings,LocalMall,Forum,
        WbSunny,Menu,Search,Brightness4,Notifications,Mail,Person,ExitToApp,ArrowRight,
        ArrowLeft,Lock,Brightness2 } from '@material-ui/icons';
import { connect } from "react-redux";
import { Route,Switch,withRouter,Link } from 'react-router-dom';
import { publicRequest,userRequest } from '../../requestMethods';
import	Principal from '../Principal'
import Profile from '../Profile'
import Messenger from '../Messenger'
import Shop from '../shop/Drawer';
import { useQuery } from "react-query";
import _ from 'lodash';
import './style.css'

function Query(props) {
  return (props.children(useQuery(props.keyName, props.fn, props.options)));
}


export class index extends React.Component {
	constructor(props){
		super(props);
		this.defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		this.state={
			theme: '',
			profile:[],
			friends: [],
	    profiles: [],
	    user: [],
	    friend:{},
	    conversation: false,
	    messages: [],
	    private_message:[],
	    open: false,
	    checked: false,
	    theme: '',
		};


	}



  preferedTheme = () =>{
	  	if (this.defaultDark){
	  		this.setState({theme: 'dark'})
	  	}
  	}

  getMessage = async(id) =>{
  	let data = await publicRequest.get('userapp/message/')
  	.then(({data}) => data)
    this.setState({messages: _.sortBy(data.results, "id")})
    //await this.state.messages.filter(item=> (item.sender === parseInt(id, 10) && item.receiver=== parseInt(this.id, 10)) || (item.receiver === parseInt(id, 10) && item.sender=== parseInt(this.id, 10))).map(checked=>(this.setState({private_message:checked})))
    await this.state.messages && this.state.messages.map((item) =>{
    	if ((item.sender === parseInt(id, 10) && item.receiver=== parseInt(this.props.user.id, 10)) || (item.receiver === parseInt(id, 10) && item.sender=== parseInt(this.props.user.id, 10))){
    		this.setState({private_message:this.state.private_message.concat(item)})
    	}
    })
  };

	styleElement = () =>{
		let toggle = document.querySelector('.toggles')
		let navigation = document.querySelector('.navigations')
		let main = document.querySelector('.mains')

		navigation.classList.toggle('active')
		main.classList.toggle('active')
	}

  getCurrent = async() =>{
		let data;
		await publicRequest.get(`userapp/users/${this.props.user.id}`).then((res) => (data = res.data))
		return data;
	}



  

  getUser = async() =>{
    let data = await publicRequest.get('userapp/users/')
    .then(({data}) => data)
    this.setState({profiles: data})
  };

  getFriend = async() =>{
    let data = await publicRequest.get('userapp/friend/')
    .then(({data}) => data)
    this.setState({friends: data})
  };

  logout = () => {
    localStorage.clear()
    window.location.reload(false);
  };

  openBox = () =>{
  	this.setState({open: !this.state.open})
  }

  componentDidMount(){
	  	this.preferedTheme()
	  	this.getUser()
    	this.getFriend()
	 };
	render() {
		return (
			<div className="home" data-theme={this.state.theme}>
				<div className="navigations">
					<ul>
						<li>
							<Link to={this.props.match.url} className="link">
								<div className="ahref">
									<span className="icon"><Home /></span>
									<span className="title"> WanWork</span>
								</div>
							</Link>
						</li>
						<li>
							<div className="ahref">
								<span className="icon"><People /></span>
								<span className="title"> Friends</span>
							</div>
						</li>
						<li>
							<div className="ahref">
								<span className="icon"><List /></span>
								<span className="title"> Lists</span>
							</div>
						</li>
						<li>
							<div className="ahref">
								<span className="icon"><Image /></span>
								<span className="title"> Image Gallery</span>
							</div>
						</li>
						<li>
							<div className="ahref" onClick={this.teste}>
								<span className="icon"><PlayCircleOutline /></span>
								<span className="title"> Videos</span>
							</div>
						</li>
						<li>
							<Link to={'/shop'} className="link">
								<div className="ahref">
									<span className="icon"><LocalMall /></span>
									<span className="title"> Shop</span>
								</div>
							</Link>
						</li>
						<li>
							<Link exact to={'/messenger'} className="link">
								<div className="ahref">
									<span className="icon"><Forum /></span>
									<span className="title"> Messenger</span>
								</div>
							</Link>
						</li>
						<li>
							<div className="ahref">
								<span className="icon"><WbSunny /></span>
								<span className="title"> Weather</span>
							</div>
						</li>
						<li>
							<Link to={'/settings'} className="link">
								<div className="ahref">
									<span className="icon"><Settings /></span>
									<span className="title"> Settings</span>
								</div>
							</Link>
						</li>
					</ul>
				</div>

				<div className="mains">
					<Switch>
	          <Route exact path='/'>
	              <Principal styleElement={this.styleElement}/>
	         	</Route>
	         	<Route exact path='/messenger'>
	              <Messenger styleElement={this.styleElement}/>
	         	</Route>
	         	<Route path='/shop'>
	              <Shop styleElement={this.styleElement}/>
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