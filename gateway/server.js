const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');

const { createProxyMiddleware } = require('http-proxy-middleware');


const app = express();

app.set('trust proxy', true);

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

const proxy = createProxyMiddleware({ 
  target: 'http://localhost:10081', 
  changeOrigin: false,
  ws: true,
  logLevel: 'debug',
  onError:  (err, req, res) => {
    console.log('Something went wrong.');
    console.log('And we are reporting a custom error message.');
  }
});
app.use('/terminal', proxy);
app.on('upgrade', proxy.upgrade); 

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.post('/post-test', (req, res) => {
  console.log('Got body:', req.body);
  res.sendStatus(200);
});

if (!port) {
  console.error('Please provide a port: node ./src/server.js --port=XXXX');
  process.exit(1);
} else {
  app.listen(port, host);
  console.log('Server listening at http://' + host + ':' + port);
}