import Cookie from 'js-cookie';

export function setToken(token){
    return Cookie.set('token', token);
}

export function getToken(){
    return Cookie.get('token');
}

export function clearToken(){
    return Cookie.remove('token');
}