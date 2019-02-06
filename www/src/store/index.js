import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducers';

export default (initialState) => createStore(reducer, initialState, applyMiddleware(thunkMiddleware));