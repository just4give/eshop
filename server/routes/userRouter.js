/**
 * Created by Mithun.Das on 12/8/2015.
 */
var express = require('express');
var router = express.Router();
var userDB = require('../database/userDB');
var auth = require('../config/auth');
var passport = require('passport');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var templateDir = path.join(__dirname,'..', 'templates', 'welcome-email');
console.log("Template dir ", templateDir);
var welcomeEmailTemplate = new EmailTemplate(templateDir);
var EmailSender = require('../config/email-sender');

/* GET users listing. */
router.get('/profile', function(req, res) {
    var user = {name: 'Joe', pasta: 'spaghetti'};




});

router.post('/register', function(req,res,next){

    var formUser = req.body;
    formUser.roles =['user'];
    console.log(formUser);

    userDB.registerUser(formUser, function(err,data){
        if(err){
            return next(err);
        }
        if(data.success){
            console.log("created user ", data.user);

            req.logIn(data.user, function(err) {
                if(err) {
                    console.log("err in session login ", err);
                    return next(err);
                }
                res.send({success:true, user: data.user});
            })

        }else{
            res.send(data);
        }

    });


});


router.post('/login', auth.authenticate);

router.post('/login/facebook',function(req,res,next){
    var fbUser = req.body;

    userDB.loginFBUser(fbUser, function(err,data){
        if(err){
            return next(err);
        }
        if(data.success){
            console.log("4. success in router  ");
            req.logIn(data.user, function(err) {
                if(err) {
                    console.log("err in session login ", err);
                    return next(err);
                }
                res.send({success:true, user: data.user});
            })

        }else{
            res.send(data);
        }

    });
});

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

router.post('/reqpassword', function(req, res, next) {
    userDB.requestPassword(req.body.email, function(err, data){
        if(err){
            return next(err);
        }
        res.json(data);
    });
});

router.post('/chngpassword', auth.requiresApiLogin, function(req, res, next) {
    userDB.changePassword(req.body.password,req.user.id, function(err, data){
        if(err){
            return next(err);
        }
        res.json(data);
    });
});

module.exports = router;
