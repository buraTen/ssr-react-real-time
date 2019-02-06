import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SignIn from '../../pages/SignIn';

const RequireAuth = BaseComponent => {

    class Auth extends React.Component {
        constructor(props){
            super(props);
        }

        render(){
            const isHome = this.props.location.pathname === '/';

            if (isHome) {
                return this.props.user ? <BaseComponent {...this.props} /> : <SignIn {...this.props} />
            } else {
                return this.props.user ? <BaseComponent {...this.props} /> : <Redirect to="/" />
            }
        }
    }

    const mapStateToProps = (state) => ({
        user: state.user
    });

    return connect(mapStateToProps)(Auth);

}

export default RequireAuth;