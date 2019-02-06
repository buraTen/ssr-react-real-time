export default (state = null, action) => {
    switch (action.type) {
        case 'STORE_DATA':
            return action.data
    
        default: return state;
    }
}