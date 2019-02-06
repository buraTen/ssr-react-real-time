import React from 'react';
import { connect } from 'react-redux';
import style from './style.scss';
//import { getNewMessage } from '../../../store/actions/friends';
import { setCurrentFriend } from '../../../store/actions/friends';
import ProfileImage from '../../../components/ProfileImage';

class FriendList extends React.Component {
    render(){
        let friends = this.props.friends.data;
        
        return (
            <div 
                className={[
                    style.container,
                    this.props.show ? style.activeContainer : ''
                ].join(' ')} 
            >
                {
                    friends.length ? 
                        friends.map(friend => (
                            <div 
                                className={
                                    [
                                        friend.status === 'online' ? style.online : style.offline,
                                        style.friend, 
                                        friend.id === this.props.friends.current ? style.current : ''
                                    ].join(' ')} 
                                key={friend.id} 
                                onClick={this.props.setCurrentFriend.bind(this, friend.id)}
                            >
                                <ProfileImage gender={friend.gender} src={friend.avatar} />
                                {friend.username}
                                <span className={friend.status === 'online' ? style.statusOnline : style.status} />
                            </div>
                        ))
                    :
                        <div className={style.empty}>No Friend</div>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    friends: state.friends,
    user: state.user
});

const mapDispatchToProps = {
    setCurrentFriend
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendList);