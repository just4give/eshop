/**
 * Created by Mithun.Das on 2/24/2016.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');
var User = require('./User');
var Cart = require('./Cart');
var Photo = require('./Photo');
var Product = require('./Product');
var Payment = require('./Payment');
var Shipping = require('./Shipping');
var Coupon = require('./Coupon');
var Address = require('./Address');
var OrderStatus = require('./OrderStatus');
var OrderTracking = require('./OrderTracking');

var seqGen = require('password-generator');

var order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },
    orderNumber: {
        type: Sequelize.STRING,
        field: 'orderNumber',
        unique: true,
        defaultValue: function(){
            return seqGen(3, false, /\d/)+"-"+new Date().valueOf();
        }
    },
    productCost: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'productCost'
    },
    tax: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'tax'
    },
    shippingCost: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'shippingCost'
    },
    discount: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'discount'
    },
    finalCost: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'finalCost'
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
order.belongsTo(Payment);
order.belongsTo(Shipping);
order.belongsTo(Address);
order.belongsTo(Coupon);
order.belongsTo(OrderStatus);
order.hasOne(OrderTracking, { foreignKey: 'orderId' });
order.hasMany(Cart);

order.sync({force:false}).then(function(){

});

order.middleware ={
    list: {
        fetch: {
            before: function(req, res, context) {
                console.log("context ", context.criteria);
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

/*order.orderNumber = function(){
   return seqGen(3, false, /\d/)+"-"+new Date().valueOf();
}*/
module.exports = order;