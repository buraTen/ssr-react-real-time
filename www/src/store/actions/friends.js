import { getMessage, setCurrent, friendStatus, newRequest, removeRequest, request, newFriend, removeFriend } from '../creators/friends';

export const getNewMessage = (userId, message, by, date) => dispatch => dispatch(getMessage(userId, message, by, date));

export const setCurrentFriend = id => dispatch => {
    dispatch(setCurrent({ current: id }));
}

export const changeFriendStatus = (friend, status) => dispatch => {
    dispatch(friendStatus(friend, status));
}

export const newFriendshipRequest = (user, client) => dispatch => dispatch(newRequest(user, client));

export const removeFriendshipRequest = user => dispatch => dispatch(removeRequest(user));

export const friendshipRequest = (user, client) => dispatch => dispatch(request(user, client));

export const addNewFriend = friend => dispatch => dispatch(newFriend(friend));

export const removeTheFriend = id => dispatch => dispatch(removeFriend(id));