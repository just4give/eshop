/**
 * Created by Mithun.Das on 12/8/2015.
 */


var User = require('../orm/User');

var crypto = require('crypto');

exports.registerUser = function(formUser,callback){

    User.findOne({where:{email: formUser.email}})
        .then(function(user){
            if(user == null){
                var salt, hash;
                salt = createSalt();
                hash = hashPwd(salt, formUser.password);

                User.create({
                    firstName:formUser.firstName,
                    lastName: formUser.lastName,
                    email:formUser.email,
                    username:formUser.username,
                    password:hash,
                    salt: salt
                }).then(function(data){

                    callback(null,data);
                },function(err){
                    callback(err);
                    return;
                })

            }else{
                callback(null,{errorCode:"102",errorMessage:"You already have account created with this email."});
            }

        },function(err){
            console.log("Database error in loginUser: " + err);
            callback(err);
            return;
        });


}


/*
exports.loginUser = function(user,callback){

    User.findOne({where: {email: user.email, password: user.password}})
        .then(function(data){
            callback(null,data);
        },function(err){
            console.log("Database error in loginUser: " + err);
            callback(err);
            return;
        })
}

exports.loginFBUser = function(user,callback){

    User.findOne({where: {email: user.email, facebookId: user.facebookId}})
        .then(function(data){
            callback(null,data);
        },function(err){
            console.log("Database error in loginUser: " + err);
            callback(err);
            return;
        })
}
exports.createAddress = function(uuid,address,callback){

    User.findOne({where:{uuid:uuid}})
        .then(function(user){

            if(user != null){

                address.userId = user.id;

                if(address.id){
                    //update
                    Address.update(address,{where:{id: address.id}})
                        .then(function(data){

                            callback(null,data);
                        },function(err){
                            console.log("Database error in createAddress: " + err);

                            callback(err);
                            return;
                        });
                }
                else{
                    Address.create(address)
                        .then(function(data){

                            callback(null,data);
                        },function(err){
                            console.log("Database error in createAddress: " + err);

                            callback(err);
                            return;
                        });
                }

            }else{
                console.log("Database error in createAddress:403 ");
                callback({status: 403});
                return;
            }


        },function(err){
            console.log("Database error in createAddress: " + err);

            callback(err);
            return;
        });
}


exports.findDefaultAddress = function(uuid,callback){

    User.findOne({where:{uuid:uuid}})
        .then(function(user){
                console.log('found user id'+user.id);
            if(user != null){



                Address.findOne({where:{userId: user.id, defaultAddress:true}})
                    .then(function(data){

                        callback(null,data);

                    },function(err){
                        console.log("Database error in findDefaultAddress: " + err);

                        callback(err);
                        return;
                    });
            }else{
                console.log("Database error in findDefaultAddress:403 ");
                callback({status: 403});
                return;
            }


        },function(err){
            console.log("Database error in createAddress: " + err);

            callback(err);
            return;
        });
}

exports.findAddressById = function(uuid,addressId, callback){

    User.findOne({where:{uuid:uuid}})
        .then(function(user){
            console.log('found user id'+user.id);
            if(user != null){



                Address.findOne({where:{userId: user.id, id:addressId}})
                    .then(function(data){

                        callback(null,data);

                    },function(err){
                        console.log("Database error in findDefaultAddress: " + err);

                        callback(err);
                        return;
                    });
            }else{
                console.log("Database error in findDefaultAddress:403 ");
                callback({status: 403});
                return;
            }


        },function(err){
            console.log("Database error in createAddress: " + err);

            callback(err);
            return;
        });
}
exports.addresses = function(uuid,callback){

    User.findOne({where:{uuid:uuid}})
        .then(function(user){
            console.log('found user id'+user.id);
            if(user != null){



                Address.findAll({where:{userId: user.id}})
                    .then(function(data){

                        callback(null,data);

                    },function(err){
                        console.log("Database error in addresses: " + err);

                        callback(err);
                        return;
                    });
            }else{
                console.log("Database error in addresses:403 ");
                callback({status: 403});
                return;
            }


        },function(err){
            console.log("Database error in addresses: " + err);

            callback(err);
            return;
        });
}
*/

var createSalt = function() {
    return crypto.randomBytes(128).toString('base64');
}

var hashPwd = function(salt, pwd) {
    var hmac = crypto.createHmac('sha1', salt);
    return hmac.update(pwd).digest('hex');
}