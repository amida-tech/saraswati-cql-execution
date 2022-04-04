const bodyParser = require('body-parser');

const express = require('express');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));

app.post('/cql_service_connector', function(req, res, next){
    console.log(req.body);
    res.end("ok")
});

app.listen(15000, 'localhost');