import React from 'react';
import Time from './time.js';
import moment from 'moment';

export default class QueueJobsList extends React.Component {

  // TODO props types

  constructor(props) {
    super(props);
    this.state = {data: [], filter: {}};

    this.props.socket.on('initial' + this.props.queueName + 'Data', data => {
      //console.log('initial'+this.props.queueName+'Data', data)
      this.setState({data: data});
    });

    this.props.onFilterChange((toggle) => {
      this.state.showFilter = toggle;
      this.setState(this.state);
    });

  }


  setFilterItem(evt) {
    if (evt.target.value.length > 0) {
      this.state.filter[evt.target.name] = evt.target.value;
    } else {
      delete this.state.filter[evt.target.name];
    }
    this.setState(this.state);
    this.props.socket.emit('setQueueFilter', {queue: this.props.queueName, filter: this.state.filter});
  }

  render() {
    return this.state.data.length || this.state.showFilter ? (
        <table className="table" style={{position:'relative', top: -37, marginBottom: -37}}>
          <thead>
            <QueueJobsListHeaderTr columns={this.props.columns} />
            <tr style={{backgroundColor: '#f8f8f8', display: (this.state.showFilter ? 'table-row' : 'none')}}>
              {this.props.columns.map((title, idx) => {
                if (title == 'status') {
                  return (<th key={idx}><select name="status" onChange={this.setFilterItem.bind(this)}><option value="">-</option><option>planed</option><option>running</option><option>fetched</option><option>success</option><option>error</option></select></th>);
                } else if (title != 'duration' && title != 'finished' && title != 'rerun') {
                  return (<th key={idx}><input name={title} onChange={this.setFilterItem.bind(this)} style={{width:'100%', fontWeight: 'normal'}} type="text" /></th>);
                } else {
                  return (<th key={idx}></th>);
                }
              })}
            </tr>
          </thead>
          <tbody>
          {this.state.data.map((row, idx) => {
            row.command = row.interpreter + ' ' + row.executable + ' ' + row.args;
            row.implementation = row.basePath ? row.basePath.replace('/var/vyvoj/www/','').replace('/home/www/','') : '-';
            // var matches = curr.match(/(\w*)-(\w*)-(\w*)/);
            row.job = typeof row.tags == 'object' && row.tags.length == 2 ? row.tags[1] : row.command;
            row.duration = row.finished > 0 && row.started > 0 ? (row.finished - row.started) + ' s' : null;

            var boundClick = this.rowClick.bind(this, row);
            return (
                <tr key={row._id} onClick={boundClick}>
                  {this.props.columns.map( (col) => {
                    var width = col.replace('finished','110px').replace('status', '100px').replace('duration', '50px').replace('implementation', '150px').replace('job', '400px').replace('rerun', '20px !important').replace('schedule', '30px');
                    if (col == 'status') {
                      var className = "btn btn-"+(row.status ? row.status.replace('running','warning').replace('fetched','info').replace('error','danger').replace('planed','info').replace('stucked','warning') : '-')+" btn-xs";
                      var iconClassName = "fa fa-"+(row.status ? row.status.replace('running','refresh').replace('fetched','hourglass-end').replace('success','check').replace('error','exclamation').replace('planed','hourglass-start').replace('stucked','exclamation-triangle') : '-')+" btn-xs";
                      return (<td style={{width: width, padding: '5px 5px 2px 3px'}}><span style={{width: '85px', textAlign:'left'}} className={className}><span className={iconClassName}></span><span style={{textAlign:'center', width:'60px', display: 'inline-block', paddingRight: '5px'}}>{row[col]}</span></span></td>);
                    } else if (col == 'rerun') {
                      return (<td style={{width: width, padding:'5px 0px 2px 5px'}}><a className="btn btn-info btn-xs fa fa-refresh" style={{height: 32, width: 32, lineHeight: '30px', fontSize: '1.3em', marginRight: 0}} onClick={this.rerun.bind(this, row)}></a></td>);
                    } else if (col == 'runTime') {
                      return (<td style={{width: width}}><Time started={row.started} /></td>);
                    } else if (col == 'schedule') {
                      return (<td style={{width: width, paddingLeft: 150}}>{row[col]}</td>);
                    } else if (col == 'finished') {
                      return (<td style={{width: width}}>{moment(row[col]*1000).fromNow().replace('minutes','mins')}</td>);
                    } else if (col == 'output' || col == 'job' || col == 'implementation') {
                      return (<td style={{width: width, fontFamily:"Courier New"}}>{row[col]}</td>);
                    } else {
                      return (<td style={{width: width}}>{row[col]}</td>);
                    }
                  })}
                </tr>
            );
          })}
          </tbody>
        </table>
    ) : false;
  }

  rerun(row,e) {
    //alert('rerun' + row._id);
    this.props.socket.emit('rerun', {id: row._id, queue: row.queue});
    return false;
  }

  rowClick(row,e) {
    alert(JSON.stringify(row).replace(new RegExp(',', 'g'),',\n'));
  }

}
QueueJobsList.propTypes = {
  socket: React.PropTypes.object.isRequired,
  onFilterChange: React.PropTypes.func
};

class QueueJobsListHeaderTr extends React.Component {
  render() {
    return (
        <tr>{this.props.columns.map(function(title, idx) {
          if (title == 'schedule') {
            return (<th style={{paddingLeft: 150}} key={idx}>{title}</th>);
          } else if (title != 'rerun' && title != 'status') {
            return (<th style={{paddingBottom: 15}} key={idx}>{title}</th>);
          } else {
            return (<th key={idx}></th>);
          }
        })}</tr>
    );
  }
}