import React,{ useState,useEffect,useContext } from 'react';
import { AppBar,makeStyles, Toolbar, Typography,InputBase,alpha,Badge,Avatar,IconButton,Box} from '@material-ui/core';
import { Mail,Notifications,Search,Cancel,Person,ExitToApp,PersonAdd,HighlightOff,Group } from '@material-ui/icons';
import { useSelector } from "react-redux";
import BoxMessage from './BoxMessage';
import axios from 'axios';
import apiService from '../APIService';

const useStyles = makeStyles((theme) => ({
  LogoLg:{
    display: "none",
    [theme.breakpoints.up("sm")]:{
      display: "block"
    }
  },
  LogoSm:{
    display: "block",
    [theme.breakpoints.up("sm")]:{
      display: "none"
    }
  },
  toolbar:{
    display: "flex",
    justifyContent: "space-between"
  },
  search:{
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(.3),
    paddingLeft: theme.spacing(1),
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    borderRadius: theme.spacing(1),
    width: "40%",
    [theme.breakpoints.down("xs")]:{
      display: (props) => props.open ? "flex" : "none",
      width : "70%",
    }
  },
  input:{
    color: "white",
    marginLeft: theme.spacing(1),
    width: "90%",
  },
  cancel:{
    [theme.breakpoints.up("sm")]:{
      display: "none",
    },
  },
  searchbtn:{
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]:{
      display: "none",
    }
  },
  icons:{
    alignItems: "center",
    display: (props) => props.open ? "none" : "flex",

  },
  badge:{
    margin: theme.spacing(1),
  },
  avatar:{
    marginRight: theme.spacing(1),
  },
  item:{
    spacing: 0,
  },
  title:{
    textDecoration: "none",
    color: "#848484",
    textTransform: 'none',
  },
  second:{
    textDecoration: "none",
    color: "#848484",
    textTransform: 'none',
    fontSize: 13,
  },

  menu:{
    position: 'fixed',
    minWidth: theme.spacing(30),
    top: '66px',
    right: 0,
    
    overflowY:'scroll',
    zIndex: 1,
    [theme.breakpoints.down("xs")]:{
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      top: '56px',
      right: 0,
      zIndex: 1,
    }
  },
  menuItem:{
    padding: '10px',
    marginBottom: '5px',
    alignItems: 'center',
    
    background: "#666666",
    borderRadius: theme.spacing(1),
    [theme.breakpoints.down("xs")]:{
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    }
  },

  menuItemChild:{
    display: 'flex',
    marginBottom: '5px',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px',
    textTransform: 'capitalize',
    cursor: 'pointer',
    "&:hover": {
      background: '#717171',
    },
    [theme.breakpoints.down("xs")]:{
      marginRight: '25px',
      "&:hover": {
        background: '#717171',
      },
    }
  },

  itmes:{
    marginLeft: '5px',
  },
  friendMob:{
    display: "none",
    [theme.breakpoints.down("sm")]:{
      display: 'flex',
    }
  },
}));
export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [openF, setOpenF] = useState(false);
  const [openM, setOpenM] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [type, setType] = useState('');
  const [request, setRequest] = useState([]);
  const classes = useStyles({ open });
  const [current, setCurrent] = useState([]);
  const [invisible, setInvisible] = useState(false);
  const [invisibleM, setInvisibleM] = useState(false);


  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    fetch(apiService.url+`users/${user.id}/`, {
      'method':'GET',
      headers: {
        'Content-Type':'application/json',
      }
    })
    .then(resp => resp.json())
    .then(resp => {
      setCurrent(resp)
      if(resp.friendRequests === 0){
        setInvisible(true)
      }
      if(resp.message_nbr === 0){
        setInvisibleM(true)
      }

    })
    .catch(error => console.log(error))

  }, [user.id])

  useEffect(() => {
    fetch(apiService.url+`users/`, {
      'method':'GET',
      headers: {
        'Content-Type':'application/json',
      }
    })
    .then(resp => resp.json())
    .then(resp => {
      setUsers(resp)
    })
    .catch(error => console.log(error))

  }, [])

  useEffect(() => {
    fetch(apiService.url+`friendrequest/`, {
      'method':'GET',
      headers: {
        'Content-Type':'application/json',
      }
    })
    .then(resp => resp.json())
    .then(resp => {
      setRequest(resp)
    })
    .catch(error => console.log(error))

  }, [])

  const logout = () => {
    localStorage.clear()
    window.location.reload(false);


  };

  const frienRequest = (type) =>{
    setOpenM(!openM)
    if (type === 1){
      setInvisible(true)
    }else if (type === 2){
      setInvisibleM(true)
    }
    setType(type)
  };

  const dltRequest = async(id) =>{
    let data = await axios.delete(apiService.url+`friendrequest/${id}`)
    .then(({data}) => data)
    setRequest([...request,data])
  };

  const getMesnotRead = async() =>{
    let data = await axios.get(apiService.url+'message/')
    .then(({data}) => data)
    setMessages(data.results)
  };

  useEffect(() => {
    getMesnotRead()
  }, [])

  const patchMessage = async(id)=>{
    await axios.patch(apiService.url+`message/${id}/`,{is_read:'True'})
  };

  const addFriend = async(current,friend,id) =>{
    const requestOne = axios.post(apiService.url+'friend/',{user:current,friend:friend});
    const requestTwo = axios.post(apiService.url+'friend/',{user:friend,friend:current});
    const requestThree = axios.delete(apiService.url+`friendrequest/${id}`);
    await axios.all([requestOne, requestTwo, requestThree]).then(axios.spread((...responses) => {
      console.log(responses[0])
      console.log(responses[1])
      console.log(responses[2])
    }))

  }

  return (
    <Box sx={{ flexGrow: 1, position: "relative" }}>
      <AppBar position="fixed" style={{backgroundColor: '#424242', boxShadow: 'none'}}>
          <Toolbar className={classes.toolbar}>
            <Typography variant="h6" className={classes.LogoLg}>
              Wanwork
            </Typography>
            <Typography variant="h6" className={classes.LogoSm}>
              Ww
            </Typography>
            <div className={classes.search}>
              <Search />
              <InputBase placeholder="Search..." className={classes.input}/>
              <Cancel className={classes.cancel} onClick={() => setOpen(false)} />
            </div>
            <div className={classes.icons}>
              <Search className={classes.searchbtn} onClick={() => setOpen(true)}/>
              <IconButton
                size="large"
                color="inherit"
                onClick={()=>frienRequest(1)}
                className={classes.friendMob}
              >
                <Group />
              </IconButton>
              <IconButton
                size="large"
                color="inherit"
                onClick={()=>frienRequest(1)}
              >
                <Badge badgeContent={current.friendRequests} color="secondary" invisible={invisible}>
                  <Person />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                color="inherit"
                onClick={()=>frienRequest(2)}
              >
                <Badge badgeContent={current.message_nbr} color="secondary" invisible={invisibleM}>
                  <Mail />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                color="inherit"
                onClick={()=>frienRequest(3)}
              >
                <Badge badgeContent={2} color="secondary">
                  <Notifications />
                </Badge>
              </IconButton>
              <div onClick={()=>frienRequest(4)} style={{cursor: 'pointer'}}>
                <Avatar src={current.avatar}/>
              </div>
            </div>
          </Toolbar>
      </AppBar>
      {openF && (
        <BoxMessage />
      )}

      {openM && (
        <div className={classes.menu}>
          <div className={classes.menuItem}>
            {(type===1) ? (
              request && request.map((receive) => {
                return(
                  <div key = {receive.id}>
                    {users && users.map((sender) => {
                      if (receive.receiver === user.id && receive.sender === sender.id){
                        return(
                          <div className={classes.menuItemChild} onClick={() => setOpenM(!openM)} key={sender.id}>
                            <div style={{display: 'flex'}}>
                              <Avatar src={sender.avatar}/>
                              <div className={classes.itmes}>
                                <Typography style={{fontSize: '16px',fontWeight: 'bold'}}>
                                  {sender.username}
                                </Typography>
                                <Typography style={{fontSize: '12px',}}>
                                  Manohisoa
                                </Typography>
                              </div>
                            </div>
                            <div style={{display: 'flex'}}>
                              <PersonAdd htmlColor="green" style={{cursor: 'pointer'}} onClick={() => addFriend(receive.receiver,receive.sender,receive.id)}/>
                              <HighlightOff htmlColor="tomato" style={{marginLeft: '5px',cursor: 'pointer'}} onClick={()=>dltRequest(receive.id)}/>
                            </div>
                          </div>
                        )}else return null
                    })}
                  </div>
                )
              })
              ) : (type===2) ? (
                messages && messages.map(mp =>{
                  return(
                    <div key={mp.id}>
                      {users && users.map(sender =>{
                        if((mp.receiver === user.id && mp.sender === sender.id) && mp.is_read === false){
                          return(
                            <div className={classes.menuItemChild} onClick={() => {setOpenM(!openM)
                            patchMessage(mp.id)}} key={sender.id}>
                              <div style={{display: 'flex',color: "#e5e5e5"}}>
                                <Avatar src={sender.avatar}/>
                                <div className={classes.itmes}>
                                  <Typography style={{fontSize: '16px',fontWeight: 'bold'}}>
                                    {sender.username}
                                  </Typography>
                                  <Typography style={{fontSize: '12px',}}>
                                    {mp.content}
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          )
                        }else return null
                      })}
                    </div>
                  )
                })


              ) : (type===3) ? (

                <div className={classes.menuItemChild} onClick={() => setOpenM(!openM)}>
                    <div style={{display: 'flex',color: "#e5e5e5"}}>
                      <Avatar />
                      <div className={classes.itmes}>
                        <Typography style={{fontSize: '16px',fontWeight: 'bold'}}>
                          Orthencia
                        </Typography>
                        <Typography style={{fontSize: '12px',}}>
                          Holla
                        </Typography>
                      </div>
                    </div>
                  </div>

              ) : (
                <div className={classes.menuItemChild} onClick={logout}>
                   <div style={{display: 'flex',color: "#e5e5e5"}}>
                      <ExitToApp />
                      <div className={classes.itmes}>
                        <Typography style={{fontSize: '16px',fontWeight: 'bold'}}>
                            Logout
                        </Typography>
                      </div>
                  </div>
                </div>
              )}  
          </div>
        </div>
      )}
    </Box>
  );
}