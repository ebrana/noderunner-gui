import React from 'react';
import express from 'express';
import compression from 'compression';
import config from './config';
import Html from './html';
import socketjs from './';

const app = express();

app.use(compression());
app.use('/build', express.static('build'));
 
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
/*
let data=[
		["The Lord of the Rings", "J. R. R. Tolkien",
	        "English", "1954–1955", "150 million"],
	      ["Le Petit Prince (The Little Prince)", "Antoine de Saint-Exupéry","French", "1943", "140 million"],
	      ["Harry Potter and the Philosopher's Stone", "J. K. Rowling",
	        "English", "1997", "107 million"],
	      ["And Then There Were None", "Agatha Christie",
	        "English", "1939", "100 million"],
	      ["Dream of the Red Chamber", "Cao Xueqin",
	        "Chinese", "1754–1791", "100 million"],
	      ["The Hobbit", "J. R. R. Tolkien",
	        "English", "1937", "100 million"],
	      ["She: A History of Adventure", "H. Rider Haggard",
	        "English", "1887", "100 million"]
	    ];

io.on('connection', function(socket){
	socket.emit('allDataUpdate', data)
  console.log('a user connected');
});
*/