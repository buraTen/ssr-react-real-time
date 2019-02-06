import React from 'react';
import Helmet from 'react-helmet';
import UserItem from '../../../components/UserItem';
import style from './style.scss';

const Friends = (props) => (
    <>
        <Helmet>
            <title>Friends - {props.match.params.username}</title>
        </Helmet>
        <div className={style.container}>
            {
                props.data.map(friend => <UserItem key={friend.id} user={friend} />)
            }
        </div>
    </>
);

export default Friends;