/**
 * Created by Mithun.Das on 3/13/2016.
 */
var express = require('express');
var router = express.Router();

var async = require("async");

var sequelize = require('../config/sequelize');



router.get('/metadata',function(req,res,next){


    async.auto({
        refund:function(callback){
            sequelize.query("SELECT count(1) as cnt FROM Refund where status in ('REQUESTED')", { type: sequelize.QueryTypes.SELECT})
                .then(function(data) {

                   callback(null, data[0].cnt);
                    return null;
                },function(err){
                    callback(err);
                    return null;
                })
        },
        order:function(callback){
            sequelize.query("select count(1) as cnt from `Order` a, OrderStatus b where a.orderStatusId = b.id and b.code='ordered'", { type: sequelize.QueryTypes.SELECT})
                .then(function(data) {

                    callback(null, data[0].cnt);
                    return null;
                },function(err){
                    callback(err);
                    return null;
                })
        },
        dateRange : function(callback){
            sequelize.query("select  DAY(NOW() - INTERVAL 10 DAY) as start ,DAY(now()) as end from dual", { type: sequelize.QueryTypes.SELECT})
                .then(function(data) {

                    callback(null, data[0]);
                    return null;
                },function(err){
                    callback(err);
                    return null;
                })
        },
        sales: function(callback){
            sequelize.query("select sum(productCost) as cost, concat(MONTH(createdAt),'/',DAY(createdAt)) as day from `order` where createdAt > DATE_SUB(NOW(), INTERVAL 10 DAY) group by DAY(createdAt) order by id ",
                { type: sequelize.QueryTypes.SELECT})
                .then(function(data) {

                    callback(null, data);
                    return null;
                },function(err){
                    callback(err);
                    return null;
                })
        },
        productSales: function(callback){
            sequelize.query("select sum(a.quantity) as quantity,b.name from cart a , product b where a.productId = b.id" +
                " and orderId is not null and returnStatus is null  group by a.productId order by quantity desc limit 5",
                { type: sequelize.QueryTypes.SELECT})
                .then(function(data) {

                    callback(null, data);
                    return null;
                },function(err){
                    callback(err);
                    return null;
                })
        }
    },function(err, results){
        if(err){
            res.json({success: true, message:err.message});
        }else{
            console.log(results);

            var data = {
                refundCount: results.refund,
                newOrderCount: results.order,
                sales:results.sales,
                productSales:results.productSales
            }
            res.json({success: true, data:data});
        }
    })

})


module.exports = router;