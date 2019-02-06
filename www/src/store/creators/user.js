export const initializeSession = (data) => ({
    type: 'INITIALIZE_SESSION',
    data
});

export const newMessage = (by, message, date) => ({
    type: 'GET_NEW_MESSAGE_BY_FRIEND',
    by,
    message,
    date
});

export const readMessages = friend => ({
    type: 'READ_MESSAGES',
    friendId: friend.friendId
});

export const newImage = image => ({
    type: 'NEW_IMAGE',
    image
});

export const changeAvatar = avatar => ({
    type: 'CHANGE_AVATAR',
    avatar
});

export const changeBackground = background => ({
    type: 'CHANGE_BACKGROUND',
    background
});