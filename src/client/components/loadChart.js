import React from 'react';
import AmCharts from 'amcharts3-react';

export default React.createClass({

    getInitialState: function() {
        return {dataProvider: []}
    },

    parseLoadData: function(d) {
        d.date = new Date(d.intervalTo*1000)
        for (var i in d.byThread) {
            d['thread'+(i)] = d.byThread[i];
        }
        return d;
    },

    componentDidMount: function () {
        var self = this;

        this.props.socket.on('threadsStats', data => {
            self.setState({
                dataProvider: data.map((d) => self.parseLoadData(d))
            });
        });

        this.props.socket.on('newThreadsStat', data => {
            let dataProvider = self.state.dataProvider.slice(0)
            dataProvider.push(self.parseLoadData(data));
            self.setState({
                dataProvider: dataProvider
            });

            if (this.refs.chart.state.chart) {
                this.refs.chart.state.chart.validateData()
            }
        });

        if (this.props.onMount) {
            this.props.onMount();
        }
    },

    render: function () {
        return React.createElement(AmCharts, {
            "ref": "chart",
            "path": "node_modules/amcharts3/amcharts",
            "type": "serial",
            "theme": "light",
            "marginRight": 40,
            "marginLeft": 40,
            "marginBottom": 40,
            "autoMarginOffset": 20,
            "valueAxes": [{
                "id": "v1",
                "axisAlpha": 0,
                "position": "left",
                "ignoreAxisWidth": true,
                "stackType": "regular",
                "maximum": this.props.threads
            }],
            "balloon": {
                "borderThickness": 1,
                "shadowAlpha": 0
            },
            "graphs": [...Array(this.props.threads).keys()].reverse().map((i) => ({
                    "valueField": "thread"+i,
                    "color": "#67b7dc",
                    "fillAlphas": 0.8,
                    "lineAlpha": 0.4,
                    "showBalloon": (i-1 == this.props.threads),
                    "balloonText": (i-1 == this.props.threads) ? "<span style='font-size:18px;'><b>Load [[total]]</b></span><br />Thread #1: [[thread0]]<br />Thread #2: [[thread1]]<br />Thread #3: [[thread2]]" : null,
            })),
            "chartCursor": {
                "valueLineEnabled": true,
                "valueLineBalloonEnabled": true,
                "cursorAlpha":1,
                "cursorColor":"#258cbb",
                "limitToGraph":"g1",
                "valueLineAlpha":0.2,
                "zoomable": false,
                "categoryBalloonDateFormat":"DD/MM/YY JJ:NN:SS"
            },
            "categoryField": "date",
            "categoryAxis": {
                "parseDates": true,
                "dashLength": 1,
                "minorGridEnabled": true,
                "minPeriod": "10ss",
            },
            "dataProvider": this.state.dataProvider
        });
    }
});