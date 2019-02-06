import React from 'react';
import AddFriendButton from '../AddFriendButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import ProfileImage from '../ProfileImage';
import animate from '../../style/animate.scss';
import style from './style.scss';

class UserItem extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        const usr = this.props.user;
        
        return (
            <div className={[style.userItem, animate.animated, animate.fadeIn].join(' ')}>
                <Link to={`/user/${usr.username}`}>
                    <ProfileImage gender={usr.gender} src={usr.avatar} />
                </Link>
                <div className={style.wrapper}>
                    <span>
                        {usr.name}
                    </span>
                    <i> - </i>
                    <div className={style.location}>
                        <FontAwesomeIcon icon="map-marker-alt" />
                        {usr.country.name}
                    </div>
                </div>
                <AddFriendButton user={usr} />
            </div>
        );
    }
}

export default UserItem;