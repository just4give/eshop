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
var User = require('../model/User');
var Tax = require('../model/Tax');
var auth = require('../config/auth');
var Payment = require('../model/Payment');
var Order = require('../model/Order');
var Refund = require('../model/Refund');
var EmailSender = require('../config/email-sender');
var async = require("async");

router.post('/create', auth.requiresApiLogin,function(req, res,next) {

 console.log("req body ", req.body);
    var order = req.body;
    order.userId =  req.user.id;
    var payment = {
        "intent": "sale",
        "payer": {
            "payment_method": req.body.paymentMethod

        },
        "transactions": [{
            "amount": {
                "total": "8.00",
                "currency": "USD"
            },
            "description": "eShop payment",
            "soft_descriptor": "eShop soft description",
        }]
    };

    if(req.body.paymentMethod === 'credit_card'){
        payment.payer.funding_instruments = [{
            "credit_card": {
                "number": "4032035880663596",
                "type": "visa",
                "expire_month": 12,
                "expire_year": 2020,
                "cvv2": 111,
                "first_name": "Joe",
                "last_name": "Shopper"
            }
        }];
    }else{
        payment.redirect_urls =config.paypal.api.redirect_urls;
    }

    paypal.payment.create(payment, function (err, payment) {
        if (err) {
             //TODO: generate proper paypal message
            return next(err);
        } else {


            if(payment.payer.payment_method === 'paypal') {
             req.session.paymentId = payment.id;
             req.session.order = JSON.stringify(order);

             var redirectUrl;
             for(var i=0; i < payment.links.length; i++) {
             var link = payment.links[i];
             if (link.method === 'REDIRECT') {
             redirectUrl = link.href;
             }
             }
              console.log("redirecting to ", redirectUrl);
             res.json({method:'paypal', redirectUrl:redirectUrl});
             }else{
                  req.session.paymentId = payment.id;
                  console.log("CC payment ", payment);
                  //save details into database
                  Payment.create({
                      method:payment.payer.payment_method,
                      paymentId:payment.id,
                      saleId:payment.transactions[0].related_resources[0].sale.id,
                      amount:payment.transactions[0].amount.total,
                      cardNumber:order.card.number,
                      payerInfo: JSON.stringify(payment.payer),
                      transactionInfo: JSON.stringify(payment.transactions),
                      userId: req.user.id
                  }).then(function(data){
                      order.paymentId = data.id;
                      order.orderStatusId=1;
                      Order.create(order)
                          .then(function(data){
                              Cart.update({orderId: data.id, updatedAt:new Date()},{where: {id: {$in:order.cartIds}} })
                                  .then(function(data){
                                      res.json({paymentId: order.orderNumber, method:'credit_card'});
                                  },function(err){
                                      return next(err);
                                  })


                          },function(err){

                          })


                  },function(err){
                      return next(err);
                  })

             }

        }
    });

});



router.get('/execute',auth.requiresApiLogin, function(req, res,next){
    var paymentId = req.session.paymentId;
    var payerId = req.param('PayerID');
    var order = JSON.parse(req.session.order);
    //console.log("2.Cart ids ",order.cartIds);
    var details = { "payer_id": payerId };
    paypal.payment.execute(paymentId, details, function (error, payment) {
        if (error) {
            console.log(error);
            return next(err);
        } else {
            console.log("Paypal payment ", payment);
            //res.redirect("/confirm?id="+paymentId);
            Payment.create({
                method:payment.payer.payment_method,
                paymentId:payment.id,
                payerId:payment.payer.payer_info.payer_id,
                saleId:payment.transactions[0].related_resources[0].sale.id,
                amount:payment.transactions[0].amount.total,
                payerInfo: JSON.stringify(payment.payer),
                transactionInfo: JSON.stringify(payment.transactions),
                userId: req.user.id
            }).then(function(data){
                order.paymentId = data.id;
                Order.create(order)
                    .then(function(newOrder){
                        Cart.update({orderId: newOrder.id, updatedAt:new Date()},{where: {id: {$in:order.cartIds}} })
                            .then(function(data){

                                sendOrderEmail(newOrder.id);


                                res.redirect("/confirm?id="+newOrder.orderNumber);
                            },function(err){
                                return next(err);
                            })


                    },function(err){

                    })


            },function(err){
                return next(err);
            })
        }
    });

});

var sendOrderEmail = function(orderId){
    Order.findOne({where:{id:orderId},
            include:[{model: Payment},{model: User},
                {model: Cart,include:[{model: Product,include:[Photo]}]}]})
        .then(function(newOrder2){
            var emailData = {
                to:newOrder2.user.email,
                subject: "Order placed "+newOrder2.orderNumber,
                model:{
                    orderNumber: newOrder2.orderNumber,
                    firstName: newOrder2.user.firstName,
                    productCost: newOrder2.productCost,
                    discount: newOrder2.discount,
                    tax: newOrder2.tax,
                    shippingCost: newOrder2.shippingCost,
                    finalCost:newOrder2.finalCost,
                    carts:newOrder2.carts
                }
            }

            EmailSender.sendEmail('order-placed',emailData, function(err1, results1){
                return null;
            });

            return null;
        },function(err){
            return null;
        })
}

router.get('/cancel', function(req, res,next){
    res.redirect("/cart");
});
router.post('/coupon', function(req, res){
    var code = req.param('code');
    var amt = req.param('amt') || 0;
    var now = new Date();
    Coupon.findOne({where: {code:code, validFrom:{$lte:now}, validThrough:{$gte:now} }})
        .then(function(coupon){
          if(!coupon || !coupon.active){
              res.json({valid:false, message:'Coupon not valid or expired'});
         }else{
             if(coupon.minPurchase > amt ){
                  res.json({valid:false, message:'Minimum purchase required'});
              }else{

                 var discount =0;
                 if(coupon.type === 'amt'){
                     discount = coupon.value;
                 }else{
                     discount = (amt*coupon.value)/100;
                 }
                  res.json({valid:true, amt:discount, id:coupon.id});
              }
          }

        },function(err){
           return next(err);
        });

});
router.post('/calctax', auth.requiresApiLogin,function(req, res){
    var userId =req.user.id;

    Cart.findAll({where: {userId:userId, orderId:null },include:[{model: Product,include:[Tax]}]})
        .then(function(carts){
            var estTax =0;
            carts.forEach(function(cart){
                estTax += (cart.product.price*cart.quantity*cart.product.tax.pct)/100;
            })
            res.json({tax:estTax});
        },function(err){
            return next(err);
        });

});

router.post('/refund', auth.requiresRole("admin"), function(req, res, next){
    var refundId = req.body.refundId;
    var fund = {
                 amount:{
                     currency: "USD",
                     total : req.body.amount
                 }
    }

    async.auto({
        findRefund : function(callback){

            console.log("*** 1. findRefund");
            Refund.findById(refundId,{include:[{model:User}]})
                .then(function(data){
                    if(data.status ==='PROCESSED'){
                        callback(new Error("This request was processed earlier"));

                    }else{
                        callback(null,data);

                    }
                    return null;
                },function(err){
                    callback(err);
                    return null;
                })
        },
        processRefund : ['findRefund', function(results, callback){
            console.log("*** 2. processRefund " , fund);
            console.log("*** Sale ID ",results.findRefund.saleId);
            paypal.sale.refund(results.findRefund.saleId, fund, function(err, data){
                if(err){
                    console.log("** Error in paypal ", err);
                    callback(err);
                    return null;
                }
                else{
                    callback(null,{});
                    return null;
                }
            })
        }],
        updateRefund : ['processRefund', function(results,callback){
            console.log("*** 3. updateRefund");
            var refund = results.findRefund;
            refund.status='PROCESSED';
            refund.refundAmnt=req.body.amount;
            refund.updatedAt = new Date();

            refund.save({fields: ['status','refundAmnt','updatedAt']})
                .then(function(data){
                    callback(null, data);
                    return null;
                },function(err){
                    callback(err);
                    return null;
                })

        }],
        updateCart: ['processRefund', function(results,callback){
            console.log("*** 4. updateCart");
            if(results.findRefund.cartId){
                Cart.findById(results.findRefund.cartId,{include:[{model: Product,include:[Photo]}]})
                    .then(function(cart){
                       // callback(null,data);
                       // return null;
                        if(results.findRefund.type === 'return'){
                            cart.returnStatus = 'RETURN_PROCESSED';
                        }else{
                            cart.returnStatus = 'CANCEL_PROCESSED';
                        }
                        cart.updatedAt = new Date();
                        cart.save({fields: ['returnStatus','updatedAt']})
                            .then(function(data){
                                callback(null, cart);
                                return null;
                            },function(err){
                                callback(err);
                                return null;
                            })

                    },function(err){
                        callback(err);
                        return null;
                    })

            }else{
                callback(null,undefined);
                return null;
            }

        }],
        email:['updateRefund','updateCart', function(results,callback){
            try {
                console.log("*** 5. email");
                var emailData = {
                    to: results.findRefund.user.email,
                    subject: "Processed " + results.findRefund.type + " request",
                    model: {
                        orderNumber: results.findRefund.orderNumber,
                        firstName: results.findRefund.user.firstName,
                        item: results.updateCart,
                        refundAmnt: req.body.amount,
                        type:results.findRefund.type
                    }
                }

                EmailSender.sendEmail('item-return-processed', emailData, function (err1, results1) {
                    callback(null, {});
                });
            }catch (err){
                console.log("Error in try ",err);
            }
        }]
    },function(err, results){
        if(err){
            console.log("** Final error " , err);
            res.json({success:false, message: err.message});
        }else{
            res.json({success:true});
        }
    })



})

router.get('/list', auth.requiresRole("admin"),function(req, res, next){
    paypal.payment.list(function(err, data){
        if(err){
            res.json(err);
            return;
        }
        res.json(data);
    })
})

module.exports = router;