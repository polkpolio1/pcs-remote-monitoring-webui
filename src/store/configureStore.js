import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import {
    REPORT_FETCH_SUCCESS,
    REPORT_FETCH_FAILED,
    REPORT_FETCH
} from '../actions/actionTypes';

// for block failed actions
const customMiddleWare = store => next => action => {
    if(action.pass || [REPORT_FETCH_SUCCESS, REPORT_FETCH_FAILED, REPORT_FETCH].indexOf(action.type) !== -1){
        next(action.fn ? action.fn : action);
    } else {
        next({type: "BLOCK"});
    }
};

const createStoreWithMiddleware = applyMiddleware(
  customMiddleWare,
  thunkMiddleware,
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
