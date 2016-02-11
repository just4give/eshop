/**
 * Created by mithundas on 12/29/15.
 */
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {

        rootPath: rootPath,
        port: process.env.PORT || 3100,
        host     : "localhost",
        user     : "root",
        password : "root",
        database : "eshop",
        connectionLimit: 50

    },
    aws: {

        rootPath: rootPath,
        port: process.env.PORT || 3100,
        host     : "localhost",
        user     : "root",
        password : "password",
        database : "eshop",
        connectionLimit: 50

    }
}