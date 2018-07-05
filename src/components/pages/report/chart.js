import React, { Component } from 'react';
import c3 from 'c3';

class Chart extends Component {
    componentDidMount() {
        let chart = c3.generate({
            bindto: '#chart',
            data: {
                x: 'x',
                xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
                columns: []
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%H:%M:%S'
                    }
                }
            }
        });

        this.props.setChart(chart);
    }

    render(){
        return <div className="chart-wrapper">
            <div className="title">Temperature Measurement Of Selected Period</div>
            <div id="chart" />
        </div>
    }
}

export default Chart;