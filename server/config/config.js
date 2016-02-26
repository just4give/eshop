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
        connectionLimit: 50,
        image:{
            repo: "/photo",
            thumb:{
                height: 200,
                width:180
            },
            original:{
                height: 400,
                width:360
            }
        },
        apiContext:"http://localhost:4200"

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