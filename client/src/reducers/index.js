import {combineReducers} from 'redux';
import auth from './auth';
import alert from './alert';
import profile from './profile';


//combining reducers
export default combineReducers(
    {
        alert,
        auth,
        profile
    }
);