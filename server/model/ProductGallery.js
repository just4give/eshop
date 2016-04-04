/**
 * Created by Mithun.Das on 2/24/2016.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var path = require('path');
var fs = require('fs');
var Photo = require('./Photo');

var productGallery = sequelize.define('productGallery', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    }





},{
    freezeTableName: true,
    timestamps: false

});

productGallery.belongsTo(Photo);

productGallery.sync().then(function(){

});

productGallery.middleware = {
    delete:{
        auth: function(req, res, context) {

            if(!req.isAuthenticated() || req.user.roles.indexOf("admin") === -1){
                return context.error(403, "Not authenticated");
            }
            return  context.continue;
        },
        fetch: function(req, res, context) {

            return  context.continue;
        },
        write: function(req, res, context) {


            return  context.continue;
        }
    },
    create:{
        auth: function(req, res, context) {
            if(!req.isAuthenticated() || req.user.roles.indexOf("admin") === -1){
                return context.error(403, "Not authenticated");
            }
            return  context.continue;

        }
    },
    read: {
        fetch: {
            before: function (req, res, context) {
                //context.include = [{model:Tax, where:{id:2}}];
                console.log('***** productGallery:read:fetch:before');
                context.include = [ {model: Photo}];

                return context.continue;
            },
            action: function (req, res, context) {
                // change behavior of actually writing the data
                return context.continue;
            },
            after: function (req, res, context) {
                // set some sort of flag after writing list data
                return context.continue;
            }
        }
    },
}
module.exports = productGallery;