import React,{ useContext } from "react";
import { Fab,makeStyles,
        Tooltip,
        Modal,
        Container, 
        TextField,
        Button,
        MenuItem,
        IconButton,
        Snackbar,CardMedia } from '@material-ui/core';
import { Add as AddIcon,Image,Theaters } from '@material-ui/icons';
import { Alert as MuiAlert } from '@material-ui/lab/';
import { useRef,useState } from 'react';
import {useCookies} from 'react-cookie';
import APIService from '../APIService';

import { AuthContext } from "../context/AuthContext";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  fab:{
    position: "fixed",
    bottom: 20,
    right: 20,
  },
  container:{
    width: 500,
    height: 570,
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: "auto",
    borderRadius: 8,
    [theme.breakpoints.down("xs")]:{
      width: "100vw",
      height: "100vh",
      overflowY: "auto",
      borderRadius: 0,
    },
  },
  form:{
    padding: theme.spacing(1),
  },
  item:{
    marginBottom: theme.spacing(1),
  },
  media:{
    height: 250,
    position: 'relative',
    top: theme.spacing(0),
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down("sm")]:{
      height: 150,
    },
  },
}));
export default function Add(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const inputFile = useRef(null);
  const [img, setImg] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [visibility, setVisibility] = useState('public');
  const { user } = useContext(AuthContext);
  const current = user;

  const imageHandler = async (e) => {

      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          setImg(reader.result)
        }
      }
      reader.readAsDataURL(e.target.files[0])
      const file = e.target.files[0];
      const base64 = await convertBase64(file);
      setImg(base64)
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

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  const insertPublication = () => {
        var user = parseInt(current.id, 10)
        var image = img.replace("data:", "").replace(/^.+,/, "");
        
        APIService.InsertPublication({user, title, message, visibility, image}, current.token)
        setOpenAlert(true)
    };

  return (
    <>
      <Tooltip title="Add" arial-label="add" onClick={() => setOpen(true)}>
        <Fab color="primary" className={classes.fab}>
          <AddIcon />
        </Fab>
      </Tooltip>

      <Modal open={open}>
        <Container className={classes.container}>
          <form className={classes.form} autoComplete="off">
            <div className={classes.item}>
              <TextField
                      id="publication"
                      style={{ margin: 8 }}
                      placeholder="Title ..."
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value = {title}
                      onChange = {e => setTitle(e.target.value)}
                  />
            </div>
            <div className={classes.item}>
              <TextField
                      id="publication"
                      variant= "outlined"
                      rows={4}
                      style={{ margin: 8 }}
                      placeholder="Description ..."
                      label="Description"
                      size="small"
                      fullWidth
                      multiline
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value = {message}
                      onChange = {e => setMessage(e.target.value)}
                  />
            </div>

            <div className={classes.item}>
              <TextField select label="Visibility" value="public" onChange={e => setVisibility(e.target.value)}>
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="friend">Fiends</MenuItem>
                <MenuItem value="private">Private</MenuItem>
              </TextField>
              <input type='file' id='file-img' onChange={(e) => {
                imageHandler(e);
              }} ref={inputFile} style={{display: 'none'}}/>
              <IconButton 
                onClick={(event) => {
                event.preventDefault();
                inputFile.current.click();
                }}
              >
                 <Image />
              </IconButton>
              <IconButton>
                 <Theaters />
              </IconButton>
            </div>
            <CardMedia className={classes.media} image={img} />
            <div className={classes.item} style={{bottom:1,right:1}}>
              <Button variant="outlined" color="primary" style={{marginRight:20}} onClick={insertPublication}>
              Create
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => setOpen(false)}>
              Cancel
              </Button>
            </div>
          </form>
        </Container>
      </Modal>
      <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Alert onClose={handleClose} severity="success">
          Succefully published !
        </Alert>
      </Snackbar>
    </>
  );
}