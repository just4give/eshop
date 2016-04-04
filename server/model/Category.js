/**
 * Created by Mithun.Das on 2/24/2016.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');


var category = sequelize.define('category', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: Sequelize.STRING,
        field: 'name'
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

category.sync().then(function(){

});

category.middleware ={
    list: {
        fetch: {
            before: function(req, res, context) {

                return context.continue;
            },
            action: function(req, res, context) {

                return context.continue;
            },
            after: function(req, res, context) {

                return context.continue;
            }
        },
        start:{
            action: function(req, res, context) {

                return context.continue;
            }
        }
    },

    delete:{
        auth: function(req, res, context) {

            return context.error(403, "can't delete a product");
        }
    }
}
module.exports = category;