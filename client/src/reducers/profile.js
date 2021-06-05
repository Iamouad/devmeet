import { CLEAR_PROFILE, GET_PROFILE, UPDATE_PROFILE } from "../actions/types";
import { PROFILE_ERROR } from './../actions/types';

const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {}
}

export default function (state = initialState, action) {
    const {type, payload} = action;

    switch (type){
        case GET_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                loading: false
            };
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            };
        
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state
    }
}