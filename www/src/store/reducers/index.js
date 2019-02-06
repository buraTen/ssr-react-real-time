import { combineReducers } from 'redux' ;
import userReducer from './user';
import dataReducer from './data';
import friendsReducer from './friends';
import notificationsReducer from './notifications';
import alertReducer from './alert';

export default combineReducers({
    user : userReducer,
    data: dataReducer,
    friends: friendsReducer,
    notifications: notificationsReducer,
    alert: alertReducer
});