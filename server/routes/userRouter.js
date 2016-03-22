/**
 * Created by Mithun.Das on 12/8/2015.
 */
var express = require('express');
var router = express.Router();
var userDB = require('../database/userDB');
var auth = require('../config/auth');
var passport = require('passport');

/* GET users listing. */
router.get('/profile', function(req, res) {
    res.json({firstName:"John", lastName:"Smith"});
});

router.post('/register', function(req,res,next){
   console.log(req.body);

    userDB.registerUser(req.body, function(err,data){
        if(err){
            return next(err);
        }
        res.json(data);

    });


});


router.post('/login', auth.authenticate);

router.get('/loggedin',function(req,res,next){
    console.log('callling loggedIn');
    if(!req.isAuthenticated()) {
        res.send({success:false});
    } else {
        res.send({success:true, user: req.user});
    }
});


router.post('/logout', function(req, res) {
    req.logout();
    res.end();
});


module.exports = router;
