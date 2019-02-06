import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getNewMessage, changeFriendStatus } from "../../../store/actions/friends";
import { readTheMessages } from "../../../store/actions/user";
import style from './style.scss';
import ProfileImage from '../../../components/ProfileImage';
import moment from 'moment';

class Chat extends React.Component {
    constructor(props){
        super(props);
        this.messageBox = React.createRef();
        this.newMessage = React.createRef();

        this.handle = this.handle.bind(this);
        this.click = this.click.bind(this);
    }

    componentDidMount(){
        if (this.messageBox.current) {
            this.messageBox.current.scrollTop = this.messageBox.current.scrollHeight;
        }
    }

    componentDidUpdate(){
        if (this.props.friends.current && this.newMessage.current) {
            this.newMessage.current.focus();
            this.messageBox.current.scrollTop = this.messageBox.current.scrollHeight;
        }
    }

    handle(e){
        if (e.keyCode === 13) {
            this.sendNewMessage()
        }
    }

    sendNewMessage(){
        if (this.newMessage.current.value.length) {
            let message = {
                to: this.props.friends.current,
                message: this.newMessage.current.value
            };
            window.socket.emit('newMessage', message);

            this.newMessage.current.value = '';
            
        }
    }

    click(){
        this.props.readTheMessages(this.props.friends.current);
    }

    render(){
        let user;
        let client = this.props.client;
        let index = this.props.friends.data && this.props.friends.data.map(usr => usr.id).indexOf(this.props.friends.current);
        let messages = [];
        if (index >= 0) {
            user = this.props.friends.data[index];
            
            messages = messages.concat(user.messages);

            for (let i = 0; i < client.messages.length; i++) {
                if (client.messages[i].by === user.id) {
                    messages.push(client.messages[i]);
                }
            }

            messages.sort((a, b) => a.date - b.date);
        }

        return (
            <div 
                className={[
                    style.container,
                    this.props.show ? style.activeContainer : ''
                ].join(' ')} 
            >
                {
                    !user ? 
                        <div className={style.select}>Select a friend to send message.</div>
                    :
                    <>
                        <div className={style.messageBox} ref={this.messageBox}>

                            {
                                messages.map((message, i) => 
                                    <div 
                                        className={
                                            [
                                                style.message,
                                                message.by === client.id ? style.client : '',
                                                message.unread && message.by !== client.id ? style.unread : ''
                                            ].join(' ')} 
                                        key={i}
                                    >
                                        <Link className={style.user} to={`/user/${message.by === client.id ? client.username : user.username}`}>
                                            <ProfileImage 
                                                gender={message.by === client.id ? client.gender : user.gender} 
                                                src={message.by === client.id ? client.avatar : user.avatar} 
                                            />
                                        </Link>
                                        <div className={style.content}>
                                            {message.message}
                                        </div>
                                        <div className={style.date} title={moment(message.date).format('D.M.Y - HH:mm')}>
                                            {
                                                moment().diff(message.date, 'day') === 0 ?
                                                    moment(message.date).format('HH:mm')
                                                :
                                                    moment(message.date).format('D.M.YY')
                                            }
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                        <div className={style.newMessage}>
                            <input onClick={this.click} onKeyDown={this.handle} ref={this.newMessage} type="text" autoFocus placeholder={`Send a message to ${user.username}`} />
                            <button onClick={this.sendNewMessage.bind(this)} className={style.item}>
                                Send
                            </button>
                        </div>
                    </>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    friends: state.friends,
    client: state.user
});

const mapDispatchToProps = {
    getNewMessage,
    readTheMessages,
    changeFriendStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);