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

export const Statusinfo = (props) => {
    return (<span>{Status(props)}{Infoonly(props)}</span>)
}

export const Runtime = (props) => {
    return (<Time started={props.row.started}/>)
}

export const Duration = (props) => {
    return (<span style={{fontFamily: "Courier New"}}>{Math.round((props.row.finished - props.row.started)*10)/10 + ' s'}</span>)
}

export const Finished = (props) => {
    return (<span style={{fontFamily: "Courier New"}}>{moment(props.row.finished * 1000).format('D.M. H:mm:ss').replace(' ',"\u00A0")}</span>)
}

export const Started = (props) => {
    return (<span style={{fontFamily: "Courier New"}}>{moment(props.row.started * 1000).fromNow().replace('minutes', 'mins')}</span>)
}

export const Added = (props) => {
    return (<span style={{fontFamily: "Courier New"}}>{Math.round((Date.now()/1000-props.row.added)*10)/10 + 's ago'}</span>)
}

export const Infoonly = (props) => {
    return (
        <a href="#" onClick={(e) => {
            if (props.row.finished && props.row.started) {
                props.row.duration = Math.round((props.row.finished-props.row.started)*10)/10 + 's'
            }
            if (props.row.added && props.row.started) {
                props.row.waiting = Math.round((props.row.started-props.row.added)*10)/10 + 's'
            }
            let content = Object.keys(props.row).map((key) => '<tr><th>'+key+'</th><td style="padding-left:10px; font-family: \'Courier New\'">'+props.row[key]+'</td>');

            let $dialog = $('<div id="dialog"><table>'+content.join('')+'</table></div>').appendTo('body');
            $dialog.dialog({
                title: 'Job details',
                width: 800,
                close: function( event, ui ) {
                    $dialog.remove();
                }
            });
            e.preventDefault();
            e.stopPropagation();
        }} className="btn btn-info">
            <span className="fa fa-question"></span>
        </a>
    )
}

export const Reruninfo = (props) => {
    return (
        <span>
            {Infoonly(props)}
            <a href="#" onClick={(e) => {
                props.socket.emit('rerun', {id: props.row._id, queue: props.row.queue});
                e.preventDefault();
                e.stopPropagation();
            }} className="btn btn-info">
                <span className="fa fa-refresh"></span>
            </a>
        </span>
    )
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
        var host = props.row.host.replace('http://','').replace('https://','');
    }
    return (<span style={{fontFamily: "Courier New"}}>{host}</span>)
}

export const Default = (props) => {
    let val = props.row[props.col];
    return (<span style={{fontFamily: "Courier New"}}>{val ? (val.substring(0, 200) + ((val.length > 200) ? ' ...' : '')) : ''}</span>)
}
