import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { newFriendshipRequest, removeFriendshipRequest, friendshipRequest, addNewFriend, removeTheFriend } from '../../store/actions/friends';
import { newAlert } from '../../store/actions/alert';
import './style.scss';

class AddFriendButton extends React.Component {
    constructor(props){
        super(props);

        let isFriend = false;
        let sentRequest = false;
        let request = false;

        if (this.props.client) {

            for (let i = 0; i < this.props.friends.length; i++) {

                if (this.props.friends[i].id === this.props.user.id) {
                    isFriend = true;
                }

            }

            for (let i = 0; i < this.props.requests.length; i++) {
                
                if (this.props.requests[i].by.id === this.props.user.id) {
                    request = true;
                } else if (this.props.requests[i].to.id === this.props.user.id) {
                    sentRequest = true;
                }

            }

        }

        this.state = {
            isFriend, sentRequest, request
        };

        this.click = this.click.bind(this);
    }

    click(){

        if (!this.props.client) {
            this.props.newAlert('Sign in to send friendship request');
            return;
        }

        window.socket.emit('friendship', this.props.user.id);

        if (this.state.isFriend) {
            this.props.removeTheFriend(this.props.user.id);
            this.setState({ isFriend: false, sentRequest: false, request: false });
        } else if (!this.state.isFriend && this.state.sentRequest && !this.state.request) {
            this.props.removeFriendshipRequest(this.props.user.id);
            this.setState({ isFriend: false, sentRequest: false, request: false });
        } else if (!this.state.isFriend && !this.state.sentRequest && this.state.request) {
            this.props.addNewFriend(this.props.user);
            this.setState({ isFriend: true, sentRequest: false, request: false });
        } else if (!this.state.isFriend && !this.state.sentRequest && !this.state.request) {
            this.props.newFriendshipRequest(this.props.user.id, this.props.client.id);
            this.setState({ isFriend: false, sentRequest: true, request: false });
        }

    }

    render(){
        if (this.props.client && this.props.client.id === this.props.user.id) {
            return null;
        }
        
        return (
            <button onClick={this.click}>
                {
                    this.state.isFriend &&
                        <>
                            <FontAwesomeIcon icon="user-minus" />
                            Remove
                        </>
                }

                {
                    !this.state.isFriend && this.state.sentRequest && !this.state.request &&
                        <>
                            <FontAwesomeIcon icon="times" />
                            Sent Request
                        </>
                }

                {
                    !this.state.isFriend && !this.state.sentRequest && this.state.request &&
                        <>
                            <FontAwesomeIcon icon="check" />
                            Accept Request
                        </>
                }

                {
                    !this.state.isFriend && !this.state.sentRequest && !this.state.request &&
                        <>
                            <FontAwesomeIcon icon="user-plus" />
                            Add Friend
                        </>
                }
            </button>
        ); 
    }
}

const mapStateToProps = (state) => ({
    client: state.user,
    friends: state.friends.data,
    requests: state.friends.requests
});

const mapDispatchToProps = {
    newFriendshipRequest,
    removeFriendshipRequest,
    friendshipRequest,
    addNewFriend,
    removeTheFriend,
    newAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFriendButton);