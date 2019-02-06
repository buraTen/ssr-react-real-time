export default (state = null, action) => {
    switch (action.type) {
        case 'INITIALIZE_SESSION':
            return action.data;

        case 'GET_NEW_MESSAGE_BY_FRIEND':
            let userMessages = state.messages;
            userMessages.push({ by: action.by, date: action.date, message: action.message, unread: true });
            return {...state, messages: userMessages};

        case 'READ_MESSAGES':
            let messages = state.messages.map(message => {
                if(message.by === action.friendId){
                    return { ...message, unread: false };
                }
                return message
            })
            return { ...state, messages };

        case 'NEW_IMAGE':
            return { ...state, images: [ ...state.images, action.image ] };

        case 'CHANGE_AVATAR':
            return { ...state, avatar: action.avatar };

        case 'CHANGE_BACKGROUND':
            return { ...state, background: action.background };
    
        default: return state;
    }
}