export const setAlert = (html, list) => ({
    type: 'SET_ALERT',
    html,
    list
});

export const clearAlert = () => ({
    type: 'CLEAR_ALERT'
});