import { newMessage, readMessages, newImage, changeAvatar, changeBackground } from '../creators/user';
import { readMessages as readMessagesRequest, changeAvatar as changeAvatarRequest, changeBackground as changeBackgroundRequest } from '../../api';

export const getNewMessage = (by, message, date) => dispatch => dispatch(newMessage(by, message, date));

export const readTheMessages = friendId => dispatch => {
    dispatch(readMessages({ friendId }));
    readMessagesRequest(friendId);
}

export const addNewImage = image => dispatch => dispatch(newImage(image));

export const changeTheAvatar = avatar => async dispatch => {
    await changeAvatarRequest(avatar.id);
    dispatch(changeAvatar(avatar));
}

export const changeTheBackground = avatar => async dispatch => {
    await changeBackgroundRequest(avatar.id);
    dispatch(changeBackground(avatar));
}