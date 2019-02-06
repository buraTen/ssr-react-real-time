import React from 'react';
import { connect } from 'react-redux';
import style from './style.scss';
import Nav from './Nav';
import Logo from './Logo';
import Search from './Search';
import { getNewMessage, changeFriendStatus, friendshipRequest, removeFriendshipRequest, addNewFriend, removeTheFriend } from '../../store/actions/friends';
import { getNewMessage as getNewMessageByFriend } from '../../store/actions/user';
import { addNewNotification } from '../../store/actions/notifications';

class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = { search: '' };

        this.handleSearch = this.handleSearch.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
    }

    handleSearch(e){
        this.setState({ search: e.target.value });
    }

    clearSearch(e){
        this.setState({ search: '' });
    }

    componentDidMount(){
        if (this.props.user) {

            window.socket.on('newMessage', data => {
                if (data.by === this.props.user.id) {
                    this.props.getNewMessage(data.to, data.message, data.by, data.date);
                } else {
                    let audio = new Audio('/static/message.mp3');
                    audio.play().catch(()=> console.log('New Message'))
                    this.props.getNewMessageByFriend(data.by, data.message, data.date);
                }
            });

            window.socket.on('changeStatus', data => {
                this.props.changeFriendStatus(data.friend, data.status);
            });

            window.socket.on('notification', data => {
                this.props.addNewNotification(data);
            });

            window.socket.on('friendship', data => {
                switch (data.status) {
                    case 'request':
                        this.props.friendshipRequest(data.user, this.props.user);
                        break;

                    case 'removeRequest':
                        this.props.removeFriendshipRequest(this.props.user.id);
                        break;

                    case 'accept':
                        this.props.removeFriendshipRequest(data.user.id);
                        this.props.addNewFriend(data.user);
                        break;

                    case 'remove':
                        this.props.removeTheFriend(data.user.id);
                        break;
                }
            });

        }
    }

    render(){
        return (
            <header className={style.header}>
                <div className={style.container}>
                    <Search {...this.props} className={style.search} />
                    <Logo className={style.logo} />
                    <Nav className={style.nav} />
                </div>
            </header>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = {
    getNewMessage,
    getNewMessageByFriend,
    changeFriendStatus,
    friendshipRequest,
    removeFriendshipRequest,
    addNewFriend,
    removeTheFriend,
    addNewNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);