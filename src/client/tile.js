import React from 'react';

export default class Tile extends React.Component {

  constructor(props) {
    super(props);

    var self = this;
    if (this.props.event) {
      self.props.socket.on(this.props.event, data => {
        // console.log(this.props.event, data);
        self.setState({text: data});
      });
    }
    self.state = {text: '-'};
  }

  render() {
    return (
      <div className="animated flipInY col-md-2 col-sm-4 col-xs-4 tile_stats_count">
        <div className="left"></div>
        <div className="right">
          <span className="count_top"><i className={'fa fa-'+this.props.icon}></i> {this.props.name}</span>
          <div className="count">{this.state.text}</div>
          {/* <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>34% </i> of average</span> */}
        </div>
      </div>
	  );
  }

}
