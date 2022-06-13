import React, { Component } from 'react'
import { useQuery } from "react-query";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import BoxMessage from '../Box'
import { publicRequest, userRequest } from '../../requestMethods';
import socket from '../../Socket.js'
import './style.css'

function Query(props) {
    return (props.children(useQuery(props.keyName, props.fn, props.options)));
}

export class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: [],
            loading: false,
            request: false,
            box: false,
            friends: [],
            profile: [],
            friend: null,
            onlineUser: [],
        };
        this.handleClose = this.handleClose.bind(this);
    }
    handleOpen = () => {
        this.setState({ box: !this.state.box })
    }

    handleClose = () => {
        this.setState({ box: !this.state.box })
    }
    getCurrentUser = async () => {
        let data = await userRequest.get(`userapp/users/${this.props.user.id}/`)
            .then(({ data }) => data)
        this.setState({ friend: data.friends })
        if (data.friendRequests === 0) {
            this.setState({ request: false })
        } else {
            this.setState({ request: true })
        }
    };
    online = () => {
        socket.emit("addUser", this.props.user);
        socket.on("getUsers", (users) => {
            this.setState({ onlineUser: users })
            console.log(users)
        });
    }
    componentDidMount() {
        this.getCurrentUser()
        this.online()
    }
    render() {
        return (
            <div className='right-container'>
                <div className='right-top'>
                    {this.state.request && (<>
                        <div className='top-text'>
                            <span className='text-left'> Friend Request</span>
                            <small className='text-right'>See all</small>
                        </div>
                    </>)}
                    <Query
                        keyName="users"
                        fn={() => this.getCurrentUser()}
                    >
                        {({ data, isLoading, error }) => {
                            if (error) return <h1>Error</h1>;
                            const events = data ?? []
                            return (<>
                                {this.state.request &&
                                    <div className='request'>
                                        <img src='https://cdn.pixabay.com/photo/2016/01/20/13/05/cat-1151519_960_720.jpg' alt='' />
                                        <div className='action'>
                                            <div className='text'>
                                                <span>Erwan</span>
                                                <small>11k</small>
                                            </div>
                                            <div className='button'>
                                                <span className='accept'><ion-icon name="checkmark-outline" /></span>
                                                <span className='refused'><ion-icon name="close-outline" /></span>
                                            </div>
                                        </div>
                                    </div>
                                }</>)
                        }}
                    </Query>
                </div>
                <div className='right-feet'>
                    <div className='top-text'>
                        <span className='text-left'> Online friends</span>
                        <small className='text-right'>See all</small>
                    </div>
                    <div className='contact'>
                        {(this.state.onlineUser) && (
                            this.state.onlineUser.map(friend => {
                                return (
                                    (friend.userprof.id !== this.props.user.id) && (
                                        this.state.friend.map(frd => {
                                            if (frd.friend_id === friend.userprof.id) {
                                                return (
                                                    <div className='online-friend' onClick={this.handleOpen} key={frd.id}>
                                                        <div className='avatar'>
                                                            <img src={friend.userprof.avatar} alt="" />
                                                            <small></small>
                                                        </div>
                                                        <span>{friend.userprof.username}</span>
                                                        {this.state.box &&
                                                            <BoxMessage handleClose={this.handleClose} user={friend.userprof} />}
                                                    </div>
                                                )
                                            } else return null
                                        })
                                    )
                                )
                            })
                        )}
                    </div>
                    <div className='other-link'>
                        <small>News</small>
                        <small>Sport</small>
                        <small>Movie</small>
                        <small>Techno</small>
                        <small> | ©{new Date().getFullYear()} Wantech.</small>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.currentUser,
});
export default connect(mapStateToProps, null)(withRouter(index))