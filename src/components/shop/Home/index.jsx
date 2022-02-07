import React, { useState,useEffect, useRef } from 'react';
import {
  Avatar,
  Badge,
} from "@material-ui/core";
import { Notifications,
		 EnhancedEncryption,
		 Category,
		 Settings,Home,Menu,
		 ShoppingCart,ArrowDropDown,
		 ArrowRight,ArrowLeft,
		 FlashOn,Search } from "@material-ui/icons";
import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import { Route,Switch,withRouter } from "react-router";
import axios from 'axios';
import apiService from '../../../APIService';
import { connect } from "react-redux";
import Products from '../Products'
import Details from '../Details'
import Cart from '../Cart'
import './style.css'

function Navbar(props) {
  return (
    <nav className="navbar">
    	<div className="logo">
    		<a href={props.home}>Wanwork</a>
    	</div>
    	<div className="search">
    		<Search />
    		<input type="text" placeholder="search ..." onChange={props.search}/>
    	</div>
      <ul className="navbar-nav">{props.children}</ul>
    </nav>
  );
}

function NavItem(props) {
  const [open, setOpen] = useState(false);

  return (
    <li className="nav-item">
      <a href={props.cart} className="icon-button" onClick={() => setOpen(!open)}>
        {props.icon}
      </a>

      {open && props.children}
    </li>
  );
}

function DropdownMenu() {
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
  }, [])

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function DropdownItem(props) {
    return (
      <a href="#" className="menu-item" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  return (
    <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>

      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem leftIcon={<EnhancedEncryption />}>Add product</DropdownItem>
          <DropdownItem
            leftIcon={<Settings />}
            rightIcon={<ArrowRight />}
            goToMenu="settings">
            Settings
          </DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'settings'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowLeft />}>
            <h2>My Settings</h2>
          </DropdownItem>
          <DropdownItem leftIcon={<Category />}>Manage products</DropdownItem>
          <DropdownItem leftIcon={<Settings />}>Seller Settings</DropdownItem>
        </div>
      </CSSTransition>
    </div>
  );
}

export class index extends React.Component {
	constructor(props){
		super(props);
		this.state={
			profile:[],
			search: "",
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
			<>
				<Navbar home ="/Home" search={e => this.setState({search:e.target.value})}>
					
					<NavItem  icon={
            <Badge badgeContent={this.props.quantity} color="secondary">
              <ShoppingCart />
            </Badge>} cart={`${this.props.match.url}/cart`}> </NavItem>
					
					<NavItem icon={<Notifications/>}></NavItem>
					<NavItem icon={<Avatar src={this.state.profile.avatar}/>}>
						<DropdownMenu></DropdownMenu>
					</NavItem>
				</Navbar>
				<Switch>
					<Route exact path={this.props.match.url}>
						<Products />
					</Route>
					<Route exact path={`${this.props.match.url}/products/:id_prod`} component={Details} />
					<Route exact path={`${this.props.match.url}/cart`} component={Cart} />
					
				</Switch>
			</>
		)
	}
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
  quantity: state.cart.quantity,
});

export default connect(mapStateToProps)(withRouter(index))