/**
 * Created by Mithun.Das on 12/8/2015.
 */
var express = require('express');
var router = express.Router();
var Product = require('../model/Product');
var Tax = require('../model/Tax');
var Photo = require('../model/Photo');
var Category = require('../model/Category');
var Merchandise = require('../model/Merchandise');

/* GET users listing. */
router.get('/search', function(req, res,next) {

    var pageNumber = req.query.page;
    var limit = req.query.limit;
    var search = JSON.parse(req.query.search);
    console.log("Client search object ", search);
    var q ={};
    var wCaterogry ={};
    var wMerchandise ={};

    if(search.query){
        q = {active:true ,$or:[{name:{$like: '%'+search.query+'%'}},{description:{$like: '%'+search.query+'%'}}], price:{$between: [search.priceMin, search.priceMax]}};
    }else{
        q = {active:true, price:{$between: [search.priceMin, search.priceMax]}};
    }
    if(search.checkedCategories.length>0){
        wCaterogry ={name:{$in:search.checkedCategories}};
    }
    if(search.checkedMerchandises.length>0){
        wMerchandise ={name:{$in:search.checkedMerchandises}};
    }
    var o=['createdAt','ASC'];
    if(search.sort){
        o = search.sort;
    }
    Product.findAndCountAll({where:q,
        order:[o],
        include:[{model: Photo},
            {model:Category, where: wCaterogry},
            {model:Merchandise,where:wMerchandise}],
            offset:(pageNumber-1)*limit, limit:parseInt(limit)})
        .then(function(data){
           res.json(data);
        },function(err){
            return next(err);
        })
});

module.exports = router;
