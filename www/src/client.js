import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import Layout from "./components/Layout";
import { getToken } from './utils/token';
import createStore from "./store";
import io from 'socket.io-client';
import { createBrowserHistory } from 'history';

import './style/fontawasome.css';
import './style/main.scss';
import './utils/icons';

const store = createStore( window.REDUX_DATA );
const history = createBrowserHistory();

if (window.REDUX_DATA.user) {
    let token = getToken();
    
    let socket = io(process.env.API_URL, { query: { token } });

    window.socket = socket;
}

const jsx = (
    <ReduxProvider store={ store }>
        <Router history={history}>
            <Layout history={history} />
        </Router>
    </ReduxProvider>
);

const app = document.querySelector( 'root' );
ReactDOM.hydrate( jsx, app );