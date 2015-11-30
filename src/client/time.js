import React from 'react';

export default class Time extends React.Component {

  constructor(props) {
    super(props);

    this.state = this.update();
    setInterval(() => self.update(), 1000);
  }

  update() {
    var state = {delta: this.props.started > 0 ? Math.round((Date.now()/1000 - this.props.started)) : 0};
    this.setState(state);
    return state;
  }

  render() {
    return (
      <div>{this.state.delta}</div>
	  );
  }

}
