/**
 * Created by Mithun.Das on 2/24/2016.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');


var tax = sequelize.define('tax', {
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
    pct: {
        type: Sequelize.DECIMAL,
        field: 'pct'
    },
    active: {
        type: Sequelize.BOOLEAN,
        field: 'active'
    }



},{
    freezeTableName: true,
    timestamps: false

});

tax.sync().then(function(){

});

tax.middleware ={
    list: {
        fetch: {
            before: function(req, res, context) {

                console.log('tax list:fetch:before',context.criteria);
                return context.continue;
            },
            action: function(req, res, context) {
                // change behavior of actually writing the data
                console.log('tax list:fetch:action',context.criteria);
                return context.continue;
            },
            after: function(req, res, context) {
                // set some sort of flag after writing list data
                console.log('tax list:fetch:after');
                return context.continue;
            }
        },
        start:{
            action: function(req, res, context) {

                console.log('tax list:start:action',req.query);

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
module.exports = tax;