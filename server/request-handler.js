/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

// {username: "us", text: "I am a message", roomname: "lobby"}
var _und = require('../node_modules/underscore/underscore.js');
var data =  {results:[]};

exports.handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url);


  // console.log(request.url);
  // var statusCode = 200;
  var headers = defaultCorsHeaders;

  var sendMessages = function(room) {
    headers["Content-Type"] = "application/json";
    response.writeHead(200, headers);
    if (room === undefined) {
      response.end(JSON.stringify(data));
    } else {
      var roomData = _und.filter(data.results, function(msg) {
        console.log(room === msg.roomname);
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
      console.log("chunk: " + chunk);
    });
    request.on('end', function() {
      if (room === undefined) {
        data.results.push(JSON.parse(msg));
      } else {
        msg = JSON.parse(msg);
        msg.roomname = room;
        data.results.push(msg);
      }
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
    console.log(JSON.stringify(data));
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




  // if (request.method === "GET" && request.url === "/classes/messages") {
  //   sendMessages();
  // } else if (request.method === "POST" && request.url === "/classes/messages/send") {
  //   processMessage();
  // } else if (request.method === "OPTIONS") {
  //   sendOptions();
  // } else {
  //   badRequest();
  // }


  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */


  /* .writeHead() tells our server what HTTP status code to send back */


  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/


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
