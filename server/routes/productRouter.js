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

    console.log("product search request ", req.query);

    Product.findAndCountAll()
        .then(function(data){
           res.json(data);
        },function(err){
            return next(err);
        })
});

module.exports = router;
