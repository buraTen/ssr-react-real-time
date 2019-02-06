import request from './utils/request';

export function authendicate(token){
    return request('/api/v1/users/auth', { method: 'POST' }, token );
}

export function fetchUserByUsername( username ) {
    return request('/api/v1/users/' + username );
}

export function signUp( user ){
    return request('/api/v1/users', { method: 'POST', body: user });
}

export function signIn( user ){
    return request('/api/v1/users/signin', { method: 'POST', body: user });
}

export function readMessages(user){
    return request('/api/v1/users/messages', { method: 'PUT', body: { user } });
}

export function readNotifications(){
    return request('/api/v1/users/notifications', { method: 'PUT' });
}

export function deleteNotification(id){
    return request('/api/v1/users/notifications', { method: 'DELETE',  body: { id } });
}

export function changeAvatar(avatar){
    return request('/api/v1/users/avatar', { method: 'PUT', body: { avatar } });
}

export function changeBackground(background){
    return request('/api/v1/users/background', { method: 'PUT', body: { background } });
}

export function search(q){
    return request(`/api/v1/users/search/${q}`, { method: 'GET' });
}

export function fetchSuggestedUsers(token){
    return request(`/api/v1/users/suggested`, { method: 'GET' }, token);
}

export function getCountries(){
    return request('/api/v1/countries');
}