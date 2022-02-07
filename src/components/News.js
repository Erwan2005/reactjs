import { Container,makeStyles } from '@material-ui/core';
import React,{ useEffect,useState } from 'react';

const useStyles = makeStyles((theme) => ({
}));
export default function Feed() {
  const classes = useStyles();
  const [news,setNews] = useState([]);
  useEffect(() => {
    fetch(`https://newsapi.org/v2/everything?q=apple&from=2021-09-18&to=2021-09-18&sortBy=popularity&apiKey=ca3fc9be88c84295b939a75ee380c14c`,{
      'method':'GET',
      headers: {
        'Content-Type':'application/json',
      }
    })
    .then(resp => resp.json())
    .then(resp => setNews(resp.data))
    .catch(error => console.log(error))

  }, []);

  return (
    <Container className={classes.container}>
      <div>
          <p> News</p>
      </div>
    </Container>
  );
}