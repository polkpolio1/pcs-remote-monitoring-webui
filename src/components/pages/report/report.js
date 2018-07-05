import React, { Component } from 'react';

import SelectedItem from './selectedItem'
import Spinner from '../../spinner/spinner';
import Chart from './chart'
import './report.css';

const parseToSelect = (arr) => arr.map(v => ({ value: v, label: v}));

class Report extends Component {

    constructor(props) {
        super(props);

        this.updateChart = this.updateChart.bind(this);
        this.clearChart = this.clearChart.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.setChart = this.setChart.bind(this);

        this.state = {
            selectedBaseStations: null,
            selectedMeasurement: null,
            selectedInsideNode: null
        };

        this.chart = null;
    }

    componentWillReceiveProps(nextProps) {
        // default init by first params
        if(nextProps.report.fetched && !this.props.report.fetched){
            const { data } = nextProps.report;
            let selectedBaseStations = Object.keys(data)[0],
                selectedMeasurement = Object.keys(data[selectedBaseStations])[0],
                selectedInsideNode = Object.keys(data[selectedBaseStations][selectedMeasurement])[0];

            this.setState({
                selectedBaseStations,
                selectedMeasurement,
                selectedInsideNode
            },() => {
                this.updateChart();
            })
        }
    }

    componentDidMount() {
        // fetch data
        this.props.actions.fetchReport();
    }

    selectChange(type, selectedValue) {
        // clear selected values which depends on previous selects;
        let clearSelectedValues = {};
        if(type === 'selectedBaseStations'){
            clearSelectedValues.selectedInsideNode = null;
            clearSelectedValues.selectedMeasurement = null;
        }else if(type === 'selectedMeasurement'){
            clearSelectedValues.selectedInsideNode = null;
        }

        this.setState({
            [type]: selectedValue.value,
            ...clearSelectedValues
        })
    }

    updateChart() {
        const {data} = this.props.report;
        const {
            selectedBaseStations,
            selectedMeasurement,
            selectedInsideNode
        } = this.state;

        if(!this.validateForm()){
            return
        }

        const dataExample =  data[selectedBaseStations][selectedMeasurement][selectedInsideNode];
        this.chart.load({
            columns: [
                ['x', ...dataExample.time],
                ['temperature', ...dataExample.temperature]
            ]
        });
    }

    clearChart() {
        this.chart.unload();
    }

    setChart(chart) {
        this.chart = chart;
    }

    validateForm() {
        return this.state.selectedBaseStations !== null &&
            this.state.selectedMeasurement !== null  &&
            this.state.selectedInsideNode !== null
    }

    render() {
        const {data, fetching} = this.props.report;

        const {
            selectedBaseStations,
            selectedMeasurement,
            selectedInsideNode
        } = this.state;

        let optionsToSelects = {
            baseStations: parseToSelect(Object.keys(data)),
            measurements: selectedBaseStations ? parseToSelect(Object.keys(data[selectedBaseStations])) : [],
            insideNodes: selectedBaseStations && selectedMeasurement
                ? parseToSelect(Object.keys(data[selectedBaseStations][selectedMeasurement]))
                : []
        };

        return (
            <div className="report">
                {fetching && <div className="spinner-wrapper"><Spinner /></div>}

                <h1>gOMS U-Value Calculator</h1>

                <div className="params-calculate">
                    <SelectedItem
                        title="Select a base station:"
                        value={selectedBaseStations}
                        options={optionsToSelects.baseStations}
                        onChange={(selectedOption) => {this.selectChange('selectedBaseStations', selectedOption)}}
                    />
                    <SelectedItem
                        title="Select a Measurement:"
                        value={selectedMeasurement}
                        options={optionsToSelects.measurements}
                        onChange={(selectedOption) => {this.selectChange('selectedMeasurement', selectedOption)}}
                    />
                    <SelectedItem
                        title="Select Inside Node:"
                        value={selectedInsideNode}
                        options={optionsToSelects.insideNodes}
                        onChange={(selectedOption) => {this.selectChange('selectedInsideNode', selectedOption)}}
                    />
                    <button className={`btn btn-primary ${!this.validateForm() ? 'disabled' : ''}`} onClick={this.updateChart}>Apply</button>
                </div>

                <div className="main">
                    <Chart setChart={this.setChart} chart={this.chart} />
                    <div className="info">
                        <div className="title">U-value analysis</div>
                        <div className="content">
                            <p>Current base station: {selectedBaseStations || "—"}</p>
                            <p>Selected measurement: {selectedMeasurement || "—"}</p>
                            <p>Selected device node: {selectedInsideNode || "—"}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Report