import React from 'react';
import Main from './main';
import QueueJobsList from './queuejobslist';

const app = document.getElementById('app-root');
var socket = window.io('localhost:8001');

React.render(
    <div>
      <h2>Immediate</h2>
      <QueueJobsList queueName="immediate" socket={socket}/>
      <h2>History</h2>
      <QueueJobsList queueName="history" socket={socket}/>
      <h2>Planned</h2>
      <QueueJobsList queueName="planned" socket={socket}/>
    </div>, app);
