import React from 'react';
import QueueJobsList from './queuejobslist';
import * as columnComponents from './columns';

const COLUMNS = ['thread', 'host', 'job', 'status'];

export default class RunningJobsList  extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {data: []};

        this.props.socket.on('runningJobsList', data => {
            // console.log('runningJobsList', data);
            this.setState({data: data});
        });

        // add job to list
        this.props.socket.on('jobFetched', job => {
            // console.log('jobFetched', job);

            let state = Object.assign({}, this.state);
            state.data.push(job);
            this.setState(state);
        });

        // remove job from running list
        this.props.socket.on('jobCompleted', job => {
            // console.log('jobCompleted', job);

            let state = Object.assign({}, this.state);
            let index = state.data.findIndex(j => j && j._id == job._id);
            delete state.data[index];
            this.setState(state);
        });

        // job status changed
        this.props.socket.on('jobStarted', job => {
            // console.log('jobStarted', job);

            let state = Object.assign({}, this.state);
            let index = state.data.findIndex(j => {
                return j && j._id == job._id;
            });
            state.data[index] = job;
            this.setState(state);
        });
    }

    render() {
        return (
            <table className="table running" style={{}}>
                <thead>
                    <tr>
                        {COLUMNS.map((col) => (<th className={col} key={col}>{col.replace('thread','thrd')}</th>))}
                    </tr>
                </thead>
                <tbody>
                {[...Array(this.props.threads).keys()].reverse().map((idx) => {

                    var row = this.state.data.find((r) => r && r.thread == idx);

                    if (row) {
                        return (
                            <tr className={"row"+idx} key={idx} onClick={() => this.rowClick.bind(this, row)}>
                                {COLUMNS.map((col) => {

                                    var component = col[0].toUpperCase() + col.slice(1);
                                    var Column = columnComponents[component] ? columnComponents[component] : columnComponents.Default;

                                    return (
                                        <td className={col} key={row._id + col}>
                                            <Column col={col} row={row} />
                                        </td>
                                    );

                                })}
                            </tr>
                        );
                    } else {
                        return (
                            <tr className={"row"+idx} key={idx}>
                                <td className="thread"><columnComponents.Thread row={{thread: idx}} /></td>
                                <td colSpan={COLUMNS.length - 2}></td>
                                <td className="status"><columnComponents.Status row={{status: 'idle'}} /></td>
                            </tr>
                        );
                    }
                })}
                </tbody>
            </table>
        );
    }

}