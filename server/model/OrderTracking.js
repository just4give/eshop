/**
 * Created by Mithun.Das on 2/24/2016.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');


var orderTracking = sequelize.define('orderTracking', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },

    carrier: {
        type: Sequelize.STRING,
        field: 'carrier'
    },
    trackingNumber: {
        type: Sequelize.STRING,
        field: 'trackingNumber'
    },
    estDelivery: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        field: 'estDelivery'
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        field: 'createdAt'
    }



},{
    freezeTableName: true,
    timestamps: false

});

orderTracking.sync().then(function(){

});


module.exports = orderTracking;