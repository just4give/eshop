/**
 * Created by mithundas on 12/31/15.
 */

var passport = require('passport');


exports.authenticate = function(req, res, next) {

    console.log('login called');

    var auth = passport.authenticate('local', function(err, user) {
        if(err) {
            return next(err);
        }
        console.log('user from authenticate ');


        if(!user) {
            res.send({success:false})
        }

        console.log('loging to session ');
        req.logIn(user, function(err) {
            if(err) {
                return next(err);
            }
            res.send({success:true, user: user});
        })
    })
    auth(req, res, next);
};


exports.requiresApiLogin = function(req, res, next) {

    if(!req.isAuthenticated()) {
        res.status(403);
        res.end();
    } else {
        next();
    }
};


exports.requiresRole = function(role) {
    return function(req, res, next) {
        if(!req.isAuthenticated() || req.user.roles.indexOf(role) === -1) {
            res.status(403);
            res.end();
        } else {
            next();
        }
    }
}