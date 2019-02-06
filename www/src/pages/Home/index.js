import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import style from './style.scss';
import UserProfile from '../../components/UserProfile';
import { fetchSuggestedUsers } from '../../api';
import Loader from '../../components/Loader';
import UserItem from '../../components/UserItem';

class Home extends React.Component {
    constructor(props){
        super(props);

        let data = null;

        if (process.browser && window.REDUX_DATA.data) {
            data = window.REDUX_DATA.data;
            delete window.REDUX_DATA.data;
        }
        if (!process.browser) {
            data = this.props.data;
        }
        
        this.state = { data };
    }

    static serverFetch({ store, token }){
        if (store.getState().user) {
            return fetchSuggestedUsers(token);
        } else {
            return false;
        }
    }

    async componentDidMount(){
        if (!this.state.data) {
            let data = await fetchSuggestedUsers();
            this.setState({ data });
        }
    }
    
    render(){
        const { user } = this.props;
        const { data } = this.state;
        
        return (
            <div className={style.container}>
                <Helmet>
                    <title>Welcome</title>
                </Helmet>
                <div className={style.userProfile}>
                    <UserProfile user={{ id: user.id, username: user.username, name: user.name, gender: user.gender, avatar: user.avatar, background: user.background }} />
                </div>
                <div className={style.usersContainer}>
                    {
                        data ?
                            data.length ? 
                                data.map(usr => <UserItem key={usr.id} user={usr} />)
                            :
                                'There is no user'
                        :
                            <Loader />
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    data: state.data
});

export default connect(mapStateToProps)(Home);