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
var OrderTracking = require('../model/OrderTracking');
var Refund = require('../model/Refund');
var User = require('../model/User');
var async = require("async");
var EmailSender = require('../config/email-sender');


router.get('/search', auth.requiresApiLogin, function(req, res,next) {

    var pageNumber = req.query.page;
    var limit = req.query.limit;
    var type =req.query.type;
   // var search = JSON.parse(req.query.search);
   // console.log("Client search object ", search);
    var q ={};

    var wCaterogry ={};
    var wMerchandise ={};
    if(type ==='user' || req.user.roles.indexOf('admin') === -1){
        q.userId = req.user.id;
    }


    Order.findAndCountAll({where:q,
            order:[['createdAt','DESC']],
            include:[{model: Address},{model: OrderStatus},
                {model: Cart,include:[{model: Product,include:[Photo]}]}],
            offset:(pageNumber-1)*limit, limit:parseInt(limit)})
        .then(function(data){
            res.json(data);
        },function(err){
            return next(err);
        })
});

router.post('/updatestatus', auth.requiresApiLogin, function(req, res,next){

    async.auto(
        {

        findOrderStatus: function( callback){
            Order.findOne({where:{id:req.body.orderId}}
                )
                .then(function(newOrder){
                    callback(null,newOrder);
                    return null;
                },function(err){
                    callback(err);
                })


            },
            updateOrder: ['findOrderStatus',function(results, callback){
                var order = results.findOrderStatus;
                if(req.body.statusId === order.orderStatusId){
                    callback(new Error("Same status can not be updated"));
                    return null;
                }else{
                    order.orderStatusId = req.body.statusId;
                    order.save({fields: ['orderStatusId']})
                        .then(function(data){
                            callback(null, data);
                            return null;


                        },function(err){
                            callback(err);
                            return null;
                        })

                }


            }],
            findOrder :['updateOrder',function(results, callback){

                Order.findOne({where:{id:req.body.orderId},
                        include:[{model: Address},{model: OrderStatus},{model: OrderTracking},{model: Payment},
                            {model: Cart,include:[{model: Product,include:[Photo]}]}]})
                    .then(function(newOrder){
                        callback(null,newOrder);
                        return null;
                    },function(err){
                        callback(err);
                    })


            }],
        findUser:['findOrder', function(results,callback){
            console.log("inside findUser");
                User.findById(results.findOrder.userId)
                    .then(function(user){
                        callback(null,user);
                        return null;
                    },function(err){
                        callback(err);
                    })
        }]  ,
        refund: ['findOrder','findUser' , function(results,callback){
            console.log("inside refund"  );
            if(results.findOrder.orderStatus.code === 'cancel'){
                Refund.create(
                    {   type:'cancel',
                        saleId: results.findOrder.payment.saleId,
                        reqAmnt:results.findOrder.finalCost,
                        userId: req.user.id,
                        orderId: results.findOrder.id,
                        orderNumber: results.findOrder.orderNumber
                    })
                    .then(function(refund){
                        callback(null,{});
                        return null;
                    })
            }else{
                callback(null,{});
                return null;
            }

        }],
        email :['refund',function(results, callback){
            console.log("inside email");
            if(results.findOrder.orderStatus.code === 'cancel') {
                var emailData = {
                    to:results.findUser.email,
                    subject: "Order cancelled "+results.findOrder.orderNumber,
                    model:{
                        orderNumber: results.findOrder.orderNumber,
                        reqAmnt: results.findOrder.finalCost,
                        firstName: results.findUser.firstName
                    }
                }

                EmailSender.sendEmail('order-cancel',emailData, function(err1, results1){
                    callback(null,{});
                });
            }else  if(results.findOrder.orderStatus.code === 'shipped') {
                var emailData = {
                    to:results.findUser.email,
                    subject: "Order shipped "+results.findOrder.orderNumber,
                    model:{
                        orderNumber: results.findOrder.orderNumber,
                        firstName: results.findUser.firstName,
                        carts: results.findOrder.carts,
                        trackingNumber:results.findOrder.orderTracking.trackingNumber,
                        carrier:results.findOrder.orderTracking.carrier,
                        estDelivery: results.findOrder.orderTracking.estDelivery
                    }
                }

                EmailSender.sendEmail('order-shipped',emailData, function(err1, results1){
                    callback(null,{});
                });
            }else{
                callback(null,{});
                return null;
            }


        }]
    }, function(err, results){
            console.log("update order status task completed");
        if(err){

            res.json({success: false, message: err.message});
        }else{
            var order = results.findOrder;
            order.payment=undefined;
            console.log(results.findOrder.orderStatus.code);
            res.json({success:true , order: order});
        }


    });


})

router.post('/return', auth.requiresApiLogin, function(req, res,next){
    var cartId = req.body.cartId;
    var type = req.body.type;
    async.auto({
        cart:function(callback){
            Cart.findById(cartId,{include:[{model: Product,include:[Photo]},{model:User}]})
                .then(function(cart){
                    callback(null,cart);
                    return null;
                },function(err){
                    callback(err);
                    return null;
                })
        },
        order:['cart',function(results, callback){
            Order.findById(results.cart.orderId,{include:[{model:Payment},{model:User}]})
                .then(function(order){
                    callback(null,order);
                    return null;
                },function(err){
                    callback(err);
                    return null;
                })
        }]
        ,
        update:['order',function(results, callback){
            var cart =results.cart;
            if(type === 'return'){
               cart.returnStatus = 'RETURN_REQUESTED';
            }else{
                cart.returnStatus = 'CANCEL_REQUESTED';
            }

            cart.save({fields: ['returnStatus']})
                .then(function(data){
                    callback(null, data);
                    return null;
                },function(err){
                    callback(err);
                    return null;
                })
        }],
        refund:['update', function(results,callback){
            Refund.create(
                {   type:type,
                    saleId: results.order.payment.saleId,
                    reqAmnt:results.cart.price,
                    userId: results.cart.userId,
                    cartId: results.cart.id,
                    orderNumber: results.order.orderNumber,
                })
                .then(function(refund){
                    callback(null,{});
                    return null;
                },function(err){
                    callback(err);
                    return null;
                })
        }],
        email:['refund',function(results,callback){

            try {
                var emailData = {
                    to: results.cart.user.email,
                    subject: "Received " + type + " request",
                    model: {
                        orderNumber: results.order.orderNumber,
                        firstName: results.cart.user.firstName,
                        item: results.cart,
                        estRefundAmnt: results.cart.price + " +Tax",
                        type:type
                    }
                }

                EmailSender.sendEmail('item-return-req', emailData, function (err1, results1) {
                    callback(null, {});
                });
            }catch (err){
                console.log("Error in try ",err);
            }
        }]

    }
        , function(err, results){
        console.log("return task completed");
        if(err){
            console.log(err.message);
            res.json({success: false, message: err.message});
        }else{
            res.json({success: true, message: "Request completed", cart: results.cart});
        }
    })

});
module.exports = router;