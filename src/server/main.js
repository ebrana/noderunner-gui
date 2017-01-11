import React from 'react';
import express from 'express';
import compression from 'compression';
import Html from './html';
import ReactDOMServer from 'react-dom/server';
import nconf from 'nconf';

nconf
    .argv()
    .env()
    .file('custom', {file: 'config/custom.json'})
    .file({file: 'config/default.json'})
    .defaults({
        isProduction: process.env.NODE_ENV === 'production',
        version: require('../../package').version
    });


const app = express();

app.use(compression());
app.use('/build', express.static('build'));
app.use('/css', express.static('css'));
app.use('/fonts', express.static('fonts'));
app.use('/js', express.static('js'));

app.get('*', (req, res) => {
  if (!req.query.server) {
      res.redirect('?server='+nconf.get('servers')[0].url);
  } else {
      res.send('<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
              <Html
                  isProduction={nconf.get('isProduction')}
                  version={nconf.get('version')}
                  servers={nconf.get('servers')}
                  selectedServer={req.query.server}
              />
          ));
  }
});

var listener = app.listen(nconf.get('port'));
console.log(`Server started on port ${nconf.get('port')}`);

var io = require('socket.io')(listener);
