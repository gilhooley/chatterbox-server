var express = require('express');
var _und = require('underscore');
var app = express();
var router = express.Router();
var data = {results:[]};

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "application/json"
};

var sendMessages = function(req, res, room) {
  res.set(headers);
  if (room !== undefined) {
    var roomData = _und.filter(data.results, function(msg) {
        return msg.roomname === room;
      });
    var newData = JSON.stringify({results:roomData});
    res.send(newData);
  } else {
    res.send(data);
  }
};

var processMessage = function(req, res, room) {
  res.set(headers);
  //res.set('Content-Type', 'text/html');
  var msg = '';
  req.on('data', function(chunk) {
    msg += chunk;
  });
  req.on('end', function() {
    msg = JSON.parse(msg);
    if (room !== undefined) {
      msg.roomname = room;
    }
    data.results.push(msg);
    console.log(res);
    res.status(201).send('OK').end();
     //res.status(201).end();
  });
};

router.get('/classes/messages', function(req, res, next) {
  sendMessages(req, res);
});

router.get('/classes/:roomname', function(req,res,next) {
  sendMessages(req,res,req.params.roomname);
});

router.post('/*', function(req,res) {
  processMessage(req,res);
})


app.options("/*", function(req, res) {
  res.set(headers);
  res.status(200).end();
});



// app.get('/classes/messages', function(req, res){
//   headers["Content-Type"] = "application/json";
//   res.set(headers);

//   console.log("just got req for /classes/messages");
//   res.send('Hello World');
// });




app.use('/', express.static(__dirname + '/client/client'));
app.use('/', router);

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

