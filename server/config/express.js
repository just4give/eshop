/**
 * Created by mithundas on 12/29/15.
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var session = require('express-session');
var passport = require('passport');


module.exports = function(app, config) {

    console.log(config);

// view engine setup
    app.set('views', path.join(config.rootPath, 'server/views'));
    app.set('view engine', 'ejs');
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(config.rootPath, 'client')));


    app.use(session({secret: 'online shop',
                    resave:true,
                    saveUninitialized:true,
                    cookie: { maxAge: 1000*60*20 }}));
    app.use(passport.initialize());
    app.use(passport.session());

}