// http://nodejs.org/api/modules.html.
var url = require('url');
var fs = require('fs');
var mh = require('./message-handler.js');


module.exports = function(req, res) {
  console.log("Serving request type " + req.method + " for url " + req.url);
  console.log("Parsed: " + url.parse(req.url).pathname);

  methods[req.method](req, res);
}

var methods = {
  'GET': function(req, res){
    var path = url.parse(req.url).pathname;
    if (path in getUrls) {
      getUrls[path](req, res);
    } else { respond404(req, res); }
  },
  'POST': function(req, res){
    var path = url.parse(req.url).pathname;
    if (path in getUrls) {
      postUrls[path](req, res);
    }
  },
  'OPTIONS': function(req, res){
    var url_options = url.parse(req.url,true).query;
    //Whatever we do with our options, like -createdAt -limit, etc.
    var statusCode = 200;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "text/plain";
    res.writeHead(statusCode, headers);
    res.end();
  }
}

//Server -> Client
var getUrls = {
  '/classes/messages': function(req, res) {
    var statusCode = 200;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "application/json";
    res.writeHead(statusCode, headers);

    var results = { results: mh.getMessages() };

    res.write(JSON.stringify(results));
    res.end();
  }
}

//Client -> Server
var postUrls = {
  '/classes/messages': function(req, res) {
    var data = "";

    req.on('data', function(chunk){
      data += chunk;
    });

    req.on('end', function(){
      var newObj = mh.addMessage(data);
      console.log('Added the message!', new Date());

      var statusCode = 201;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = "application/json";
      res.writeHead(statusCode, headers);

      res.write(JSON.stringify(newObj));
      res.end();
    });
  }
};

var respond404 = function(req, res) {
  var statusCode = 404;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/html";
  res.writeHead(statusCode, headers);

  res.write('<h1>You be trippin\' foo!</h1>');
  res.end();
}

/*module.exports = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";
  response.writeHead(statusCode, headers);
  response.end("Hello, World!");
};*/

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

