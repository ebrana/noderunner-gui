import React from 'react';

export default class QueueJobsList extends React.Component {

  // TODO props types

  constructor(props) {
    super(props);
    this.state = {data: []};

    this.props.socket.on('initial'+this.props.queueName+'Data', data => {
    	console.log('initial'+this.props.queueName+'Data', data)
    	this.setState({data: data});
    })

    this.props.socket.on('jobChanged', function(job) {
    	console.log('jobChanged',job.job)
    })
  }

  render() {
    return (
    	<table>
				<thead>
					<tr>
            <th>ID</th>
            <th>Status</th>
            <th>BasePath</th>
            <th>Command</th>
            <th>Output</th>
						{/*this.headers.map(function(title, idx) { return (<th key={idx}>{title}</th>); })*/}
					</tr>
				</thead>
				<tbody>
					{this.state.data.map(function (row, idx) { return ( 
						<tr key={idx}>
              <td>{row._id}</td>
              <td>{row.status}</td>
              <td>{row.basePath}</td>
              <td>{row.interpreter} {row.executable} {row.args}</td>
              <td>{row.output}</td>
						</tr>
					)})}
				</tbody>
			</table>
	);
  }

}
