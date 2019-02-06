import React from 'react';
import { Link } from 'react-router-dom';
import AddFriendButton from '../../../AddFriendButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { deleteTheNotification } from '../../../../store/actions/notifications';
import style from './style.scss';

class Notification extends React.Component {
    constructor(props){
        super(props);
    
        this.state = { deleted: false };

        this.notification = this.notification.bind(this);
        this.delete = this.delete.bind(this);
    }

    notification(){

        let notification = this.props.notification;
        let jsx;

        switch (notification.type) {
            case 'friendship/request':

                jsx = (
                    <div className={style.content}>
                        {
                            notification.type === 'friendship/request' &&
                                <>
                                    <span>
                                        Wants to be friend.
                                    </span>
                                    <AddFriendButton user={notification.user} />
                                </>
                        }
                    </div>
                );

                break;
        }

        return jsx;

    }

    delete(e){
        e.preventDefault();
        this.props.deleteTheNotification(this.props.notification._id);
        this.setState({ deleted: true });
    }

    render(){
        const notification = this.props.notification;

        if (this.state.deleted) {
            return null;
        }

        return (
            <li onContextMenu={this.delete} className={style.item}>
                <Link 
                    to={`/user/${notification.user.username}`} 
                    tag={'header'}
                >
                    {`${notification.user.first} ${notification.user.last}`}
                </Link>
                {this.notification()}
            </li>
        );
    }
}

const mapDispatchToProps = {
    deleteTheNotification
};

export default connect(null, mapDispatchToProps)(Notification);