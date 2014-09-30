/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var _und = require('../node_modules/underscore/underscore.js');
var fs = require('fs');
var data =  {results:[]};


// fs.readFile('./server/messagedata.json', function(err){
//   if (err) {
//     fs.writeFile('./server/messagedata.json', JSON.stringify(data), function(err){
//       console.log(err);
//       console.log('made a new file');
//     });
//   }
// });
//

fs.appendFile('./server/messagedata.txt', '', function() {
   console.log('appended to file, if it existed');
});


fs.readFile('./server/messagedata.txt', 'utf8', function(err, data){
  if (err) { console.log('not doing anything'); }
  console.log(JSON.stringify(data));

})


exports.handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url);

  var headers = defaultCorsHeaders;

  var sendMessages = function(room) {
    headers["Content-Type"] = "application/json";
    response.writeHead(200, headers);
    if (room === undefined) {
      response.end(JSON.stringify(data));
    } else {
      var roomData = _und.filter(data.results, function(msg) {
        return msg.roomname === room;
      });
      var newData = JSON.stringify({results:roomData});
      response.end(newData);
    }
  };


  var processMessage = function(room){
    headers['Content-Type'] = 'text/html';
    response.writeHead(201, "OK", headers);
    var msg = '';
    request.on('data', function(chunk) {
      msg += chunk;
    });
    request.on('end', function() {
      msg = JSON.parse(msg);

      //appending to data
      if (room !== undefined) {
        msg.roomname = room;
      }

      //append to file
      fs.appendFile('./server/messagedata.txt', JSON.stringify(msg) + ",", function(err) {
        if (err) {console.log("nope");}
        else {console.log('appended to file, if it existed');}
      });

      data.results.push(msg);
      response.end();

    });
  };

  var sendOptions = function(){
    response.writeHead(200, headers);
    response.end();
  };

  var badRequest = function(){
    response.writeHead(404, headers);
    response.end("Sorry, failure");
  };

  var path = request.url.split('/').slice(1);

  if (request.method === "GET") {
    if (path[0] === 'classes' && path[1] === 'messages') {
      sendMessages();
    } else if (path[0] === 'classes' && path.length === 2) {
      var room = path[1];
      sendMessages(room);
    } else {
      badRequest();
    }
  } else if (request.method === "POST") {
    if (request.url === "/classes/messages/send") {
      processMessage();
    } else if (path[0] === "classes" && path.length === 2) {
      var room = path[1];
      processMessage(room);
    } else {
      badRequest();
    }
  } else if (request.method === "OPTIONS") {
    sendOptions();
  } else {
    badRequest();
  }

};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};


