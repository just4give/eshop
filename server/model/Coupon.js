/**
 * Created by Mithun.Das on 2/24/2016.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');


var coupon = sequelize.define('coupon', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },

    code: {
        type: Sequelize.STRING,
        field: 'code'
    },
    description: {
        type: Sequelize.STRING,
        field: 'description'
    },
    type: {
        type: Sequelize.STRING,
        field: 'type'
    },
    value: {
        type: Sequelize.DECIMAL,
        field: 'value'
    },
    minPurchase: {
        type: Sequelize.DECIMAL,
        field: 'minPurchase'
    },
    validFrom: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        field: 'validFrom'
    },
    validThrough: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        field: 'validThrough'
    },
    active: {
        type: Sequelize.BOOLEAN,
        field: 'active',
        defaultValue:true
    }



},{
    freezeTableName: true,
    timestamps: false

});


coupon.sync().then(function(){

});

module.exports = coupon;