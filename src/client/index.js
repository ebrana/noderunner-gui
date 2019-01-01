import React from 'react';
import { render } from 'react-dom';
import RunningJobsList from './runningjobslist';
import QueueJobsList from './queuejobslist';
import Counter from './components/counter';
import Chart from './components/loadChart';
import NumberPanel from './numberPanel';
import Row from './row';
import Col from './col';

var server = /server=([^&]+)/.exec(location.search)[1];
var socket = window.io(server);

const Arrow = (props) => (<div className="numberpanel-image-wrap"><img style={props.style || {}} className="numberpanel-image" src="http://www.clker.com/cliparts/w/G/P/a/z/S/grey-right-arrow-hi.png" /></div>);
const ArrowBottom = () => (<img className="numberpanel-image-bottom" src="http://www.clker.com/cliparts/w/G/P/a/z/S/grey-right-arrow-hi.png" />);

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    setActiveQueue(queue) {
        if (this.state.queue == queue) {
            this.setState({queue: null})
        } else {
            this.setState({queue})
        }
    }

    render() {
        return (
            <div>
                <Row style={{height: 200, marginBottom: 30}}>
                    <Chart socket={socket} threads={this.props.threadsCount} onMount={() => NProgress.done()}/>
                </Row>
                <Row style={{alignItems: 'center', flexDirection: 'row', display: 'flex'}}>
                    <Col size="2">
                        <Row>
                            <NumberPanel style={{width: '100%'}} isActive={this.state.queue == 'planned'} onClick={() => this.setActiveQueue('planned')} size="2" title={<span><i className={'fa fa-recycle'}></i> Scheduled</span>}>
                                <h1><Counter event="plannedCount" socket={socket}/></h1>
                            </NumberPanel>
                        </Row>
                        <Row style={{height: 50, paddingRight: 50, position: 'relative', display: 'flex', justifyContent: 'center'}}>
                            <ArrowBottom />
                        </Row>
                        <Row>
                            <NumberPanel style={{width: '100%'}} isActive={this.state.queue == 'immediate'} onClick={() => this.setActiveQueue('immediate')} size="2" title={<span><i className={'fa fa-hourglass-start'}></i> Waiting</span>} right={<Arrow/>}>
                                <h1><Counter event="waitingCount" socket={socket}/></h1>
                            </NumberPanel>
                        </Row>
                    </Col>
                    <NumberPanel size="8" title={<span><i className={'fa fa-refresh'}></i> Running</span>} right={<Arrow style={{margin: 0, top: 45}} />}>
                        <RunningJobsList queueName="immediate" socket={socket} threads={this.props.threadsCount}/>
                    </NumberPanel>
                    <Col size="2">
                        <Row>
                            <NumberPanel style={{width: '100%'}} isActive={this.state.queue == 'history'} onClick={() => this.setActiveQueue('history')} size="2" title={<span><i className={'fa fa-check'}></i> Completed</span>}>
                                <h1><Counter event="historyCount" socket={socket}/></h1>
                            </NumberPanel>
                        </Row>
                        <Row style={{height: 50, paddingRight: 50, position: 'relative', display: 'flex', justifyContent: 'center'}}>
                            <ArrowBottom />
                        </Row>
                        <Row style={{width: '100%', margin: 0, paddingRight: 50, paddingTop: 5,  display: 'flex', justifyContent: 'center'}}>
                                <img style={{width: 50, height: 60, opacity: .7}}
                                    src="http://downloadicons.net/sites/default/files/trash-can-symbol-icon-504.png"/>
                            
                        </Row>
                    </Col>
                </Row>
                {this.state.queue == 'history' ?   <QueueJobsList socket={socket} title="Completed jobs list" queueName="history" columns={['reruninfo', 'finished', 'duration', 'host', 'job', 'output', 'status']} /> : null}
                {this.state.queue == 'immediate' ? <QueueJobsList socket={socket} title="Waiting jobs list" queueName="immediate" columns={['infoonly', 'added', 'host', 'job', 'status']} /> : null}
                {this.state.queue == 'planned' ?   <QueueJobsList socket={socket} title="Scheduled jobs list" queueName="planned" columns={['infoonly', 'schedule', 'host', 'job']} /> : null}
            </div>
        )
    }
}

socket.on('threadsCount', (threadsCount) => {
    NProgress.done();
    render(<Main threadsCount={threadsCount} />, document.getElementById('app-root'));
});

