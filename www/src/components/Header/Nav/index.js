import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { readTheNotifications, deleteTheNotification } from '../../../store/actions/notifications';
import style from './style.scss';
import animate from '../../../style/animate.scss';
import NoSSR from 'react-no-ssr';
import Notification from './Notification';

class Nav extends React.Component {
    constructor(props){
        super(props);
        this.dropdownButton = React.createRef();
        this.state = { showNotifications: false, showModal: false };

        this.dropdown = this.dropdown.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    componentDidMount(){
        if (process.browser) {
            window.addEventListener('click', this.dropdown);
        }
    }

    componentWillUnmount(){
        window.removeEventListener('click', this.dropdown);
    }

    dropdown(e){
        if (this.dropdownButton.current && this.dropdownButton.current.isEqualNode(e.target)) {
            this.props.readTheNotifications();
            this.setState({ showNotifications: !this.state.showNotifications });
        } else {
            this.setState({ showNotifications: false });
        }
    }

    showModal(){
        this.setState({ showModal: true });
    }

    hideModal(){
        this.setState({ showModal: false });
    }

    delete(e, id){
        e.preventDefault();
        this.props.deleteTheNotification(id);
    }

    signOut(){
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        window.location.reload();
    }

    render(){
        const { user } = this.props;
        if (user) {
            const { messages } = user;
            var data = this.props.notifications;
            
            var unread = 0;
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].unread) {
                    unread++;
                }
            }

            var notUnread = 0;
            for (let i = 0; i < data.length; i++) {
                if (data[i].unread) {
                    notUnread++;
                }
            }
        }
        
        return (
            <nav className={style.nav}>
                {
                    user ?
                        (
                            <>
                                <Link className={style.profile} to={`/user/${user.username}`}>
                                    {user.username}
                                </Link>

                                <Link className={[style.navItem, style.profileMobile].join(' ')} to={`/user/${user.username}`}>
                                    <FontAwesomeIcon icon={['far', 'user']} />
                                </Link>

                                <Link to="/search" className={[style.navItem, style.searchLink].join(' ')}><FontAwesomeIcon icon={['fab', 'sistrix']} /></Link>
                                
                                <NoSSR>
                                    <Link className={style.navItem} to="/messages">
                                        {
                                            unread > 0 && 
                                                <span className={style.unread}>
                                                    { unread }
                                                </span>
                                        }
                                        <FontAwesomeIcon icon={['far', 'comments']} />
                                    </Link>

                                    <span ref={this.dropdownButton} className={style.navItem}>
                                        <FontAwesomeIcon icon={['far', 'bell']} />
                                        {
                                            notUnread > 0 && 
                                                <span className={style.unread}>
                                                    { notUnread }
                                                </span>
                                        }
                                        {
                                            this.state.showNotifications &&
                                            (<div className={[style.dropdownContainer, animate.animated, animate.fadeIn, animate.faster].join(' ')}>
                                                <div className={style.top}>
                                                    <Link to="/messages">See All Notifications</Link>
                                                </div>
                                                <ul>
                                                    {
                                                        data.map(notification => <Notification notification={notification} key={notification._id} />)
                                                    }
                                                    {
                                                        !data.length && 
                                                            <div className={style.empty}>
                                                                <img src="/static/bell.png" />
                                                            </div>
                                                    }
                                                </ul>
                                            </div>)
                                        }
                                    </span>

                                    <span className={style.navItem} onClick={this.signOut}><FontAwesomeIcon icon="sign-out-alt" /></span>
                                </NoSSR>
                            </>
                        )
                    :
                        (
                            <Link to="/" className={style.navItem}>Sign In</Link>
                        )
                }
            </nav>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    notifications: state.notifications
});

const mapDispatchToProps = {
    readTheNotifications,
    deleteTheNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);