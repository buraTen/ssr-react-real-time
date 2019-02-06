export const storeNotifications = notifications => ({
    type: 'STORE_NOTIFICATIONS',
    notifications: notifications.notifications
});

export const readNotifications = () => ({
    type: 'READ_NOTIFICATIONS'
});

export const deleteNotification = id => ({
    type: 'DELETE_NOTIFICATION',
    id
});

export const newNotification = notification => ({
    type: 'NEW_NOTIFICATION',
    notification
});