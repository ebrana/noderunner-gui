import React from 'react';
import Time from './time';
import moment from 'moment';

export const Status = (props) => {
    var className = "btn btn-" + (props.row.status ? props.row.status.replace('running', 'warning').replace('idle', 'info').replace('fetched', 'info').replace('error', 'danger').replace('planed', 'info').replace('stucked', 'warning') : '-') + " btn-xs";
    var iconClassName = "fa fa-" + (props.row.status ? props.row.status.replace('running', 'refresh').replace('idle', 'coffee').replace('fetched', 'hourglass-end').replace('success', 'check').replace('error', 'exclamation').replace('planed', 'hourglass-start').replace('stucked', 'exclamation-triangle') : '-') + " btn-xs";
    return (
        <span style={{width: '85px', textAlign: 'left'}} className={className}>
            <span className={iconClassName}></span>
            <span style={{textAlign: 'center', width: '60px', display: 'inline-block', paddingRight: '5px'}}>{props.row.status}</span>
        </span>
    );
}

export const RunTime = (props) => {
    return (<Time started={props.row.started}/>)
}

export const Started = (props) => {
    return (<span style={{}}>{moment(props.row.started * 1000).fromNow().replace('minutes', 'mins')}</span>)
}

export const Thread = (props) => {
    return (<span style={{fontSize: '2em'}}>#{props.row.thread+1}</span>)
}

export const Job = (props) => {
    if (props.row.args) {
        var args = /.* (\w*-\w*-\w*) 2>>/.exec(props.row.args);
        args = args && args[1] ? args[1] : props.row.args;
    } else {
        var args = props.row.job;
    }
    return (<span style={{fontFamily: "Courier New"}}>{args}</span>)
}

export const Host = (props) => {
    if (props.row.basePath) {
        var host = props.row.basePath.replace('/home/www/','');
    } else {
        var host = props.row.host.replace('http://','');
    }
    return (<span style={{fontFamily: "Courier New"}}>{host}</span>)
}

export const Default = (props) => {
    return (<span style={{fontFamily: "Courier New"}}>{props.row[props.col]}</span>)
}
