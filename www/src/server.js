import express from 'express';
import path from 'path';
import fs from 'fs';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import Helmet from 'react-helmet';

import routes from './routes';
import Layout from './components/Layout';
import createStore from './store';
import { initializeSession } from './store/creators/user';
import { storeFriends } from './store/creators/friends';
import { storeNotifications } from './store/creators/notifications';
import { authendicate } from './api';
import { storeData } from './store/creators/data';

import cookieparser from 'cookieparser';

import { config as dotEnvConfig } from 'dotenv';
import './utils/icons';

dotEnvConfig();

const app = express();
const port = process.env.PORT || 80;

app.use(express.static(path.resolve(__dirname, '../dist')));
app.use('/static', express.static(path.resolve(__dirname, '../static')))

app.get('/*', async (req, res) => {
    
    const context = {};
    const store = createStore();

    let cookie;
    let token;

    if (req.headers.cookie) {
        cookie = cookieparser.parse(req.headers.cookie);
        token = cookie.token;
    }

        if (token) {
            try {
                await authendicate(token).then(data => {
                    store.dispatch(initializeSession(data.user));
                    store.dispatch(storeFriends({ data: data.friends }));
                    store.dispatch(storeNotifications({ notifications: data.notifications }));
                });
            } catch (e) {
                res.clearCookie('token');
            }
        }

    const params = req.params[0].split('/');
    let currentRoute = routes.find(route => matchPath(req.url, route));
    if (currentRoute && currentRoute.component.WrappedComponent && currentRoute.component.WrappedComponent.serverFetch) {
        
        let serverData = await currentRoute.component.WrappedComponent.serverFetch({params, store, req, token});
        if (serverData) {
            store.dispatch(storeData(serverData));
        }

    }

    const jsx = (
        <ReduxProvider store={store}>
            <StaticRouter context={context} location={req.url}>
                <Layout />
            </StaticRouter>
        </ReduxProvider>
    );

    const reactDom = renderToString(jsx);
    const reduxStore = store.getState();
    const helmetData = Helmet.renderStatic();

    let stylesheet = '';
    if (process.env.NODE_ENV === 'production') {
        stylesheet = await new Promise((resolve) => {
            fs.readFile(path.resolve(__dirname, '../dist/bundle.css'), (err, css) => {
                if (err) {
                    resolve('<link rel="stylesheet" href="/bundle.css" />');
                } else {
                    resolve('<style>' + css.toString() + '</style>');
                }
            })
        });
    }

    const template = htmlTemplate(reactDom, reduxStore, helmetData, stylesheet);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(template);

});

app.listen(port);

function htmlTemplate( reactDom, reduxState, helmetData, stylesheet ) {

    let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="google" content="notranslate">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="icon" type="image/png" href="/static/logo.png">
            ${ helmetData.title.toString( ) }
            ${ helmetData.meta.toString( ) }
            ${ stylesheet }
        </head>
        
        <body>
            <noscript>This website requires Javascript</noscript>
            <root>${ reactDom }</root>
            <script>
                window.REDUX_DATA = ${ JSON.stringify( reduxState ) }
            </script>
            <script src="/vendor.js"></script>
            <script src="/bundle.js"></script>
        </body>
        </html>
    `;

    return html.replace(/\n|\r|\  +/g, '');
}
