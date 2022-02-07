import React,{ useState,useEffect,useContext } from 'react';
import { makeStyles,Avatar,Typography,IconButton,Divider
		,Grid,InputBase,alpha, } from '@material-ui/core';
import { DeleteForever,Block,Search,FilterList } from '@material-ui/icons';

import { AuthContext } from "../context/AuthContext";
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
	base:{
		overflowY: 'auto',
		maxHeight: 200,
	},
	container:{
		display: 'flex',
		justifyContent: 'space-between',
		padding: theme.spacing(1)
	},
	item:{
		display: 'flex',
		color: '#696969',
	},
	search:{
	    display: "flex",
	    alignItems: "center",
	    padding: theme.spacing(0.5),
	    color: "#696969",
	    marginBottom: theme.spacing(1),
	    backgroundColor: alpha(theme.palette.common.white, 0.45),
	    '&:hover': {
	      backgroundColor: alpha(theme.palette.common.white, 0.65),
	    },
	    borderRadius: theme.spacing(2),
	    width: "100%",
	},
	input:{
		color: "#696969",
		marginRight: theme.spacing(0.5),
	},
	icon:{
		'&:hover': {
	      background: 'none',
	    },
	},

}));

export default function Friend() {
	const classes = useStyles();
	const [friends,setFriends] = useState([]);
	const [users,setUsers] = useState([]);

	const { user } = useContext(AuthContext);

	useEffect(() => {
	   	const requestOne = axios.get('http://127.0.0.1:8000/userapp/friend/');
    	const requestTwo = axios.get('http://127.0.0.1:8000/userapp/users/');
    	axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
	      	setFriends(responses[0].data)
	      	setUsers(responses[1].data)
	    }))
	    .catch(error => console.log(error))
	   },[]);
	return (
		<>
			
			<Grid container>
				<Grid item xs={12}>
					<div className={classes.search}>
						<IconButton size="small" className={classes.icon}>
							<Search style={{marginRight:3}} size="small"/>
						</IconButton>
						<InputBase placeholder="Search..." fullWidth className={classes.input}/>
						<IconButton size="small" className={classes.icon}>
							<FilterList size="small"/>
						</IconButton>
					</div>
				</Grid>
			</Grid>
			<div className={classes.base}>
				{friends && friends.map(friend =>{
					return(
						<div key={friend.id}>
							{users && users.map(profile =>{
								if (friend.user === user.id && friend.friend === profile.id){
									return(
										<div key={friend.id}>
											<div className={classes.container}>
												<div className={classes.item}>
													<Avatar src={profile.avatar}/>
													<Typography style={{marginLeft:5,textTransform: 'capitalize'}}>{profile.username}</Typography>
												</div>
												<div className={classes.item}>
													<IconButton size="small" className={classes.icon}>
														<DeleteForever color="secondary"size="small"/>
													</IconButton>
													<Divider orientation="vertical" flexItem />
													<IconButton size="small" className={classes.icon}>
														<Block color="warning" size="small"/>
													</IconButton>
												</div>
											</div>
											<Divider />
										</div>
									)
								}else return null
							})}
						</div>
					)
				})}
			</div>

		</>
	)
};