import fetch from "isomorphic-fetch";
import { getToken } from './token';

function request(url, options = {}, token = null){

    if (!token) {
        token = getToken();
    }
    
    let defaultOptions = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        ...options
    };

    if (options.body) {
        defaultOptions.body = JSON.stringify(options.body)
    }

    if (token){
        defaultOptions.headers.Authorization = `Bearer ${token}`;
    }

    return fetch( process.env.API_URL + url, defaultOptions )
        .then( res => res.json( ) )
        .then( res => res );

}

export default request;