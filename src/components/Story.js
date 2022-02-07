import React from 'react'
import { withStyles,Divider,Fab,
		Tooltip } from '@material-ui/core';
import { Add } from '@material-ui/icons';
const useStyles = theme => ({
	container:{
    	backgroundColor: '#424242',
    	marginBottom: theme.spacing(1),
    	width: '130px',
    	height: '180px',
    	borderRadius: '15px',
    	alignItems: 'center',
    	position: 'relative',
    	[theme.breakpoints.down("xs")]:{
	     	width: '100px',
    		height: '150px',
	    },
	},
	profile:{
		
		height: '75%',
	},
	img:{
		height: '100%',
		width: '100%',
		borderTopLeftRadius: '20px',
		borderTopRightRadius: '20px',
	},
	fab:{
	    position: "absolute",
	    bottom: 18,
	    right: 20,
	    [theme.breakpoints.down("xs")]:{
	     	width: '40px',
    		height: '40px',
    		bottom: 15,
	    	right: 10,
	    },
	},
})
export class story extends React.Component {
	constructor(props){
    	super(props);
	}
	render() {
		const { classes } = this.props;
		return (
			<div className={classes.container}>
				<div className={classes.profile}>
					<img src={this.props.profile} className={classes.img}/>
				</div>
				<Divider />
				<Tooltip title="Add storie" arial-label="add">
			        <Fab color="green" className={classes.fab}>
			          <Add />
			        </Fab>
			     </Tooltip>
				<div className={classes.text}>
					Storie
				</div>
			</div>
		)
	}
}

export default withStyles(useStyles)(story)