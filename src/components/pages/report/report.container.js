import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions';

import Report from './report';

const mapStateToProps = state => {
    return {
        report: state.reportReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Report);
