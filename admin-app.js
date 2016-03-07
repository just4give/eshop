var express = require('express');



var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./server/config/config')[env];

var app = express();
require('./server/config/admin-express')(app, config);
var epilougeResources= require('./server/config/epilouge')(app,config);
require('./server/config/passport')(config);
require('./server/config/admin-routes')(app);


module.exports = app;
