import React, { Component } from 'react'
import { connect } from "react-redux";
import { toast } from 'react-toastify';
import { CircularProgress } from '@material-ui/core';
import { publicRequest, userRequest, BASE_URL, parseRequest } from '../../requestMethods';
import User from '../../assets/user.jpg'
import Emoji from '../Emoji'
import './style.css'
export class index extends Component {
    constructor(props) {
        super(props);
        this.refImg = React.createRef();
        this.state = {
            image: null,
            video: null,
            share: '',
            sending: false,
            emoji: false,
        }
        this.pubUpdate = this.pubUpdate.bind(this);
        this.onEmojiClick = this.onEmojiClick.bind(this);
    }
    imageHandler = async (e) => {
        this.setState({ image: '', video: null })
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                console.log('File ready')
            }
        }
        reader.readAsDataURL(e.target.files[0])
        const file = e.target.files;
        let size = 0;
        let ext = [];
        for (let i = 0; i < file.length; i++) {
            let type = file[i].type.split('/')[0];
            if (ext.indexOf(type) < 0) {
                ext.push(type)
            }
            size += file[i].size
        }
        if (size > 25e6) {
            toast.error("Please upload a file smaller than 25 MB");
            return false;
        } else if (ext.length > 1) {
            toast.error("You can't mixed a file");
            return false;
        } else {
            if (ext[0] === 'image') {
                this.setState({ image: file })
            } else if (ext[0] === 'video') {
                if (file.length > 1) {
                    toast.error("Please upload only one video");
                    return false;
                } else {
                    this.setState({ video: file[0] })
                }
            } else {
                toast.error("Please upload image or video");
                return false;
            }
        }

    };

    btnShare = async () => {
        this.setState({ sending: true })
        const formData = new FormData();
        let author = parseInt(this.props.user.id, 10)
        formData.append("user", author)
        formData.append("message", this.state.share)
        if (this.state.video !== null) {
            formData.append(
                "video",
                this.state.video,
                this.state.video.name
            );
        } else if (this.state.image !== null) {
            for (let i = 0; i < this.state.image.length; i++) {
                formData.append("images", this.state.image[i]);
            }
        }
        let data = await parseRequest.post('userapp/publication/', formData)
            .then(({ data }) => data)
        toast.success('Post is sharing !')
        this.setState({ share: '', image: '', video: '', sending: false })
        this.pubUpdate(data)
    };
    pubUpdate = (data) => {
        this.props.publication(data)
    }
    onEmojiClick = (emojiObject) => {
        this.setState({ share: this.state.share.concat(emojiObject) })
    };
    emojiFunc = () => {
        this.setState({ emoji: !this.state.emoji })
    }
    render() {
        return (
            <div className='add-container'>
                <div className='add-header'>
                    <div className='add-card'>
                        <div className='story'>
                            <img src={this.props.user.avatar ? this.props.user.avatar : User} alt='' />
                        </div>
                        <span className='card-icon story-icon'><ion-icon name="add-outline" /></span>
                        <span className='story-text'>Create story</span>
                    </div>

                    <div className='add-card'>
                        <div className='story'>
                            <img src='https://cdn.pixabay.com/photo/2019/03/05/05/12/model-4035591_960_720.jpg' alt='' />
                        </div>
                        <img src='https://cdn.pixabay.com/photo/2019/03/05/05/12/model-4035591_960_720.jpg' alt='' className='story-img' />
                    </div>
                    <div className='add-card'>
                        <div className='story'>
                            <img src='https://cdn.pixabay.com/photo/2019/03/05/05/12/model-4035591_960_720.jpg' alt='' />
                        </div>
                        <img src='https://cdn.pixabay.com/photo/2019/03/05/05/12/model-4035591_960_720.jpg' alt='' className='story-img' />
                    </div>
                    <div className='add-card'>
                        <div className='story'>
                            <img src='https://cdn.pixabay.com/photo/2019/03/05/05/12/model-4035591_960_720.jpg' alt='' />
                        </div>
                        <img src='https://cdn.pixabay.com/photo/2019/03/05/05/12/model-4035591_960_720.jpg' alt='' className='story-img' />
                    </div>
                    <div className='add-card'>
                        <div className='story'>
                            <img src='https://cdn.pixabay.com/photo/2019/03/05/05/12/model-4035591_960_720.jpg' alt='' />
                        </div>
                        <img src='https://cdn.pixabay.com/photo/2019/03/05/05/12/model-4035591_960_720.jpg' alt='' className='story-img' />
                    </div>
                    <span className='story-see card-icon'><ion-icon name="arrow-forward-outline" /></span>
                </div>
                <div className='add-bottom'>
                    <div className='bottom-header'>
                        <img src={this.props.user.avatar ? this.props.user.avatar : User} alt='' />
                        <textarea placeholder='Your post ...'
                            value={this.state.share}
                            onChange={e => this.setState({ share: e.target.value })} />
                    </div>
                    <div className='bottom-footer'>
                        <div className='footer-left'>
                            <div className='video-image'
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.refImg.current.click();
                                }}>
                                <span className='share-icon'><ion-icon name="images-outline" /></span>
                                <small className='share-text'>Photo / video</small>
                            </div>
                            <div className='video-image'>
                                <span className='share-icon'><ion-icon name="location-outline" /></span>
                                <small className='share-text'>Location</small>
                            </div>
                            <div className='video-image' >
                                <div onClick={this.emojiFunc} className='emoji'>
                                    <span className='share-icon'><ion-icon name="happy-outline" /></span>
                                    <small className='share-text'>Feellings</small>
                                </div>
                                {this.state.emoji && <Emoji onEmojiClick={this.onEmojiClick} class= 'left'/>}
                            </div>

                            <input type='file' id='file-img' onChange={(e) => {
                                this.imageHandler(e);
                            }} ref={this.refImg} style={{ display: 'none' }} multiple />
                        </div>
                        <button className='btn-share' onClick={this.btnShare} disabled={this.state.sending}>{this.state.sending ? <CircularProgress color="white" size="20px" /> : "Share"}</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.currentUser,
});
export default connect(mapStateToProps, null)(index)