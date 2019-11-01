
var myport = process.env.PORT || 3000;
var myhost = "localhost";
console.log(process.env);

console.log("Port is : "+myhost+":"+myport);

var http = require('http');
var express = require('express');
var WSS = require('ws').Server;
var mysql = require('mysql');
var request = require('request');

//var app = express().use(express.static('public'));
//app.listen(process.env.PORT || 3000);
//var server = http.createServer(app);

//var server = http.createServer((app, res) => {
  //res.statusCode = 200;
  //res.setHeader('Content-Type', 'text/html');
  //res.end('<h1>Hello World</h1>');
//});

//server.listen(myport ,function(){
  // console.log("up and running on port "+ "Port is : "+myhost+":"+myport);
//});

var wss = new WSS({ port: myport });
wss.on('connection', function(socket) {
  console.log('Opened Connection 🎉');

  var json = JSON.stringify({ message: 'Gotcha' });
  socket.send(json);
  console.log('Sent: ' + json);

  socket.on('message', function(message) {
    console.log('Received: ' + message);

    wss.clients.forEach(function each(client) {

       

      var json = JSON.stringify({ message: 'Something changed' });
      client.send(json);
      console.log('Sent: ' + json);
    });
  });

  socket.on('close', function() {
    console.log('Closed Connection 😱');
    
  });

});

var message="";
var broadcast = function() {
  var datetime = new Date();


  wss.clients.forEach(function each(client) {

   
    var queryString = 'SELECT * FROM market limit 1';
    
    /*con.query(queryString, function(err, rows, fields) {
        if (err) throw err;
    
        for (var i in rows) {
          message = rows[i].amount;
            console.log('Query Result: ', rows[i].amount);
        }
        con.end();
    });
  */
 
 request.get({
    headers: {'content-type' : 'application/x-www-form-urlencoded'},
    url:     'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD',
    //body:    "mes=heydude"
  }, function(error, response, body){
    console.log(body);
    var response = JSON.parse(body);
    message = response["USD"];
  });

    
  var json = JSON.stringify({
    message: message
  });

    client.send(json);
    console.log('Sent: ' + json);
  });
}
setInterval(broadcast, 1000);
