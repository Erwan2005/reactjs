import React from 'react'
import { Route,Switch,withRouter } from "react-router";
import NavBar from '../NavBar'
import Products from '../Products'
import Details from '../Details'
import Cart from '../Cart'
import Add from '../Add'
import "./style.css"
export class index extends React.Component {
	render() {
		return (
			<div className="feed-box">
				<NavBar />
				<Switch>
					<Route exact path={this.props.match.url}>
						<Products />
					</Route>
					<Route exact path={`${this.props.match.url}/products/:id_prod`} component={Details} />
					<Route exact path={`${this.props.match.url}/cart`} component={Cart} />
					<Route exact path={`${this.props.match.url}/add`} component={Add} />
				</Switch>
				
			</div>
		)
	}
}

export default withRouter(index)