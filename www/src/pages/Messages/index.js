import React from 'react';
import Helmet from 'react-helmet';
import style from './style.scss';
import animate from '../../style/animate.scss';
import FriendList from './FriendList';
import Chat from './Chat';

class Messages extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            showMessages: false
        };

        this.tab = this.tab.bind(this);
    }

    tab(){
        this.setState({ showMessages: !this.state.showMessages });
    }

    render(){
        return (
            <div className={[style.container, animate.animated, animate.fadeIn].join(' ')}>
                <Helmet>
                    <title>Messages</title>
                </Helmet>

                <div className={style.tab}>
                    <span 
                        className={this.state.showMessages ? '' : style.activeTab} 
                        onClick={this.tab}
                    >
                        Friends
                    </span>
                    
                    <span 
                        className={this.state.showMessages ? style.activeTab : ''} 
                        onClick={this.tab}
                    >
                        Messages
                    </span>
                </div>

                <FriendList show={!this.state.showMessages} />
                <Chat show={this.state.showMessages} />
            </div>
        );
    }
}

export default Messages;