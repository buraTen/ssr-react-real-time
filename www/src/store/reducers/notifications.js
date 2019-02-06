export default (state = [], action) => {
    switch (action.type) {
        case 'STORE_NOTIFICATIONS':
            return action.notifications;

        case 'READ_NOTIFICATIONS':
            let notifications = state;
            for (let i = 0; i < notifications.length; i++) {
                notifications[i].unread = false;
            }
            return notifications;

        case 'DELETE_NOTIFICATION':
            let i = state.map(not => not._id).indexOf(action.id);
            return [
                ...state.slice(0, i),
                ...state.slice(i + 1)
            ];

        case 'NEW_NOTIFICATION':
            return [...state, action.notification];
    
        default: return state;
    }
}