import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from '../../routes';
import Header from '../Header';
import Alert from '../Alert';
import animate from '../../style/animate.scss';
import style from './style.scss';
import Loader from '../Loader';
import requireAuth from '../../HOC/RequireAuth';
import NoSsr from 'react-no-ssr';

class Layout extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <>  
                <Header {...this.props} />
                    <main className={style.main}>
                        <Switch>
                            {
                                routes.map(route => 
                                    <Route 
                                        key={route.path} 
                                        {...route} 
                                        component={ route.requireAuth ? requireAuth(route.component) : route.component }
                                    /> 
                                )
                            }
                        </Switch>
                    </main>
                <Alert list={['Wrong username', 'Wrong password']} />
            </>
        );
    }
}

export default Layout;