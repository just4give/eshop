/**
 * Created by Mithun.Das on 2/24/2016.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');
var User = require('./User');
var _ = require('lodash');

var address = sequelize.define('address', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },

    firstName: {
        type: Sequelize.STRING,
        field: 'firstName'
    },
    lastName: {
        type: Sequelize.STRING,
        field: 'lastName'
    },
    address1: {
        type: Sequelize.STRING,
        field: 'address1'
    },
    address2: {
        type: Sequelize.STRING,
        field: 'address2'
    },
    city: {
        type: Sequelize.STRING,
        field: 'city'
    },
    state: {
        type: Sequelize.STRING,
        field: 'state'
    },
    zip: {
        type: Sequelize.STRING,
        field: 'zip'
    },
    active: {
        type: Sequelize.BOOLEAN,
        field: 'active',
        defaultValue:true,
        allowNull:false
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        field: 'createdAt'
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        field: 'updatedAt'
    }




},{
    freezeTableName: true,
    timestamps: false

});

address.belongsTo(User);


address.sync().then(function(){

});

address.middleware ={

    list: {
        auth: function(req, res, context) {
            if(!req.isAuthenticated()){
                return context.error(403, "Not authenticated");
            }
            return context.continue;
        },

        fetch:{

            after: function (req, res, context) {
                if(Array.isArray(context.instance)){
                    var temp =
                    _.filter(context.instance, function(o) { return o.userId == req.user.id;; });
                   context.instance =temp;
                }
                return context.continue;
            }
        }
    },
    delete:{
        auth: function(req, res, context) {
            if(!req.isAuthenticated()){
                return context.error(403, "Not authenticated");
            }
            return context.continue;
        }
    },

    create: {
        auth: function(req, res, context) {

            if(!req.isAuthenticated()){
                return context.error(403, "Not authenticated");
            }

            req.body.userId = req.user.id;
            return context.continue;
        },

        write: {

            before: function (req, res, context) {
                // set some sort of flag after writing list data

                return context.continue;
            },
            after: function (req, res, context) {

                delete  context.instance.dataValues.user;
                return context.continue;
            }
        }
    },
    update: {
        auth: function(req, res, context) {

            if(!req.isAuthenticated() || req.body.userId != req.user.id){
                return context.error(403, "Not authenticated");
            }

            req.body.updatedAt = new Date();
            return context.continue;
        }
    }
}

module.exports = address;