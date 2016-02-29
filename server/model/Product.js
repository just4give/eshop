/**
 * Created by Mithun.Das on 2/24/2016.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');
var Tax = require('./Tax');

var product = sequelize.define('product', {
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
    description: {
        type: Sequelize.STRING,
        field: 'description'
    },
    imageUrl: {
        type: Sequelize.STRING,
        field: 'imageUrl'
    },
    price: {
        type: Sequelize.INTEGER,
        field: 'price'
    }



},{
    freezeTableName: true,
    timestamps: false

});
product.belongsTo(Tax);
product.sync().then(function(){

});

product.middleware ={
    list: {
        fetch: {
            before: function(req, res, context) {
                context.include = [Tax];
                console.log('Yahooo ! inside product list fetch');
                return context.continue;
            },
            action: function(req, res, context) {
                // change behavior of actually writing the data
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

            return context.error(403, "can't delete a product");
        }
    }
}

module.exports = product;