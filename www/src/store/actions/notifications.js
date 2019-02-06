import { readNotifications, deleteNotification, newNotification } from '../creators/notifications';
import { readNotifications as readNotificationsReuest, deleteNotification as deleteNotificationRequest } from '../../api';

export const readTheNotifications = () => {
    readNotificationsReuest();
    return dispatch => dispatch(readNotifications());
}

export const deleteTheNotification = id => {
    deleteNotificationRequest(id);
    return dispatch => dispatch(deleteNotification(id));
}

export const addNewNotification = notification => 
    dispatch => dispatch(newNotification(notification));