import React from 'react';

export default class Panel extends React.Component {

  render() {

    return (
        <div className={'col-md-'+(this.props.sizeMd ? this.props.sizeMd : this.props.size)+' col-sm-'+(this.props.sizeSm ? this.props.sizeSm : this.props.size)+' col-xs-'+(this.props.sizeXs ? this.props.sizeXs : this.props.size)}>
          {this.props.children}
        </div>
    );
  }

}
