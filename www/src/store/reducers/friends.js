export default (state = {}, action) => {
    switch (action.type) {
        case 'STORE_FRIENDS':
            return { data: action.data.active, requests: action.data.requests, current: null };
    
        case 'GET_NEW_MESSAGE':
            let data = [...state.data];
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === action.userId) {
                    data[i].messages.push({ by: action.by, message: action.message, date: action.date })
                }
            }
            return {...state, data: data}

        case 'CHANGE_FRIEND_STATUS':
            let friends = state.data;
            for (let i = 0; i < friends.length; i++) {
                if (friends[i].id === action.friend) {
                    friends[i].status = action.status;
                }
            }
            return {...state, data: friends};

        case 'SET_CURRENT':
            return {...state, current: action.current}

        case 'NEW_REQUEST':
            return {...state, ...state.requests.push(
                { by: { id: action.client }, to: { id: action.user }, active: false }
            )};

        case 'REMOVE_REQUEST':
            let requestToBeRemoved = state.requests;
            for (let i = 0; i < requestToBeRemoved.length; i++) {
                if (requestToBeRemoved[i].to.id === action.user) {
                    requestToBeRemoved.splice(i, 1);
                }
            }
            return {...state, requests: requestToBeRemoved};

        case 'GET_REQUEST':
            return {
                ...state,
                requests: [
                    ...state.requests,
                    { by: action.user, to: action.client, active: false }
                ]
            };

        case 'NEW_FRIEND':
            action.friend.messages = [];
            action.friend.status = 'online';
            return { ...state, data: [ ...state.data, action.friend ] };

        case 'REMOVE_FRIEND':
            let friendToBeRemoved = state.data;
            for (let i = 0; i < friendToBeRemoved.length; i++) {
                if (friendToBeRemoved[i].id === action.id) {
                    friendToBeRemoved.splice(i, 1);
                }
            }
            return {...state, data: friendToBeRemoved};

        default: return state;
    }
}