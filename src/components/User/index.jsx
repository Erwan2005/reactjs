import React from 'react'
import {Route, Switch } from 'react-router-dom';
import Login from '../Login'
import Create from '../Create';
export class index extends React.Component {
	render() {
		return (
			<div>
				<Switch>
		          <Route exact path="/" component={Login} />
		          <Route exact path="/CreatUser" component={Create} />
		        </Switch>
			</div>
		)
	}
}

export default index