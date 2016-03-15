/**
 * Created by Mithun.Das on 3/13/2016.
 */
var express = require('express');
var router = express.Router();

var paypal = require('paypal-rest-sdk');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
paypal.configure(config.paypal.api);



router.post('/create', function(req, res) {

    console.log('making payment');
    console.log('payment id='+req.session.paymentId );
    console.log('create/card : session id='+req.sessionID);
    console.log("req body ", req.body);
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

    paypal.payment.create(payment, function (error, payment) {
        if (error) {
            console.log(error);
        } else {
                  if(payment.payer.payment_method === 'paypal') {
             req.session.paymentId = payment.id;
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
              console.log(payment);
              res.json({paymentId: payment.id, method:'credit_card'});
             }

        }
    });

});

/*router.get('/create/paypal', function(req, res) {

    console.log('making paypal payment');

    var payment = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3200/execute",
            "cancel_url": "http://localhost:3200/cancel"
        },
        "transactions": [{
            "amount": {
                "total": "5.00",
                "currency": "USD"
            },
            "description": "My awesome payment"
        }]
    };

    paypal.payment.create(payment, function (error, payment) {
        if (error) {
            console.log(error);
        } else {
            if(payment.payer.payment_method === 'paypal') {
                req.session.paymentId = payment.id;
                var redirectUrl;
                for(var i=0; i < payment.links.length; i++) {
                    var link = payment.links[i];
                    if (link.method === 'REDIRECT') {
                        redirectUrl = link.href;
                    }
                }
                res.redirect(redirectUrl);
            }
            console.log(payment);
        }
    });

});*/

router.get('/execute', function(req, res){
    var paymentId = req.session.paymentId;
    var payerId = req.param('PayerID');

    var details = { "payer_id": payerId };
    paypal.payment.execute(paymentId, details, function (error, payment) {
        if (error) {
            console.log(error);
        } else {
            res.redirect("/confirm?id="+paymentId);
        }
    });

});
module.exports = router;