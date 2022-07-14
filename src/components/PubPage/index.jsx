import React, { Component } from 'react'
import { connect } from "react-redux"
import User from '../../assets/user.svg'
import { userRequest } from '../../requestMethods';
import { withRouter } from 'react-router-dom'
import NumericLabel from 'react-pretty-numbers';
import { format } from 'timeago.js';
import Emoji from '../Emoji'
import './style.css'
export class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            publication: {},
            index: 0,
            like: [],
            comment: '',
            comments: [],
            emoji: false,
            menu: false,
        }
        this.handleSearch = this.handleSearch.bind(this)
    }
    prevNext = (action, array) => {
        if (action === 'prev') {
            this.state.index > 0 && this.setState({ index: this.state.index - 1 })
        } else {
            this.state.index < array.length - 1 && this.setState({ index: this.state.index + 1 })
        }
    }

    getLike = async () => {
        let data = await userRequest.get('userapp/like/')
            .then(({ data }) => data)
        this.setState({ like: data })
    };
    checkLiked = (userId, postId) => {
        if (this.state.like.filter(item => item.author === userId && item.post_connected === postId).length === 0)
            return false
        else return true
    };

    dlt = async (id) => {
        await userRequest.delete(`userapp/like/${id}`)
        this.getLike()
    };

    dltLike = (userId, postId) => {
        this.state.like.filter(item => item.author === userId && item.post_connected === postId).map(cheked => (this.dlt(cheked.id)))
    };


    postLike = async (author, post_connected) => {
        let data = await userRequest.post('userapp/like/', { author, post_connected })
            .then(({ data }) => data)
        this.setState({ like: this.state.like.concat(data) })
    };

    getCom = async () => {
        let data = await userRequest.get('userapp/comment/')
            .then(({ data }) => data)
        this.setState({ comments: data })
    };

    btnComment = async (content, id_post) => {
        let author = this.props.user.id
        var contents = { content: content, author: author, post_connected: id_post }
        let data = await userRequest.post('userapp/comment/', contents)
            .then(({ data }) => data)
        this.setState({ comments: [data].concat(this.state.comments) })
        this.setState({ comment: '' })

    };

    emojiFunc = () => {
        this.setState({ emoji: !this.state.emoji })
        console.log(this.state.emoji)
    }

    onEmojiClick = (emojiObject) => {
        this.setState({ comment: this.state.comment.concat(emojiObject) })
    };
    deleteCom = async (id) => {
        const new_data = this.state.comments.filter(com => {
            if (com.id === id) {
                return false
            }
            return true;
        })
        this.setState({ comments: new_data })
        await userRequest.delete(`userapp/comment/${id}`)
    }
    handleSearch = () => {
        this.props.handleSearch('pubPage')
    }
    keyDownHandler = event => {
        if (this.state.comment !== '') {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.btnComment(this.state.comment, this.state.publication.id)
            }
        }
    };
    componentDidMount() {
        this.getLike()
        this.getCom()
        this.handleSearch()
        const pub = this.props.publication.filter((pub) => pub.id == this.props.match.params.id)
        this.setState({ publication: pub[0] })
        document.addEventListener('keydown', this.keyDownHandler, false);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyDownHandler, false);
    }
    render() {
        return (
            <div className='pagepub'>
                {this.state.loading ? <>
                    <div className='head-skeleton'></div>
                    <div className='bottom-skeleton'></div>
                </> : <>
                    {this.state.publication.video && (
                        <div><video src={this.state.publication.video} controls controlsList='nodownload' autoPlay /></div>)}
                    {this.state.publication.images && this.state.publication.images[0].image !== null && <>
                        <div className='images'>
                            <span className='left' onClick={() => this.prevNext('prev', this.state.publication.images)}><ion-icon name="arrow-back-outline" /></span>
                            <img src={this.state.publication.images[this.state.index].image} alt='' />
                            <span className='right' onClick={() => this.prevNext('next', this.state.publication.images)}><ion-icon name="arrow-forward-outline" /></span>
                        </div>
                    </>}
                    <div className='page-avatar'>
                        <img src={this.state.publication.proprietary && this.state.publication.proprietary[0].avatar ? this.state.publication.proprietary[0].avatar : User} alt="" />
                        <span className='page-text'>
                            {this.state.publication.message}
                        </span>
                    </div>
                    <div className='action'>
                        <div className='item'>
                            <small><NumericLabel params={{ shortFormat: true, }}>{this.state.like.filter(item => item.post_connected === this.state.publication.id).length}</NumericLabel> Likes</small>
                            <small><NumericLabel params={{ shortFormat: true, }}>{this.state.comments.filter(item => item.post_connected === this.state.publication.id).length}</NumericLabel> Comments</small>
                        </div>
                        <div className='item'>
                            {(this.checkLiked(this.props.user.id, this.state.publication.id)) ? (
                                <span className='icon liked' onClick={() => this.dltLike(this.props.user.id, this.state.publication.id)}><ion-icon name="heart" /> <small className='liked'>Like</small></span>
                            ) : (
                                <span className='icon' onClick={() => this.postLike(this.props.user.id, this.state.publication.id)}><ion-icon name="heart-outline" /> <small>Like</small></span>
                            )
                            }
                            <span className='icon'>
                                <ion-icon name="share-social-outline" />
                                <small>Share</small>
                            </span>
                        </div>
                    </div>

                    <label className='text-input'>
                        <img src={this.props.user.avatar ? this.props.user.avatar : User} alt="" />

                        <input type="text" placeholder='Your text' value={this.state.comment} onChange={e => this.setState({ comment: e.target.value })} />
                        <span onClick={this.emojiFunc}><ion-icon name="happy-outline" /></span>
                        {this.state.emoji && <Emoji onEmojiClick={this.onEmojiClick} class='right' />}
                    </label>
                    {this.state.comments && this.state.comments.map(com => {
                        if (com.post_connected === this.state.publication.id) {
                            return (
                                <div className='comments' key={com.id}>
                                    <img src={com.commented && com.commented[0].avatar ? com.commented[0].avatar : User} alt="" />
                                    <div className='text'>
                                        <span>{com.commented[0].username}</span>
                                        <small>{com.content}</small>
                                        <small>{format(com.date_posted)}</small>
                                    </div>
                                    {com.author === this.props.user.id &&
                                        <span className='right' onClick={() => this.setState({ menu: !this.state.menu })}>
                                            <div className='menu'>
                                                <ion-icon name="ellipsis-vertical-outline" />
                                                {this.state.menu &&
                                                    <div className='item-menu'>
                                                        <small>Edit</small>
                                                        <small onClick={() => this.deleteCom(com.id)}>Delete</small>
                                                    </div>}
                                            </div>
                                        </span>
                                    }</div>
                            )
                        } else return null
                    })}
                </>}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.currentUser,
    publication: state.all.publications,
});
export default connect(mapStateToProps, null)(withRouter(index))