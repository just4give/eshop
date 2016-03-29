/**
 * Created by mithundas on 12/30/15.
 */
var passport = require('passport'),

    LocalStrategy = require('passport-local').Strategy,
    User = require('../model/User');



module.exports = function(config) {

    var usersProjection = {
        password: false,
        salt: false
    };

    passport.use(new LocalStrategy(
        function(username, password, done) {

            console.log('calling passport.use with '+ username +" " + password);

            User.findOne({where:{username:username,facebookId:null}}).then(function(user) {

                if(user && user.authenticate(password)) {

                    delete user.dataValues.password;
                    delete user.dataValues.salt;

                    return done(null, user);
                } else {

                    return done(null, false);
                }
            },function(err){
                return done(null, false);
            });
        }
    ));





    passport.serializeUser(function(user, done) {

        if(user) {
            done(null, user.uuid);
        }
    });

    passport.deserializeUser(function(id, done) {
        console.log('deserialize '+ id);
        User.findOne({where:{uuid:id}}).then(function(user) {
            if(user) {
                delete user.dataValues.password;
                delete user.dataValues.salt;
                return done(null, user);
            } else {
                return done(null, false);
            }
        },function(err){
            return done(null, false);
        })
    })

}