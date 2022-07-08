import React, { Component } from 'react'
import { toast } from 'react-toastify';
import { connect } from "react-redux";
import User from '../../assets/user.svg'
import { parseRequest } from '../../requestMethods';
import './style.css'
export class index extends Component {
    fileObj = [];
    fileArray = [];
    constructor(props) {
        super(props);
        this.refImg = React.createRef();
        this.state = {
            image: null,
            img: false,
            text: null,
        }
        this.handleClose = this.handleClose.bind(this)
    }

    imageHandler = async (e) => {
        this.fileObj = [];
        this.fileArray = [];
        this.setState({ image: null })
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                console.log('File ready')
            }
        }
        this.fileObj.push(e.target.files)
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
            this.setState({ img: false ,image: null})
            this.fileObj = [];
            this.fileArray = [];
            return false;
        } else if (file.length > 5) {
            toast.error("Max 5 images");
            this.setState({ img: false ,image: null})
            this.fileObj = [];
            this.fileArray = [];
            return false;
        } else if (ext.length > 1) {
            toast.error("Please upload an image only");
            this.setState({ img: false ,image: null})
            this.fileObj = [];
            this.fileArray = [];
            return false;
        } else {
            if (ext[0] === 'image') {
                for (let i = 0; i < this.fileObj[0].length; i++) {
                    this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]))
                }
                this.setState({ image: file, img: true })
            } else {
                toast.error("Please upload an image only");
                this.setState({ img: false })
                this.fileObj = [];
                this.fileArray = [];
                return false;
            }
        }
    };
    handleClose = () => {
        this.props.handleClose()
    }

    creatStory = async () => {
        const formData = new FormData();
        formData.append("user", this.props.user.id)
        formData.append("text", this.state.text)
        if (this.state.image !== null) {
            for (let i = 0; i < this.state.image.length; i++) {
                formData.append("images", this.state.image[i]);
            }
        }
        let data = await parseRequest.post('userapp/story/', formData)
            .then(({ data }) => data)
        toast.success('Story Created')
        this.setState({ text: '', image: null, img: false})
        this.fileObj = [];
        this.fileArray = [];
    }
    render() {
        return (
            <div className='story-cont'>
                <div className='container'>
                    <div className='header'>
                        <img src={this.props.user.avatar ? this.props.user.avatar : User} alt="" />
                        <span>{this.props.user.username}</span>
                    </div>
                    <div className='contents'>
                        <input type="text" placeholder='Your text ...'
                            value={this.state.text}
                            onChange={e => this.setState({ text: e.target.value })} />
                        <span onClick={(event) => {
                            event.preventDefault();
                            this.refImg.current.click();
                        }}>Choose an image</span>
                        {this.state.img &&
                            <div className='images'>
                                {(this.fileArray || []).map(img => {
                                    return (
                                        <img src={img} alt="" />
                                    )
                                })}
                            </div>}
                        <button onClick={this.creatStory}>create</button>
                    </div>
                    <input type='file' id='file-img' onChange={(e) => {
                        this.imageHandler(e);
                    }} ref={this.refImg} style={{ display: 'none' }} multiple />
                    <span className='close' onClick={this.handleClose}><ion-icon name="close-outline" /></span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.currentUser,
});
export default connect(mapStateToProps, null)(index)