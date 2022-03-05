import React from 'react'
import { Card,CardHeader,CardActionArea,
        CardMedia,CardContent,
        CardActions,Collapse,CircularProgress } from '@material-ui/core';
import { MoreVert,FavoriteBorder,Share,Telegram,PermMedia,Room,EmojiEmotions,Favorite,InsertComment } from '@material-ui/icons';
import { publicRequest,userRequest, BASE_URL } from '../../requestMethods';
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';
import NumericLabel from 'react-pretty-numbers';
import {format} from 'timeago.js';
import _ from 'lodash';
import './style.css'
export class index extends React.Component {
	constructor(props){
	    super(props);
	    this.refImg = React.createRef();
	    this.state={
	            expanded:false,
	            anchorElP: '',
	            comment: '',
	            share: '',
	            comments: [],
	            publication: [],
	            users: [],
	            current: [],
	            image: '',
	            liked: false,
	            like: [],
	            error: '',
	            page: 1,
	            more_exist: true,
	            end: false,
	            loading: false,
	        };
	};

	handleExpandClick = (id) => {
	    this.setState({ [`expanded_${id}`]:  _.isUndefined(this.state[`expanded_${id}`])?true:!this.state[`expanded_${id}`] });
	};

	imageHandler = async (e) => {

      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          this.setState({image:reader.result})
        }
      }
      reader.readAsDataURL(e.target.files[0])
      const file = e.target.files[0];
      const base64 = await this.convertBase64(file);
      this.setState({image:base64})
    };

  	convertBase64 = (file) => {
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

    getPub = async() =>{
    	try{
    		this.setState({loading: true})
			let data = await userRequest.get(`userapp/publication/?page=${this.state.page}`)
		   .then(({data})=> data)
		   this.setState({publication: this.state.publication.concat(data.results),loading:false})
		   if (data.next){
				this.setState({page: this.state.page + 1})
		   }else{
		   		this.setState({more_exist: false,end: true})
		   }
		   
    	}catch(error){
    		throw new Error(error);
    	}
	   
	  };
	getLike = async() =>{
	    let data = await publicRequest.get('userapp/like/')
	    .then(({data})=>data)
	    this.setState({like: data})
	  };

	getCom = async() =>{
	  		let data = await publicRequest.get('userapp/comment/')
	      	.then(({data}) => data)
	      	this.setState({comments: data})
	  };
	getUser = async() =>{
	    let data = await publicRequest.get('userapp/users/')
	    .then(({data}) => data)
	    this.setState({users: data})
	  };
	  getCurrentUser = async() =>{
	    let data = await publicRequest.get(`userapp/users/${this.props.user.id}/`)
		.then(({data}) => data)
	    this.setState({current: data})
	  };

	  btnComment = async(content,id_post) => {
	    let author = parseInt(this.props.user.id, 10)
	    let post_connected = parseInt(id_post, 10)
	    var contents = {content:content,author:author,post_connected:post_connected}
	    let data = await publicRequest.post('userapp/comment/',contents)
	    .then(({data}) => data)
	    this.setState({comments: this.state.comments.concat(data)})
	    this.setState({comment:''})

	    };

	  btnShare = async()=>{
	    let author = parseInt(this.props.user.id, 10)
	    var contents = {user:author,message: this.state.share,image:this.state.image}
	    await userRequest.post('userapp/publication/',contents)
		.then(res=>{
	      console.log(res)
	    })
	    this.setState({share:'',image:''})
	  };

	  checkLiked = (userId,postId) =>{
	    if (this.state.like.filter(item=> item.author === userId && item.post_connected === postId).length === 0)
	      return false
	    else return true
	  };

	  dlt =async(id)=>{
	    await publicRequest.delete(`userapp/like/${id}`)
	    this.getLike()
	  };

	  dltLike = (userId,postId)=>{
	    this.state.like.filter(item=> item.author === userId && item.post_connected === postId).map(cheked=>(this.dlt(cheked.id)))
	  };

	  postLike = async(author,post_connected) =>{
	    let data = await publicRequest.post('userapp/like/',{author,post_connected})
	    .then(({data})=>data)
	    this.setState({like: this.state.like.concat(data)})
	  };

	handleScroll = (e) => {
		const { offsetHeight, scrollTop, scrollHeight } = e.target;

		if (offsetHeight + scrollTop >= scrollHeight) {
			if(this.state.more_exist){
				this.getPub()
			}
		}
	}

	componentDidMount(){
		this.getCurrentUser()
	  	this.getPub()
	  	this.getCom()
	    this.getLike()
	    this.getUser()
	};
	render() {
		return (
			<div className="postCont" onScroll={this.handleScroll}>
				<div className="stories">
					<div className="storie-card">
						<img src={this.state.current.avatar} alt="avatar" />
						<button><span>&#43;</span></button>
					</div>

					<div className="storie-card-right">
						<img src="https://cdn.pixabay.com/photo/2022/02/12/13/29/desert-7008952_960_720.jpg" alt="" />
						<img src="https://cdn.pixabay.com/photo/2021/11/19/04/23/lotus-6808054_960_720.jpg" alt="" />
					</div>
				</div>
				<div className="share-post">
					<div className="top">
						<img src={this.state.current.avatar} alt="avatar" />
						<textarea type="text" placeholder="Type anything ..."
						value = {this.state.share}
		                onChange = {e => this.setState({share:e.target.value})}
		                ></textarea>
					</div>
					<div className="bottom">
						<div className="options">
			              	<div className="option" onClick={(event) => {
				                event.preventDefault();
				                this.refImg.current.click();
				                }}>
				                <PermMedia htmlColor="tomato" className="shareIcon"/>
				                <span className="shareOptionText">Photo / video</span>
				            </div>
				            <input type='file' id='file-img' onChange={(e) => {
				                this.imageHandler(e);
				              }} ref={this.refImg} style={{display: 'none'}}/>

				            <div className="option">
				                <Room htmlColor="green" className="shareIcon"/>
				                <span className="shareOptionText">Location</span>
				            </div>

				            <div className="option">
				                <EmojiEmotions htmlColor="goldenrod" className="shareIcon"/>
				                <span className="shareOptionText">Feellings</span>
				            </div>
				        </div>
				        <button onClick={this.btnShare}>Share</button>
					</div>
				</div>
				{this.state.publication && this.state.publication.map((pub) =>{
					return(
						<Card className="card">
							<CardHeader 
								className="cardHeader"
		                        avatar={
		                          <img src={BASE_URL+'media/'+pub.proprietary[0].avatar} alt="avatar"/>
		                        }
		                        action={
		                           <MoreVert/>
		                        }
		                        title={
		                        	<Link className="link" to={`${this.props.match.url}/profile/${pub.proprietary[0].id}`}>
		                          	<h3>{pub.proprietary[0].username}</h3>
		                          </Link>
		                        }
		                        subheader={<small>{format(pub.date)}</small>}
		                    />
		                    <img src={pub.image} alt="" />
							<CardContent>
								<h3>{pub.title}</h3>
								<h5>{pub.message}</h5>
							</CardContent>
							<CardActions className="card-action">
								<div className="item">
									{(this.checkLiked(this.state.current.id,pub.id)) ? (
			                            <Favorite className="icon" onClick={() => this.dltLike(this.props.user.id,pub.id)}/>
			                            ):(
			                            <FavoriteBorder className="icon" onClick={() => this.postLike(this.props.user.id,pub.id)}/>
			                          )
			                        }
									<small><NumericLabel params={{shortFormat: true,}}>{this.state.like.filter(item=> item.post_connected === pub.id).length}</NumericLabel></small>
								</div>
								<div className="item">
									<InsertComment className="icon" 
									onClick={() => this.handleExpandClick(pub.id)}
		                          aria-expanded={this.state[`expanded_${pub.id}`] || false}/>
									<small><NumericLabel params={{shortFormat: true,}}>{this.state.comments.filter(item=> item.post_connected === pub.id).length}</NumericLabel></small>
									<Share className="icon"/>
								</div>
							</CardActions>

							<Collapse in={this.state[`expanded_${pub.id}`] || false} timeout="auto" unmountOnExit>
								<CardContent>
									<div className="col-top">
										<img src={this.state.current.avatar} alt="avatar" />
										<label>
											<input type="text" value={this.state.comment} placeholder="Share your advice ..." onChange = {e => this.setState({comment:e.target.value})}/>
											<span onClick={() => this.btnComment(this.state.comment,pub.id)}><Telegram /></span>
										</label>
									</div>
									<div className="col-top">
										{this.state.users && this.state.users.map(author => {
			                                return(
			                                  <div key={author.id}>
			                                  	{this.state.comments && this.state.comments.map(post_com => {
			                                      if (author.id === post_com.author && post_com.post_connected === pub.id){
			                                        return(
			                                        	<div className="comments" key={post_com.id}>
															<img src={author.avatar} alt="avatar" />
															<small>{post_com.content}</small>
														</div>
			                                        )
			                                       }else return null
			                                    })}
			                                  </div>
			                                )
			                            })}
									</div>
								</CardContent>
							</Collapse>
						</Card>
					)
				})}
				{this.state.loading &&(
					<div className="loading">
						<CircularProgress color="var(--text-primary)" size="30px"/>
					</div>
				)}

				{this.state.end && (
					<div className="end-alert">
						<span>You've reached the end</span>
						<button>Refresh</button>
					</div>)}
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
});
export default connect(mapStateToProps,null)(withRouter(index))