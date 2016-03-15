/**
 * Created by Mithun.Das on 2/24/2016.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');
var User = require('./User');
var Cart = require('./Cart');
var Photo = require('./Photo');
var Product = require('./Product');


var order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },
    trackingId: {
        type: Sequelize.UUID,
        field: 'uuid',
        unique: true,
        defaultValue: Sequelize.UUIDV1
    },
    productCost: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'productCost'
    },
    tax: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'tax'
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

order.belongsTo(User);
order.hasMany(Cart);

order.sync({force:true}).then(function(){

});

order.middleware ={
    list: {
        fetch: {
            before: function(req, res, context) {
                context.include = [{model: Cart,include:[{model: Product,include:[Photo]}]}];
                return context.continue;
            },
            action: function(req, res, context) {

                return context.continue;
            },
            after: function(req, res, context) {
                // set some sort of flag after writing list data
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
    read: {
        fetch: {
            before: function (req, res, context) {
                context.include = [{model: Cart,include:[{model: Product,include:[Photo]}]}];
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
        fetch: {
            before: function (req, res, context) {

                context.include = [{model: Cart,include:[{model: Product,include:[Photo]}]}];

                return context.continue;
            },
            action: function (req, res, context) {
                // change behavior of actually writing the data
                return context.continue;
            },
            after: function (req, res, context) {
                // set some sort of flag after writing list data

                context.include = [{model: Cart,include:[{model: Product,include:[Photo]}]}];
                return context.continue;
            }
        },
        write: {

            before: function (req, res, context) {
                // set some sort of flag after writing list data

                return context.continue;
            },
            after: function (req, res, context) {
                //console.log("Cart write ", context.instance.dataValues.user);
                delete  context.instance.dataValues.user;
                return context.continue;
            }
        }
    },
    update: {
        auth: function(req, res, context) {

            if(!req.isAuthenticated()){
                return context.error(403, "Not authenticated");
            }

            req.body.updatedAt = new Date();
            return context.continue;
        }
    }
}

module.exports = order;