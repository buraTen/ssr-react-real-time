export default (state = null, action) => {
    switch (action.type) {
        case 'SET_ALERT':
            return {html: action.html, list: action.list}

        case 'CLEAR_ALERT':
            return null
    
        default: return state;
    }
}