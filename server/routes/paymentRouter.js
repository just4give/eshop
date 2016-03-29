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
var EmailSender = require('../config/email-sender');

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
                "total": "6.07",
                "currency": "USD",
                "details": {
                    "subtotal": "5.00",
                    "tax": "0.07",
                    "shipping": "1.00",
                    "handling_fee": "1.00",
                    "shipping_discount": "-1.00"
                }
            },
            "description": "eShop payment",
            "soft_descriptor": "eShop soft description",
        }]
    };

    if(req.body.paymentMethod === 'credit_card'){
        payment.payer.funding_instruments = [{
            "credit_card": {
                "number": "5500005555555559",
                "type": "mastercard",
                "expire_month": 12,
                "expire_year": 2018,
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

            var err2 = {
                status:500, message:'Invalid card'
            }
            //TODO: generate proper paypal message
            return next(err2);
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
                                      res.json({paymentId: payment.id, method:'credit_card'});
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


                                res.redirect("/confirm?id="+paymentId);
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

router.get('/cancel',auth.requiresApiLogin, function(req, res,next){
    res.redirect("/cart");
});
router.post('/coupon', function(req, res){
    var code = req.param('code');
    var amt = req.param('amt') || 0;
    var now = new Date();
    Coupon.findOne({where: {code:code, validFrom:{$lte:now}, validThrough:{$gte:now} }})
        .then(function(coupon){
          if(!coupon){
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

module.exports = router;