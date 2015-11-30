import React from 'react';
import express from 'express';
import compression from 'compression';
import config from './config';
import Html from './html';
import socketjs from './';

const app = express();

app.use(compression());
app.use('/build', express.static('build'));
app.use('/css', express.static('css'));
app.use('/fonts', express.static('fonts'));
app.use('/js', express.static('js'));
 
app.get('*', (req, res) => {
  res.send('<!DOCTYPE html>' + React.renderToStaticMarkup(
    <Html
      isProduction={config.isProduction}
      version={config.version}
    />
  ));
});

var listener = app.listen(config.port);
console.log(`Server started on port ${config.port}`);

var io = require('socket.io')(listener);
