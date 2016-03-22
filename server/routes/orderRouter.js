/**
 * Created by Mithun.Das on 3/13/2016.
 */
var express = require('express');
var router = express.Router();

var paypal = require('paypal-rest-sdk');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
paypal.configure(config.paypal.api);
var Coupon = require('../model/Coupon');
var Cart = require('../model/Cart');
var Product = require('../model/Product');
var Photo = require('../model/Photo');
var Tax = require('../model/Tax');
var auth = require('../config/auth');
var Payment = require('../model/Payment');
var Order = require('../model/Order');
var Address = require('../model/Address');
var OrderStatus = require('../model/OrderStatus');

router.get('/search', auth.requiresApiLogin, function(req, res,next) {

    var pageNumber = req.query.page;
    var limit = req.query.limit;
    var type =req.query.type;
   // var search = JSON.parse(req.query.search);
   // console.log("Client search object ", search);
    var q ={};

    var wCaterogry ={};
    var wMerchandise ={};
    if(type ==='user'){
        q.userId = req.user.id;
    }


    Order.findAndCountAll({where:q,
            order:[['createdAt','DESC']],
            include:[{model: Address},{model: OrderStatus},
                {model: Cart,include:[{model: Product,include:[Photo]}]}]})
        .then(function(data){
            res.json(data);
        },function(err){
            return next(err);
        })
});


module.exports = router;