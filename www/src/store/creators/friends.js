export const storeFriends = (friends) => ({
    type: 'STORE_FRIENDS',
    data: friends.data,
    current: friends.current
});

export const getMessage = (userId, message, by, date) => ({
    type: 'GET_NEW_MESSAGE',
    userId,
    message,
    by,
    date
});

export const setCurrent = (friend) => ({
    type: 'SET_CURRENT',
    current: friend.current
});

export const friendStatus = (friend, status) => ({
    type: 'CHANGE_FRIEND_STATUS',
    friend,
    status
});
//
export const newRequest = (user, client) => ({
    type: 'NEW_REQUEST',
    user,
    client
});

export const removeRequest = user => ({
    type: 'REMOVE_REQUEST',
    user
});

export const request = (user, client) => ({
    type: 'GET_REQUEST',
    user,
    client
});

export const newFriend = friend => ({
    type: 'NEW_FRIEND',
    friend
});

export const removeFriend = id => ({
    type: 'REMOVE_FRIEND',
    id
});
