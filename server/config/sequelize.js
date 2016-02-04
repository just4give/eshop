/**
 * Created by Mithun.Das on 12/10/2015.
 */
var Sequelize = require('sequelize');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./config')[env];



    var sequelize = new Sequelize(config.database, config.user, config.password, {
        host: config.host,
        dialect: 'mysql',

        pool: {
            max: 50,
            min: 0,
            idle: 10000
        }
    });

module.exports = sequelize;