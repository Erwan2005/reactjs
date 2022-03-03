import React,{useState, useRef,useEffect } from 'react';
import { Typography,makeStyles,CardMedia
        ,Avatar,Badge,IconButton
        ,Grid,Button,TextField
        ,Tab,Tabs,Box,useTheme,AppBar } from '@material-ui/core';
import { CameraAlt,Edit } from '@material-ui/icons';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import Friend from './Friend';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}


const useStyles = makeStyles((theme) => ({
  container:{
    display: "flex",
    height: '100%',
    
  },
  media:{
    height: 250,
    borderTopLeftRadius:theme.spacing(2),
    borderTopRightRadius:theme.spacing(2),
    [theme.breakpoints.down("sm")]:{
      height: 150,
    },
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    top: theme.spacing(-10),
    border: `2px solid ${theme.palette.background.paper}`,
    [theme.breakpoints.down("sm")]:{
      width: theme.spacing(10),
      height: theme.spacing(10),
      top: theme.spacing(-5),
    },
  },
  iconBtn: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    top: theme.spacing(-11),
    border: `2px solid ${theme.palette.background.paper}`,
    background: theme.palette.background.paper,
    "&:hover": {
          background: theme.palette.background.paper,
    },
    [theme.breakpoints.down("sm")]:{
      top: theme.spacing(-6),
    },
  },
  iconBtn2: {
    top: theme.spacing(-38),
    [theme.breakpoints.down("sm")]:{
      top: theme.spacing(-21),
    },
  },
  item:{
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(0),
    [theme.breakpoints.up("sm")]:{
      marginTop: theme.spacing(1),
    },
  },
  icon:{
    marginRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]:{
      fontSize: "18px",
    },
  },

  text:{
    fontWeight: 500,
  },
  appbar:{
    background: "#424242",
    color: "#848484",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    boxShadow: "none",
    borderBottom: "1px solid #A9A9A9"
  },
  tab:{
    backgroundColor: "#424242",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    miwHeight: '500px',
  },
}));

export default function CardProfile() {
  const classes = useStyles();
  const inputFile = useRef(null);
  const inputFile2 = useRef(null);
  const [avatar, setAvatar] = useState('/broken-image.jpg')
  const [img_covert, setImg_covert] = useState('https://material-ui.com/static/images/cards/paella.jpg');
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [first_name, setFirst_name] = useState('')
  const [last_name, setLast_name] = useState('')
  const [about_me, setAbout_me] = useState('')
  const [address, setAddress] = useState('')
  const { user } = useContext(AuthContext);
  //const [user, setUser] = useState([]);

  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const imageHandler = async (e) => {

      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          setAvatar(reader.result)
        }
      }
      reader.readAsDataURL(e.target.files[0])
      const file = e.target.files[0];
      const base64 = await convertBase64(file);
      setAvatar(base64)
    };

  const imageCover = async (e) => {

      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          setImg_covert(reader.result)
        }
      }
      reader.readAsDataURL(e.target.files[0])
      const fileCov = e.target.files[0];
      const base64 = await convertBase64(fileCov);
      setImg_covert(base64)
    };

  const convertBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    };
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/userapp/users/${user.id}/`, {
      'method':'GET',
      headers: {
        'Content-Type':'application/json',
      }
    })
    .then(resp => resp.json())
    .then(resp => {
      setUsername(resp.username)
      setAvatar(resp.avatar)
      setImg_covert(resp.img_covert)
      setEmail(resp.email)
      setFirst_name(resp.first_name)
      setLast_name(resp.last_name)
      setAddress(resp.address)
      setAbout_me(resp.about_me)})
    .catch(error => console.log(error))

  }, [user])

  return (
      <>
        <CardMedia className={classes.media} image={img_covert} />
        <IconButton
          edge="end"
          className={classes.iconBtn2}
          onClick={(event) => {
            event.preventDefault();
            inputFile2.current.click();
          }}
        >
          <Edit />
        </IconButton>
        <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            badgeContent={
              <IconButton
                edge="end"
                className={classes.iconBtn}
                onClick={(event) => {
                event.preventDefault();
                inputFile.current.click();
                }}
               >
                <CameraAlt />
              </IconButton>
            }
          >
            <Avatar src={avatar} className={classes.large} />
        </Badge>
        
          <Grid container component="main">
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <AppBar position="static" className={classes.appbar}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="secondary"
                  textColor="inherit"
                  variant="scrollable"
                  scrollButtons="auto"

                  allowScrollButtonsMobile
                >
                  <Tab label="Profile" {...a11yProps(0)} style={{textTransform: 'none'}}/>
                  <Tab label="Friends" {...a11yProps(1)} style={{textTransform: 'none'}}/>
                  <Tab label="Following" {...a11yProps(2)} style={{textTransform: 'none'}}/>
                  <Tab label="Followers" {...a11yProps(3)} style={{textTransform: 'none'}}/>
                </Tabs>
              </AppBar>
              <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
              >
                <TabPanel value={value} index={0} dir={theme.direction} className={classes.tab}>
                  <form noValidate>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="username"
                          label="Username"
                          name="username"
                          value = {username}
                          onChange = {e => setUsername(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          value = {email}
                          onChange = {e => setEmail(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="firstName"
                          variant="outlined"
                          fullWidth
                          id="firstName"
                          label="First Name"
                          autoFocus
                          value = {first_name}
                          onChange = {e => setFirst_name(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="lastName"
                          label="Last Name"
                          name="lastName"
                          autoFocus
                          value = {last_name}
                          onChange = {e => setLast_name(e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          name="adresse"
                          variant="outlined"
                          fullWidth
                          id="adresse"
                          label="Adresse"
                          autoFocus
                          value = {address}
                          onChange = {e => setAddress(e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          maxRows = "3"
                          multiline
                          fullWidth
                          id="aboutme"
                          label="About me"
                          name="aboutme"
                          value = {about_me}
                          onChange = {e => setAbout_me(e.target.value)}
                        />
                      </Grid>
                    </Grid>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      style={{marginTop: 10}}
                      //onClick = {registerBtn}
                    >
                      Update
                    </Button>
                    
                  </form>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction} className={classes.tab}>
                  <Friend />
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction} className={classes.tab}>
                  Item Three
                </TabPanel>
              </SwipeableViews>
            </Box>
          </Grid>
        <input type="file" accept="image/*" name="image-upload" id="input" ref={inputFile} style={{display: 'none'}}
            onChange={imageHandler}
          />
        <input type="file" accept="image/*" name="image-upload" id="input" ref={inputFile2} style={{display: 'none'}}
            onChange={imageCover}
          />
      </>
  );
}
