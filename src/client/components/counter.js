import React from 'react';

export default class Counter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {value: null};
        this.diffEventsBound = false;
        let event = this.props.event
        if (event) {
            // initial value
            this.props.socket.on(event, value => {
                console.log(event, value);
                this.setState({value});

                if (!this.diffEventsBound) {
                    // incrementation
                    this.props.socket.on(event + 'Increased', diff => {
                        // console.log(event + 'Increased', diff);

                        let state = Object.assign({}, this.state);
                        state.value += diff;
                        this.setState(state);
                    });

                    // decrementation
                    this.props.socket.on(event + 'Decreased', diff => {
                        // console.log(event + 'Decreased', diff);

                        let state = Object.assign({}, this.state);
                        state.value -= diff;
                        this.setState(state);
                    });
                    this.diffEventsBound = true;
                }
            });
        }
    }

    render() {
        return <span>{this.state.value === null ? '-' : (this.state.value < 0 ? 0 : numberWithCommas(this.state.value))}</span>;
    }

}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}