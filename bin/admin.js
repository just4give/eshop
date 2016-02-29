#!/usr/bin/env node
var debug = require('debug')('PhotoOrder');
var adminApp = require('../admin-app');


adminApp.set('port', process.env.PORT || 4200);

var server = adminApp.listen(adminApp.get('port'), function() {
  debug('Express admin server listening on port ' + server.address().port);
});
