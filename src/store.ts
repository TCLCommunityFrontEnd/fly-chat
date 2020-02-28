import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import RootReducer from './rootReducer';

let store:any;

if(process.env.NODE_ENV==='production')
    store = createStore(RootReducer, applyMiddleware(thunk));
else{
    const {createLogger} = require('redux-logger');
    const logger = createLogger();
    store = createStore(RootReducer, applyMiddleware(thunk,logger));
}

export default store;