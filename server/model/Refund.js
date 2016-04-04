/**
 * Created by Mithun.Das on 2/24/2016.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');
var User = require('./User');
var Cart = require('./Cart');
var Order = require('./Order');
var Product = require('./Product');
var Photo = require('./Photo');

var _ = require('lodash');
var crypto = require('../config/crypto');

var refund = sequelize.define('refund', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: Sequelize.STRING,
        field: 'type'
    },

    saleId: {
        type: Sequelize.STRING,
        field: 'saleId'
    },
    orderNumber: {
        type: Sequelize.STRING,
        field: 'orderNumber'
    },
    reqAmnt: {
        type: Sequelize.DECIMAL(10,2),
        field: 'reqAmnt'
    },
    refundAmnt: {
        type: Sequelize.DECIMAL(10,2),
        field: 'refundAmnt'
    },
    status:{
        type: Sequelize.STRING,
        field: 'status',
        defaultValue: 'REQUESTED',
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

refund.belongsTo(User);
refund.belongsTo(Cart);
refund.belongsTo(Order);


refund.sync().then(function(){


});

refund.middleware ={

    list: {
        auth: function(req, res, context) {
            if(!req.isAuthenticated() || req.user.roles.indexOf('admin') === -1){
                return context.error(403, "Not authenticated");
            }
            return context.continue;
        },

        fetch:{

            after: function (req, res, context) {

                return context.continue;
            }
        }
    },
    delete:{
        auth: function(req, res, context) {
            if(!req.isAuthenticated() || req.user.roles.indexOf('admin') === -1){
                return context.error(403, "Not authenticated");
            }
            return context.continue;
        }
    },
    read: {
        fetch: {
            before: function (req, res, context) {
                //context.include = [{model:Tax, where:{id:2}}];
                // console.log('product:read:fetch:before');
                context.include = [{model: Cart, include:[{model: Product,include:[Photo]}]}, {model: Order}];

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

            if(!req.isAuthenticated() || req.user.roles.indexOf('admin') === -1){
                return context.error(403, "Not authenticated");
            }

            req.body.updatedAt = new Date();
            return context.continue;
        }
    }
}

module.exports = refund;