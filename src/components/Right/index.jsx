import React, { Component } from 'react'
import { useQuery } from "react-query";
import { connect } from "react-redux";
import { addPeer } from "../../context/peerRedux";
import { withRouter } from 'react-router-dom';
import Peer from 'peerjs';
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
        this.currentVideo = React.createRef();
        this.friendVideo = React.createRef();
        this.peerInstance = React.createRef();
        this.state = {
            requests: [],
            loading: false,
            request: false,
            box: false,
            friends: [],
            profile: [],
            friend: null,
            onlineUser: [],
            peerId: null,
        };
        this.handleClose = this.handleClose.bind(this);
        this.call = this.call.bind(this);
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
    getFriend = async () => {
        let data = await userRequest.get(`userapp/friend`)
            .then(({ data }) => data)
        this.setState({ friends: data })
    }

    call = (remotePeerId) => {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: true, audio: true }, (mediaStream) => {

            this.currentVideo.current.srcObject = mediaStream;
            this.currentVideo.current.play();

            const call = this.peerInstance.current.call(remotePeerId, mediaStream)

            call.on('stream', (remoteStream) => {
                this.friendVideo.current.srcObject = remoteStream
                this.friendVideo.current.play();
            });
        });
    }
    componentDidMount() {
        this.getFriend()
        this.getCurrentUser()
        const peer = new Peer();
        this.setState({ peer: peer })
        peer.on('open', id => {
            socket.emit("addUser", this.props.user.id, id)
            socket.on("getUsers", (users) => {
                this.setState({ onlineUser: users })
            });
        });

        peer.on('call', (call) => {
            var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            getUserMedia({ video: true, audio: true }, (mediaStream) => {
                this.currentVideo.current.srcObject = mediaStream;
                this.currentVideo.current.play();
                call.answer(mediaStream)
                call.on('stream', function (remoteStream) {
                    this.friendVideo.current.srcObject = remoteStream
                    this.friendVideo.current.play();
                });
            });
        })
        this.peerInstance.current = peer

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
                            this.state.onlineUser && this.state.onlineUser.map(friend => {
                                return (
                                    (friend.userId !== this.props.user.id) && (
                                        this.state.friend && this.state.friend.map(frd => {
                                            if (frd.friend_id === friend.userId) {
                                                return (
                                                    this.state.friends && this.state.friends.map(online => {
                                                        if (friend.userId === online.friend) {
                                                            return (<>
                                                                <div className='online-friend' onClick={this.handleOpen} key={online.id}>
                                                                    <div className='avatar'>
                                                                        <img src={online.friendprof[0].avatar} alt="" />
                                                                        <small></small>
                                                                    </div>
                                                                    <span key={online.id}>{online.friendprof[0].username}</span>

                                                                </div>
                                                                {this.state.box &&
                                                                    <BoxMessage handleClose={this.handleClose} user={online.friendprof[0]} friendVideo={this.friendVideo}
                                                                        currentVideo={this.currentVideo} call={this.call} idCall={friend.peerId}/>}
                                                            </>
                                                            )
                                                        } else return null
                                                    })
                                                )
                                            } else return null
                                        })
                                    )
                                )
                            })
                        )}
                    </div>
                    <div className='other-link'>
                        <small> Copyright © Wantech {new Date().getFullYear()}.</small>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.currentUser,
});
const mapDispatchToProps = (dispatch) => ({
    dispatchs: dispatch,
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(index))