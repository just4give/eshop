/**
 * Created by Mithun.Das on 2/24/2016.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');
var Tax = require('./Tax');
var Photo = require('./Photo');
var Category = require('./Category');
var Merchandise = require('./Merchandise');

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
    detailDescription: {
        type: Sequelize.STRING,
        field: 'detailDescription'
    },

    price: {
        type: Sequelize.DECIMAL,
        field: 'price'
    },

    regularPrice: {
        type: Sequelize.DECIMAL,
        field: 'regularPrice',
        set: function(val) {
            return this.setDataValue('regularPrice', val?val:product.price);
        }
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
product.belongsTo(Tax);
product.belongsTo(Photo);
product.belongsTo(Category);
product.belongsTo(Merchandise);
product.sync().then(function(){

});

product.middleware ={
    list: {
        fetch: {
            before: function(req, res, context) {

                //console.log("passport ", req.isAuthenticated());
                //console.log("product search ", req.query, context.criteria);
                context.include = [{model:Tax},{model:Photo},{model:Category},{model:Merchandise}];
                if(req.query.category){
                    if(!Array.isArray(req.query.category)){
                        req.query.category = [req.query.category];
                    }
                    context.include.forEach(function(include){
                       if(include.model == Category){
                           include.where = {name:{$in:req.query.category}};
                       }
                    })

                }
                if(req.query.merchandise){
                    if(!Array.isArray(req.query.merchandise)){
                        req.query.merchandise = [req.query.merchandise];
                    }
                    context.include.forEach(function(include){
                        if(include.model == Merchandise){
                            include.where = {name:{$in:req.query.merchandise}};
                        }
                    })

                }

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

            return context.error(403, "can't delete a product");
        }
    },
    read: {
        fetch: {
            before: function (req, res, context) {
                //context.include = [{model:Tax, where:{id:2}}];
               // console.log('product:read:fetch:before');
                context.include = [{model: Tax}, {model: Photo},{model:Category},{model:Merchandise}];

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
        fetch: {
            before: function (req, res, context) {
                console.log("product:create:fetch")
                context.include = [{model: Tax}, {model: Photo},{model:Category},{model:Merchandise}];

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
        start:{
            action: function(req, res, context) {
                if(req.body.merchandise){
                    req.body.merchandiseId = req.body.merchandise.id;
                }


                return context.continue;
            }
        }
    },
    update: {
        start:{
            action: function(req, res, context) {

                if(req.body.merchandise){
                    req.body.merchandiseId = req.body.merchandise.id;
                }

                return context.continue;
            }
        }
    }
}

module.exports = product;