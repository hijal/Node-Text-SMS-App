const express = require('express');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const Nexmo = require('nexmo');
const socketIo = require('socket.io');
require('dotenv').config();

const nexmo = new Nexmo(
  {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.SECRET_KEY,
  },
  { debug: true }
);

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res, next) => {
  res.render('index');
});

app.post('/', (req, res, next) => {
  const number = req.body.number;
  const text = req.body.text;

  nexmo.message.sendSms(process.env.NUMBER, number, text, { type: 'unicode' }, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      //console.log(res);
      const data = {
        id: res.messages[0]['message-id'],
        number: res.messages[0]['to'],
      };
      io.emit('status', data);
    }
  });
});
const server = app.listen(port, () => {
  console.log('Server listening on port ' + port);
});

const io = socketIo(server);
io.on('connection', (socket) => {
  console.log('Connection');
  io.on('disconnect', () => {
    console.log('Disconnected');
  });
});
