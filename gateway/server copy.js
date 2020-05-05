var terminals = {}, logs = {};

const pty = require('node-pty');
const argv = require('yargs').argv;

const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');

const { createProxyMiddleware } = require('http-proxy-middleware');


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

//app.use(function (req, res, next) {
//  res.header('Access-Control-Allow-Origin', '*');
//  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
//
//  next();
//});

app.use('/', express.static(__dirname + '/build'));

app.use('/terminal', createProxyMiddleware({ 
  target: 'http://localhost:10081', 
  changeOrigin: true,
  ws: true,
  logLevel: 'debug',
}));

require('express-ws')(app);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.post('/post-test', (req, res) => {
  console.log('Got body:', req.body);
  res.sendStatus(200);
});

app.post('/terminals', function (req, res) {
  console.log('body ' + JSON.stringify(req.body));
  let shell = argv.shell && argv.shell !== '' ? argv.shell : process.platform === 'win32' ? 'cmd.exe' : 'bash';
  let cols = parseInt(req.query.cols, 10);
  let rows = parseInt(req.query.rows, 10);
  let term = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: cols || 80,
    rows: rows || 24,
    cwd: process.env.PWD,
    env: process.env
  });

  console.log('Created terminal with PID: ' + term.pid);
  terminals[term.pid] = term;
  logs[term.pid] = '';
  term.on('data', function (data) {
    logs[term.pid] += data;
  });
  res.send(term.pid.toString());
  res.end();
});

app.post('/terminals/:pid/size', function (req, res) {
  let pid = parseInt(req.params.pid, 10);
  let cols = parseInt(req.body.cols || req.query.cols, 10);
  let rows = parseInt(req.body.rows || req.query.rows, 10);
  let term = terminals[pid];
  
  console.log('Resizing terminal ' + pid + ' to ' + cols + ' cols and ' + rows + ' rows.');

  term.resize(cols, rows);
  console.log('Resized terminal ' + pid + ' to ' + cols + ' cols and ' + rows + ' rows.');
  res.end();
});

app.ws('/terminals/:pid', function (ws, req) {
  var term = terminals[parseInt(req.params.pid, 10)];

  if (!term) {
    ws.send('No such terminal created.');
    return;
  }

  console.log('Connected to terminal ' + term.pid);
  ws.send(logs[term.pid]);

  term.on('data', function (data) {
    // console.log('Incoming data = ' + data);
    try {
      ws.send(data);
    } catch (ex) {
      // The WebSocket is not open, ignore
    }
  });
  ws.on('message', function (msg) {
    term.write(msg);
  });
  ws.on('close', function () {
    term.kill();
    console.log('Closed terminal ' + term.pid);
    // Clean things up
    delete terminals[term.pid];
    delete logs[term.pid];
  });
});

if (!port) {
  console.error('Please provide a port: node ./src/server.js --port=XXXX');
  process.exit(1);
} else {
  app.listen(port, host);
  console.log('Server listening at http://' + host + ':' + port);
}