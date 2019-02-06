import React from 'react';
import Helmet from 'react-helmet';
import Loader from '../../components/Loader';
import { connect } from 'react-redux';
import UserItem from '../../components/UserItem';
import { search } from '../../api';
import style from './style.scss';

class Search extends React.Component{
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
        return search(params[1]);
    }

    async componentDidMount(){
        if (!this.state.data) {
            let data = await search(this.props.match.params.query);
            this.setState({ data });
        }
    }

    componentWillReceiveProps(next){
        if (this.props.match.params.query !== next.match.params.query) {
            this.setState({ data: null });
            search(next.match.params.query)
                .then(data => this.setState({data: data}));
        }
    }

    render(){
        return (
            <div className={style.container}>
                <Helmet><title>Search</title></Helmet>
                {
                    this.state.data ? 
                        this.state.data.length ? 
                            this.state.data.map(user => 
                                <UserItem key={user.id} user={{...user, name: `${user.first} ${user.last}`}} />
                            )
                        :
                            <div className={style.wrapper}>
                                No user match
                            </div>
                    :
                        <div className={style.wrapper}>
                            <Loader size={80} />
                        </div>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    data: state.data
});

export default connect(mapStateToProps)(Search);