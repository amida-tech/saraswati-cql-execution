const bodyParser = require('body-parser');

const express = require('express');

const app = express();

app.use(bodyParser.json());

app.post('/cql_service_connector', function(req, res, next){

    console.log(req.body);
    res.end("ok")

});

app.listen(5000, 'localhost');