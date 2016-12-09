import React from 'react';

export default class Panel extends React.Component {

  render() {
      var children = React.Children.map(this.props.children, (child) => {
          return React.cloneElement(child, { onFilterChange: (fn) => {this.onFilterChange = fn} });
      });

    return (
        <div style={{paddingRight: 50}} className={'numberPanel col-md-'+(this.props.sizeMd ? this.props.sizeMd : this.props.size)+' col-sm-'+(this.props.sizeSm ? this.props.sizeSm : this.props.size)+' col-xs-'+(this.props.sizeXs ? this.props.sizeXs : this.props.size)}>
          <div className="x_panel">
            <div className="x_content- text-center">
              {children}
            </div>
            <div className="row" style={{position: 'relative', zIndex: 1000}}>
              <h5 className="text-center text-uppercase">{this.props.title}</h5>
            </div>
          </div>
            {this.props.right ? this.props.right : ''}
        </div>
    );
  }

}
