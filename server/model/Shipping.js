/**
 * Created by Mithun.Das on 2/24/2016.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');


var shipping = sequelize.define('shipping', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: Sequelize.STRING,
        field: 'name',
        allowNull:false
    },
    price: {
        type: Sequelize.DECIMAL,
        field: 'price',
        allowNull:false
    },
    active: {
        type: Sequelize.BOOLEAN,
        field: 'active',
        defaultValue:true,
        allowNull:false
    }



},{
    freezeTableName: true,
    timestamps: false

});

shipping.metadata = "XYZ";
shipping.sync().then(function(){

});

module.exports = shipping;