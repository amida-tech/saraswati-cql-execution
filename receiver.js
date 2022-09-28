const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const logger = require('./src/winston')

app.use(bodyParser.json({ limit: '50mb' }));

app.post('/cql_service_connector', function(req, res, next){
    logger.info(req.body);
    res.end("ok")
});

app.listen(15000, 'localhost');