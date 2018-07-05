// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';
import initialState from './initialState';

const reportReducer = (state = initialState.report, action) => {
    switch (action.type) {
        case types.REPORT_FETCH:
            return {
                ...state,
                fetching: true,
                fetched: false,
            };

        case types.REPORT_FETCH_SUCCESS:
            return {
                ...state,
                data: action.data,
                fetched: true,
                fetching: false
            };

        case types.REPORT_FETCH_FAILED:
            return {
                ...state,
                err: action.err,
                fetching: false
            };

        default:
            return state;
    }
};

export default reportReducer;
