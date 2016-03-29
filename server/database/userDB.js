/**
 * Created by Mithun.Das on 12/8/2015.
 */


var User = require('../model/User');

var crypto = require('crypto');
var generatePassword = require('password-generator');

exports.registerUser = function(formUser,callback){

    User.findOne({where:{email: formUser.email, facebookId:null}})
        .then(function(user){
            console.log("after user find ", user);
            if(user == null){
                var salt, hash;
                salt = createSalt();
                hash = hashPwd(salt, formUser.password);
                console.log("before  user create ", user);
                User.create({
                    firstName:formUser.firstName,
                    lastName: formUser.lastName,
                    email:formUser.email,
                    username:formUser.email,
                    password:hash,
                    salt: salt,
                    roles:formUser.roles
                }).then(function(data){

                    callback(null,{success:true, user:data});
                },function(err){
                    callback(err);
                    return;
                })

            }else{

                callback(null,{success:false, message:"You already have account created with this email."});
            }

        },function(err){

            callback(err);
            return;
        });


}

exports.loginFBUser = function(fbUser,callback){

    User.findOne({where: {email: fbUser.email, facebookId: fbUser.facebookId}})
        .then(function(user){
            console.log("1.fb user find ",user);
            if(user!=null){
                callback(null,{success:true, user:user});
            }else{
                console.log("2. create fb user  ",user);
                User.create({
                    firstName:fbUser.firstName,
                    lastName: fbUser.lastName,
                    email:fbUser.email,
                    username:fbUser.email,
                    facebookId:fbUser.facebookId,
                    roles:['user']
                }).then(function(data){
                    if(err){
                        console.log("error in create ",err);
                        callback(err);
                        return;
                    }
                    console.log("2. fb user created  ",data);
                    callback(null,{success:true, user:data});
                    return;
                },function(err){
                    callback(err);
                    return;
                })
            }

        },function(err){
            console.log("Database error in loginUser: " + err);
            callback(err);
            return;
        })
}


exports.requestPassword = function(email,callback){

    User.findOne({where:{email: email, facebookId:null}})
        .then(function(user){

            if(user == null){
                callback(null,{success:false, message:"We could not find your email in our system"});

            }else{
                var salt, hash;
                salt = createSalt();

                var password = generatePassword(12, false);

                hash = hashPwd(salt, password);
                console.log("generated password ",password);
                user.password = hash;
                user.salt = salt;

                user.save({fields: ['password','salt']}).then(function(){
                    callback(null,{success:true, message:"We sent password to your email address. We highly encourage you to change this password after login. "+password});
                })

            }

        },function(err){

            callback(err);
            return;
        });

}


exports.changePassword = function(password,userId,callback){

    User.findOne({where:{id:userId}})
        .then(function(user){
            var salt, hash;
            salt = createSalt();

            hash = hashPwd(salt, password);

            user.password = hash;
            user.salt = salt;

            user.save({fields: ['password','salt']}).then(function(){
                callback(null,{success:true, message:"Password changed successfully"});
            })

        },function(err){
            console.log( err);
            callback(err);
            return;
        })

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