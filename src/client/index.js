import React from 'react';
import QueueJobsList from './queuejobslist';
import Tile from './tile';
import Panel from './panel';
import Row from './row';

//var socket = window.io('afrodita.ebrana.cz:8001');
//var socket = window.io('localhost:8001');
var socket = window.io('achiles.ebrana.cz:8001');

NProgress.done();

const app = document.getElementById('app-root');
React.render(
    <div>
      <div className="row tile_count">
        <Tile name="Volná vlákna" event="freeThreadsCountChanged" socket={socket} icon="coffee" />
        <Tile name="Běžících úkolů" event="runningCountChanged" socket={socket} icon="refresh" />
        <Tile name="Čekajících úkolů" event="waitingCountChanged" socket={socket} icon="hourglass-start" />
        <Tile name="Průměrná doba čekání" value="152236" icon="hourglass-end" />
        <Tile name="Opakovaných úkolů" event="plannedCountChanged" socket={socket} icon="recycle" />
        <Tile name="Hotových úkolů" event="historyCountChanged" socket={socket} icon="check" />
      </div>
      <Row>
        <Panel size="6" title="Running">
          <QueueJobsList queueName="immediate" socket={socket} columns={['status', 'host', 'job', 'output']}/>
        </Panel>
      </Row>

      <Row>
        <Panel size="6" title="History">
          <QueueJobsList queueName="history" socket={socket} columns={['rerun', 'status', 'finished', 'host', 'job', 'output']} />
        </Panel>
      </Row>

      <Row>
        <Panel size="6" title="Planned">
        <QueueJobsList queueName="planned" socket={socket} columns={['schedule', 'host', 'job']} />
        </Panel>
      </Row>
    </div>
, app);
