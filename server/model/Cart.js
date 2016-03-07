/**
 * Created by Mithun.Das on 2/24/2016.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');
var User = require('./User');
var Product = require('./Product');


var cart = sequelize.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },

    productId: {
        type: Sequelize.INTEGER,
        field: 'productId'
    },
    userId: {
        type: Sequelize.INTEGER,
        field: 'userId'
    },
    quantity: {
        type: Sequelize.INTEGER,
        field: 'quantity'
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'price'
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
cart.belongsTo(Product);
cart.belongsTo(User);

cart.sync().then(function(){

});

cart.middleware ={
    list: {
        fetch: {
            before: function(req, res, context) {

                return context.continue;
            },
            action: function(req, res, context) {
                //context.include = [{model:Tax, where:{id:2}}];


                return context.continue;
            },
            after: function(req, res, context) {
                // set some sort of flag after writing list data
                console.log(res.data);
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
               /* console.log("product:create:fetch")
                context.include = [{model: Tax}, {model: Photo},{model:Category},{model:Merchandise}];*/

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
        },
        write:function(req, res, context) {

            return context.continue;
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

module.exports = cart;