// var http = require('http');

// //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
// var options = {
//   host: 'localhost',
//   port: '3000'
//   //path: '/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
// };

// callback = function(response) {
//   var str = '';

//   //another chunk of data has been received, so append it to `str`
//   response.on('data', function (chunk) {
//     str += chunk;
//   });

//   //the whole response has been received, so we just print it out here
//   response.on('end', function () {
//     console.log(str);
//   });
// }

// http.request(options, callback).end();
// const net = require("net")
// const client = new net.Socket()
// client.connect(3000, "127.0.0.1")

// let received = ""
// client.on("data", data => {
//   received += data
//   console.log(received) // Hello
// })
// client.on("close", () => {
//   console.log("connection closed")
// })

var bodyParser = require('body-parser');

const express = require('express');

const app = express();

// Parses the body for POST, PUT, DELETE, etc.
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/cql_service_connector', function(req, res, next){

    console.log(req.body); // req.body contains the parsed body of the request.
    res.end("ok")

});

app.listen(5000, 'localhost');