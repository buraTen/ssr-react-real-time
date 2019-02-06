import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { fetchUserByUsername } from '../../api';
import Loader from '../../components/Loader';
import UserProfile from '../../components/UserProfile';
import style from './style.scss';
import animate from '../../style/animate.scss';
import { Route, NavLink } from "react-router-dom";
import About from './About';
import Friends from './Friends';
import Images from './Images';

class User extends React.Component {
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

    static serverFetch({ params }){
        return fetchUserByUsername(params[1])
    }

    async componentDidMount(){
        if (!this.state.data) {
            let data = await fetchUserByUsername(this.props.match.params.username);
            this.setState({ data });
        }
    }

    componentWillReceiveProps(next){
        if (this.props.match.params.username !== next.match.params.username) {
            this.setState({ data: null });
            fetchUserByUsername(next.match.params.username)
                .then(data => this.setState({data: data}));
        }
        
    }

    render(){
        let match = this.props.match;
        
        let about = {};
        let user = {};
        let friends = {};
        let images = [];

        if (this.state.data && this.state.data.username) {
            about = {
                country: this.state.data.country.name,
                languages: this.state.data.languages,
                email: this.state.data.email,
                quote: this.state.data.quote,
                birth: this.state.data.birth,
                gender: this.state.data.gender,
                bio: 'Doloribus sunt quam cum, sint, quaerat incidunt iure itaque officia sed perspiciatis ullam velit vero voluptates in facere nisi corrupti, ipsa ut.'
            };

            user = {
                id: this.state.data.id,
                name: `${this.state.data.first} ${this.state.data.last}`,
                username: this.state.data.username,
                gender: this.state.data.gender,
                avatar: this.state.data.avatar,
                background: this.state.data.background
            };
            
            friends = this.state.data.friends;
            friends.forEach(friend => {
                friend.name = friend.first + ' ' + friend.last;
            });

            if (this.props.user && this.state.data.id === this.props.user.id) {
                images = this.props.user.images;
            } else {
                images = this.state.data.images;
            }
        }
        
        return (
            <div>
                <Helmet>
                    <title>{this.state.data && this.state.data.username}</title>
                </Helmet>
                {
                    this.state.data && this.state.data.username &&
                        (
                            
                            <>
                                <UserProfile user={user} />
                                <div className={[style.container, animate.animated, animate.fadeIn].join(' ')}>
                                    <div className={style.tabContainer}>
                                        <NavLink 
                                            exact to={`/user/${match.params.username}`} 
                                            activeClassName={style.active}
                                        >
                                            About
                                        </NavLink>
                                        <NavLink 
                                            to={`/user/${match.params.username}/images`} 
                                            activeClassName={style.active}
                                        >
                                            Images
                                        </NavLink>
                                        <NavLink 
                                            to={`/user/${match.params.username}/friends`} 
                                            activeClassName={style.active}
                                        >
                                            Friends
                                        </NavLink>
                                    </div>
                                    <Route 
                                        exact 
                                        path={`${match.path}`} 
                                        render={(props) => <About {...props} data={about} />}
                                    />
                                    <Route 
                                        exact
                                        path={`${match.path}/images`} 
                                        render=
                                        {
                                            props => images.length ? 
                                                <Images {...props} data={images} /> 
                                            : 
                                                <div style={{ textAlign: 'center' }}>{`${this.props.user.username} doesn't have any image`}</div>
                                        }
                                    />
                                    <Route 
                                        exact
                                        path={`${match.path}/friends`} 
                                        render=
                                        {
                                            props => friends.length ? 
                                                <Friends {...props} data={friends} /> 
                                            : 
                                                <div style={{ textAlign: 'center' }}>{`${this.props.user.username} doesn't have any friend`}</div>
                                        }
                                    />
                                </div>
                            </>
                        )
                }

                {
                    !this.state.data &&
                        <div className={style.loader}>
                            <Loader size={'70px'} />
                        </div>
                }

                {
                    this.state.data && !this.state.data.username &&
                        <div className={style.loader}>
                            NotFound
                        </div>  
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.data,
    user: state.user
});

export default connect(mapStateToProps)(User);