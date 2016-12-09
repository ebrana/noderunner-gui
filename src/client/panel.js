import React from 'react';

export default class Panel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {filterToggle: false};
  }

  render() {
    var children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, { onFilterChange: (fn) => {this.onFilterChange = fn} });
    });

    return (
        <div className={'col-md-'+(this.props.sizeMd ? this.props.sizeMd : this.props.size)+' col-sm-'+(this.props.sizeSm ? this.props.sizeSm : this.props.size)+' col-xs-'+(this.props.sizeXs ? this.props.sizeXs : this.props.size)}>
          <div className="x_panel">
            <div className="row x_title" style={{position: 'relative', zIndex: 1000}}>
              <h2>{this.props.title}</h2>

              <ul className="nav navbar-right panel_toolbox">
                <li><a style={{marginBottom: 0}} className={'close-link btn' + (this.state.filterToggle ? ' active' : '')} onClick={this.toggleFilter.bind(this)}><i className="fa fa-filter"></i></a></li>
              </ul>
            </div>
            <div className="x_content-">
              {children}
            </div>
          </div>
        </div>
    );
  }

  toggleFilter(e) {
    this.setState({filterToggle: !this.state.filterToggle});
    this.onFilterChange(!this.state.filterToggle);
  }

}
