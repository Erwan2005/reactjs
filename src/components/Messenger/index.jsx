import React from 'react'
import { connect } from "react-redux";
import { withRouter } from "react-router";
import ScrollToBottom from 'react-scroll-to-bottom';
import { Search,Image,EmojiEmotions,AttachFile,ThumbUp,Telegram,Videocam,ArrowDownward,Call,MoreVert } from '@material-ui/icons';
import { publicRequest,userRequest } from '../../requestMethods';
import _ from 'lodash';
import './style.css'

export class index extends React.Component {
	constructor(props){
	    super(props);
	    this.refImg = React.createRef();
	    this.refFl = React.createRef();
	    this.state={
	    	message:'',
	    	messages: [],
	    	chosenEmoji: null,
	    	open: false,
	    	friends: [],
	    	profile: [],
	    	user: [],
	    	private_message: [],
	    	receiver: '',
	    	conversation: false,
	    	last_message: [],
	    	doc_file: '',
	    	image: '',
	    };
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
      if (file.size > 3e6) {
		      window.alert("Please upload a file smaller than 3 MB");
		      return false;
		    }else{
		      const base64 = await this.convertBase64(file);
		      this.setState({image:base64})}
    };

  docHandler = async (e) => {

      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          //this.setState({image:reader.result})
          console.log('file readed')
        }
      }
      reader.readAsDataURL(e.target.files[0])
      const file = e.target.files[0];
      if (file.size > 10e6) {
		      window.alert("Please upload a file smaller than 10 MB");
		      return false;
		    }else {
		      const base64 = await this.convertBase64(file);
		      this.setState({doc_file:base64})}
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

  getMessage = async ()=>{
  	let data = await publicRequest.get('userapp/message/')
  	.then(({data}) => data)
  	this.setState({messages:_.sortBy(data.results, "id")})
  	console.log(this.state.messages)
  }
  componentDidMount(){
    this.getMessage()
  };
	render() {
		return (
			<div className="messenger">
				{this.props.friend ? (<>
				<div className="top">
					<div className="profile">
						<img src={this.props.friend.avatar} alt="avatar" />
						<div>
							<span>{this.props.friend.username}</span>
							<small>Online</small>
						</div>	
					</div>
					<div className="right-action">
						<Videocam className="icon"/>
						<Call className="icon"/>
						<MoreVert className="icon"/>
					</div>
				</div>
				<ScrollToBottom className="middle">
					<div className="friend">
						<img src="https://cdn.pixabay.com/photo/2019/03/27/15/24/animal-4085255_960_720.jpg" alt="avatar" className="avatar"/>
						<div className="friend-message">
							<h5>Bonjour</h5>
							<img src="https://cdn.pixabay.com/photo/2019/03/27/15/24/animal-4085255_960_720.jpg" alt="avatar" />
							<small>1min ago</small>
						</div>
					</div>
					<div className="owner">
						<div className="owner-message">
							<h5>Bonjour</h5>
							<img src="https://cdn.pixabay.com/photo/2019/03/27/15/24/animal-4085255_960_720.jpg" alt="avatar" />
							<small>1min ago</small>
						</div>
					</div>

					<div className="friend">
						<img src="https://cdn.pixabay.com/photo/2019/03/27/15/24/animal-4085255_960_720.jpg" alt="avatar" className="avatar"/>
						<div className="friend-message">
							<h5>Bonjour</h5>
							<img src="https://cdn.pixabay.com/photo/2019/03/27/15/24/animal-4085255_960_720.jpg" alt="avatar" />
							<small>1min ago</small>
						</div>
					</div>
					<div className="owner">
						<div className="owner-message">
							<h5>Bonjour</h5>
							<img src="https://cdn.pixabay.com/photo/2019/03/27/15/24/animal-4085255_960_720.jpg" alt="avatar" />
							<small>1min ago</small>
						</div>
					</div>

				</ScrollToBottom>
				<div className="bottom">
					<div className="bot-icons">
						<div className="topbarStyle">
							<Image onClick={(event) => {
			                event.preventDefault();
			                this.refImg.current.click();
			                }}/>
						</div>
						<input type='file' onChange={(e) => {
				                this.imageHandler(e);
				              }} ref={this.refImg} style={{display: 'none'}} accept=".png, .jpg, .jpeg"/>

				    <input type='file'  onChange={(e) => {
				                this.docHandler(e);
				              }} ref={this.refFl} style={{display: 'none'}} accept=".pdf"/>
						<div className="topbarStyle">
							<AttachFile onClick={(event) => {
			                event.preventDefault();
			                this.refFl.current.click();}}/>
						</div>
						<div className="topbarStyle">
							<EmojiEmotions />
						</div>
					</div>
					<textarea placeholder="Enter your message ..."></textarea>
					<div className="topbarStyle">
							<ThumbUp />
						</div>
				</div></>) :
					<div>No conversion selected</div>
				}
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
});
export default connect(mapStateToProps,null)(withRouter(index))