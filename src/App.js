
import "react-toastify/dist/ReactToastify.css"
import {Route, BrowserRouter,Switch,Redirect } from 'react-router-dom';
//import SingIn from './components/SigninJs';

import Settings from './components/Settings';
import Messenger from './components/Messenger';
import Home from './components/Home';
import User from './components/User'
import Shop from './components/shop/Home';
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevTools } from 'react-query/devtools'
import { useContext } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

export default function App() {
  const user = useSelector((state) => state.user.currentUser);
  const client = new QueryClient();
  return (
   <BrowserRouter>
      <QueryClientProvider client={client}>
        <Switch>
          <Route path="/">
            { user ? <Home /> : <User />}
          </Route>
        </Switch>
      </QueryClientProvider>
    </BrowserRouter>
  );
}