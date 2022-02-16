
import "react-toastify/dist/ReactToastify.css"
import Home from './components/Home';
import {Route, BrowserRouter,Switch,Redirect } from 'react-router-dom';
//import SingIn from './components/SigninJs';
import Login from './components/Login'
import CreataccountCard from './components/CreatUser';
import Messenger from './components/Messenger';
import Shop from './components/shop/Home';

import { useContext } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

export default function App() {
  const user = useSelector((state) => state.user.currentUser);

  return (
   <BrowserRouter>
      <ToastContainer />
      <Switch>
        <Route exact path="/">
          { user ? <Redirect to="/home" /> : <Login />}
        </Route>
        <Route path="/home">{!user ? <Redirect to="/" /> : <Home />}</Route>
        <Route exact path={`/messenger/:id`} component={Messenger} />
        <Route path={`/shop/:id`} component={Shop} />
        <Route path="/CreatUser" component={CreataccountCard} />
      </Switch>
    </BrowserRouter>
  );
}