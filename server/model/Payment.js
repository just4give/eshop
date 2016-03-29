/**
 * Created by Mithun.Das on 2/24/2016.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');
var User = require('./User');
var Card = require('./Card');
var _ = require('lodash');
var crypto = require('../config/crypto');

var payment = sequelize.define('payment', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },
    method: {
        type: Sequelize.STRING,
        field: 'method'
    },
    paymentId: {
        type: Sequelize.STRING,
        field: 'paymentId'
    },
    saleId: {
        type: Sequelize.STRING,
        field: 'saleId'
    },
    amount: {
        type: Sequelize.DECIMAL(10,2),
        field: 'amount'
    },
    payerId: {
        type: Sequelize.STRING,
        field: 'payerId'
    },
    cardNumber: {
        type: Sequelize.STRING,
        field: 'cardNumber'
       /* ,get: function() {
            return crypto.decrypt(this.getDataValue('cardNumber'));
        },
        set: function(val) {
            return this.setDataValue('cardNumber', crypto.encrypt(val));
        }*/
    },

    payerInfo: {
        type: Sequelize.TEXT,
        field: 'payerInfo'
    },
    transactionInfo: {
        type: Sequelize.TEXT,
        field: 'transactionInfo'
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

payment.belongsTo(User);
payment.belongsTo(Card);


payment.sync().then(function(){


});

payment.middleware ={

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
                    _.filter(context.instance, function(o) {
                        //show only last 4 digit of credit card
                      if(o.cardNumber){
                          o.cardNumber = o.cardNumber.slice(-4);
                      }
                        return o.userId == req.user.id;;
                    });
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

module.exports = payment;