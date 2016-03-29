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
    var asyncTasks = [];


    async.auto(
        {
        updateOrder: function(callback){
                Order.update({orderStatusId:req.body.statusId},{where:{id:req.body.orderId}}).
                    then(function(data){
                    callback(null,data);
                    return null;
                },function(err){
                    callback(err)
                    return null;
                })

        },
        findOrder: ['updateOrder',function( results,callback){
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
            console.log("inside refund");
            if(results.findOrder.orderStatus.code === 'cancel'){
                Refund.create(
                    {   type:'cancel',
                        saleId: results.findOrder.payment.saleId,
                        reqAmnt:results.findOrder.finalCost,
                        userId: req.user.id,
                        orderId: results.findOrder.id
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
            console.log("task completed");
        if(err){

            return next(err);
        }
       var order = results.findOrder;
       order.payment=undefined;
       res.json(order);

    });

/*
    Order.update({orderStatusId:req.body.statusId},{where:{id:req.body.orderId}})
          .then(function(data){




             /!* Order.findOne({where:{id:req.body.orderId},
                  include:[{model: Address},{model: OrderStatus},{model: OrderTracking},{model: Payment},
                  {model: Cart,include:[{model: Product,include:[Photo]}]}]})
                  .then(function(data){
                      if(data.orderStatus.code === 'cancelled'){
                          EmailSender.sendOrderCancelEmail({
                            orderNumber: data.orderNumber,
                            to: data.user.email,
                            reqAmnt  : finalCost,
                            firstName: data.user.firstName
                          });

                          Refund.create(
                                {   type:'cancel',
                                    saleId: data.payment.saleId,
                                    reqAmnt:finalCost,
                                    userId: req.user.id,
                                    orderId: data.id
                                })
                                .then(function(refund){
                                    delete data.payment;
                                    res.json(data);
                                })
                      }else{
                          delete data.payment;
                          res.json(data);
                      }


                  },function(err){
                      return next(err);
                  })*!/

          },function(err){
              return next(err);
          })*/
})


module.exports = router;