import _ from 'lodash';
import React from 'react';
import * as columnComponents from './columns';

export default class QueueJobsList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {data: [], filter: {}, showFilter: false};

        this.props.socket.on(this.props.queueName + 'QueueData', data => {
            console.log(this.props.queueName + 'QueueData', data)
            this.setState({data: data});
        });

        this.props.socket.emit('requestQueueData', {queue: this.props.queueName, filter: {}});
    }

    toggleFilter() {
        this.setState(Object.assign(this.state, {showFilter: !this.state.showFilter}));
        if (!this.state.showFilter) {
            this.setState(Object.assign(this.state, {filter: {}}));
            this.onRefresh();
        }
    }

    onRefresh() {
        this.props.socket.emit('requestQueueData', {queue: this.props.queueName, filter: this.state.filter});
    }

    setFilterItem(key, value) {
        if (value && value.length > 0) {
            this.state.filter[key] = value;
        } else {
            delete this.state.filter[key];
        }
        this.setState(this.state);

        this.props.socket.emit('requestQueueData', {queue: this.props.queueName, filter: this.state.filter});
    }

    render() {

        return (
            <div className={'col-md-'+(this.props.sizeMd ? this.props.sizeMd : this.props.size)+' col-sm-'+(this.props.sizeSm ? this.props.sizeSm : this.props.size)+' col-xs-'+(this.props.sizeXs ? this.props.sizeXs : this.props.size)}>
                <div className="x_panel">
                    <div className="row x_title" style={{position: 'relative', zIndex: 1000}}>
                        <h2>{this.props.title}</h2>
                        <ul className="nav navbar-right panel_toolbox">
                            <li><a className={'close-link btn' + (this.state.showFilter ? ' active' : '')} onClick={() => this.toggleFilter()}><i className="fa fa-filter"></i></a></li>
                            <li><a className={'close-link btn'} onClick={() => this.onRefresh()}><i className="fa fa-refresh"></i></a></li>
                        </ul>
                    </div>
                    <div className="x_content-">
                        {this.state.data.length || this.state.showFilter ? (
                            <table className="table">
                                <thead>
                                    <QueueJobsListHeaderTr columns={this.props.columns} />
                                    <QueueJobsListFilterTr columns={this.props.columns} setFilterItem={_.debounce(this.setFilterItem.bind(this), 500)} showFilter={this.state.showFilter} />
                                </thead>
                                <tbody>
                                {this.state.data.map((row, idx) => (
                                    <tr className={"row" + idx} key={idx} onClick={() => {}}>
                                        {this.props.columns.map((col) => {

                                            var component = col[0].toUpperCase() + col.slice(1);
                                            var Column = columnComponents[component] ? columnComponents[component] : columnComponents.Default;

                                            return (
                                                <td className={col} key={row._id + col}>
                                                    <Column col={col} row={row} socket={this.props.socket} />
                                                </td>
                                            );

                                        })}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : false}
                    </div>
                </div>
            </div>
        );
    }

}

QueueJobsList.propTypes = {
    socket: React.PropTypes.object.isRequired
};

export class QueueJobsListFilterTr extends React.Component {
    render() {
        return (
            <tr style={{backgroundColor: '#f8f8f8', display: (this.props.showFilter ? 'table-row' : 'none')}}>
                {this.props.columns.map((title, idx) => {
                    if (title == 'status') {
                        return (<th key={idx}><select name="status" onChange={(e) => this.props.setFilterItem(e.target.name, e.target.value)}>
                                    <option value="">-</option>
                                    <option>planed</option>
                                    <option>running</option>
                                    <option>fetched</option>
                                    <option>success</option>
                                    <option>error</option>
                                </select></th>);
                    } else if (title != 'duration' && title != 'finished' && title != 'reruninfo' && title != 'infoonly') {
                        return (<th key={idx}><input autoComplete="off" name={title} onChange={(e) => this.props.setFilterItem(e.target.name, e.target.value)} style={{width: '100%', fontWeight: 'normal'}} type="text"/></th>);
                    } else {
                        return (<th key={idx}></th>);
                    }
                })}
            </tr>
        );
    }
}

export class QueueJobsListHeaderTr extends React.Component {
    render() {
        return (
            <tr>{this.props.columns.map(function (title, idx) {
                /*if (title == 'schedule') {
                    return (<th style={{paddingLeft: 150}} key={idx}>{title}</th>);
                } else */if (title != 'reruninfo' && title != 'infoonly' && title != 'status') {
                    return (<th style={{paddingBottom: 15}} key={idx}>{title}</th>);
                } else {
                    return (<th key={idx}></th>);
                }
            })}</tr>
        );
    }
}