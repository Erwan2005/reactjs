import React,{ useEffect,useState } from 'react';
import { Container,makeStyles } from '@material-ui/core';
import Post from './Post';
import CardP from './Cardprofiles';
//import Add from './Add';
import News from './News';
import Settings from './Settings';

import { Route,Switch,useRouteMatch } from 'react-router-dom';
import { useContext } from "react";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
  },
}));
export default function Feed() {
  const classes = useStyles();
  const [publication,setPublication] = useState([]);
  const user = useSelector((state) => state.user.currentUser);
  let { path } = useRouteMatch();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/userapp/publication/`,{
      'method':'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':`Token ${user.token}` 
      }
    })
    .then(resp => resp.json())
    .then(resp => setPublication(resp))
    .catch(error => console.log(error))

  }, [user.token]);

  const insertedPublication = (publi) => {
    const new_publition = [...publication, publi]
    setPublication(new_publition)

  }

  return (
    <Container className={classes.container}>
      <div>
          <Switch>
              <Route exact path="/home">
                <Post publication = {publication} insertedPublication = {insertedPublication}/>
              </Route>
              <Route exact path={`${path}/profile/:id`} component={CardP} />
              <Route exact path={`${path}/settings/`} component={Settings} />
              <Route exact path={`${path}/news`} component={News} />
          </Switch>

      </div>
    </Container>
  );
}