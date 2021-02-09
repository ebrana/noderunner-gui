const express = require ('express');
const compression = require('compression');
const nconf = require('nconf');
const path = require("path");

nconf
    .argv()
    .env()
    .file('custom', {file: 'config/custom.json'})
    .file({file: 'config/default.json'});

const app = express();

app.use(compression());
app.use(express.static(path.resolve(__dirname+'/../../dist')));
app.get('*', (req, res) => {
    res.sendFile('index.html');
});

app.listen(nconf.get('port'), () => {
    console.log(`Server started on port ${nconf.get('port')} (http://localhost:${nconf.get('port')})`)
})