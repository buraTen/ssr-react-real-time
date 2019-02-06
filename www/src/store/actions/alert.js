import { setAlert, clearAlert } from '../creators/alert';

export const newAlert = (html = null, list = []) => dispatch => {
    dispatch(clearAlert());
    dispatch(setAlert(html, list));
}

export const removeAlert = () => dispatch => dispatch(clearAlert());