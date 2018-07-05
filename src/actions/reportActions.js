import * as types from './actionTypes';
import ReportService from '../services/reportService'

export const fetchReportInit = () => {
    return {
        type: types.REPORT_FETCH,
    }
};

export const fetchReportSuccess = (data) => {
    return {
        type: types.REPORT_FETCH_SUCCESS,
        data
    };
};

export const fetchReportFailed = error => {
    return {
        type: types.REPORT_FETCH_FAILED,
        error
    };
};

export const fetchReport = () => {
    return {
        pass: true, // to pass through middleware to block other requests
        fn: dispatch => {
            dispatch(fetchReportInit());
            // simulate fetch request
            try{
                setTimeout(() => {
                    let result = JSON.parse(ReportService.getData());
                    dispatch(fetchReportSuccess(result))
                }, 1500)
            }catch(err) {
                dispatch(fetchReportFailed(err));
            }
        }
    }
};