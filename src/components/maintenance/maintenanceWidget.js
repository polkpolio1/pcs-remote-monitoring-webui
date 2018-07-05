// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { browserHistory } from "react-router";
import MaintenanceSummary from './maintenanceSummary';
import SystemStatusGrid from '../systemStatusGrid/systemStatusGrid';
import AlarmsByRuleGrid from './alarmsByRuleGrid';
import lang from '../../common/lang';

import './maintenanceWidget.css';

class MaintenanceWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedGrid: 'alarms',
      timerange: 'PT1H',
      lastRefreshed: new Date()
    }

    this.selectGrid = this.selectGrid.bind(this);
  }

  onSoftSelectChange({ jobId }) {
    browserHistory.push({ pathname: `/maintenance/job/${jobId}`});
  }

  selectGrid(e) {
    const selectedGrid = e.currentTarget.textContent === 'Alarms' ? 'alarms' : 'system';
    this.setState({ selectedGrid });
  }

  render() {
    const systemStatusProps = {
      onSoftSelectChange: this.onSoftSelectChange,
      loadingInProgress: this.props.jobsLoadingInProgress,
      jobs: this.props.jobs,
      devices: this.props.devices
    };

    const jobDetailsProps = {
      failed: 0,
      total: 0,
      succeeded: 0,
    };

    (this.props.jobs || []).forEach(({ resultStatistics }) => {
    	if (resultStatistics) {
    		const { failedCount, succeededCount }  = resultStatistics;
    		if (failedCount) ++jobDetailsProps.failed; // Check failed jobs
    		if (failedCount + succeededCount) ++jobDetailsProps.total; // Check total jobs
    		if (succeededCount) ++jobDetailsProps.succeeded; // Check succeeded jobs
    	}
    });

    const totalAlarms = (this.props.alarms || []).filter(alarm => alarm.Status === 'open').length;
    const criticalAlarms = (this.props.alarms || []).filter(alarm => alarm.Status === 'open' && (alarm.Rule || {}).Severity === 'critical').length;
    const warningAlarms = (this.props.alarms || []).filter(alarm => alarm.Status === 'open' && (alarm.Rule || {}).Severity === 'warning').length;
    const maintenanceProps = {
      alarms: {
        total: totalAlarms,
        critical: criticalAlarms,
        warning: warningAlarms
      },

      jobs: jobDetailsProps,
      selectedGrid: this.state.selectedGrid
    };
    const alarmSelected = this.state.selectedGrid === 'alarms' ? '-active' : '';
    const systemSelected = this.state.selectedGrid === 'alarms' ? '' : '-active';
    const alarmsByRuleGridProps = {
      devices: this.props.devices,
      timerange: this.state.timerange,
      rowData: this.props.alarmsGridData
    };
    return (
      <div className="maintenance-container">
        <MaintenanceSummary {...maintenanceProps} />
        <div className="selection-bar">
          <div className={`selection-item${alarmSelected}`} onClick={this.selectGrid}>{lang.ALARMS}</div>
          <div className={`selection-item${systemSelected}`} onClick={this.selectGrid}>{lang.SYSTEM_STATUS}</div>
        </div>
        <div className={`grid-container${alarmSelected}`}><AlarmsByRuleGrid {...alarmsByRuleGridProps} /></div>
        <div className={`grid-container${systemSelected}`}><SystemStatusGrid {...systemStatusProps}/></div>
      </div>
    );
  }
}

export default MaintenanceWidget;
