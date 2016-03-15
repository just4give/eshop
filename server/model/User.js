/**
 * Created by Mithun.Das on 12/10/2015.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');
var crypto = require('crypto');

var user = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },
    uuid: {
        type: Sequelize.UUID,
        field: 'uuid',
        unique: true,
        defaultValue: Sequelize.UUIDV1
    },
    firstName: {
        type: Sequelize.STRING,
        field: 'firstName'
    },
    lastName: {
        type: Sequelize.STRING,
        field: 'lastName'
    },
    email: {
        type: Sequelize.STRING,
        field: 'email',
        unique:true
    },
    username: {
        type: Sequelize.STRING,
        field: 'username'
    },
    password: {
        type: Sequelize.STRING,
        field: 'password'
    },
    salt: {
        type: Sequelize.STRING,
        field: 'salt'
    },
    roles: {
        type: Sequelize.STRING,
        get: function() {
            return JSON.parse(this.getDataValue('roles'));
        },
        set: function(val) {
            return this.setDataValue('roles', JSON.stringify(val));
        }
    }

},{
    freezeTableName: true,
    timestamps: false,
    instanceMethods: {
        authenticate: function(passwordToMatch) {
            return hashPwd(this.salt, passwordToMatch) === this.password;
        }
    }
});

user.sync().then(function(){


    return user.findAll()
        .then(function(data){
            if(data.length==0){
                var salt, hash;
                salt = createSalt();
                hash = hashPwd(salt, 'password');
                return user.create({
                    firstName:'micky',
                    lastName: 'mouse',
                    email:'micky@gmail.com',
                    username:'micky@gmail.com',
                    password:hash,
                    salt: salt,
                    roles:["user","admin"]
                });
            }

        });

});

var hashPwd = function(salt, pwd) {
    var hmac = crypto.createHmac('sha1', salt);
    return hmac.update(pwd).digest('hex');
}

var createSalt = function() {
    return crypto.randomBytes(128).toString('base64');
}

user.middleware ={
    list: {
        fetch: {
            before: function(req, res, context) {

                return context.continue;
            },
            action: function(req, res, context) {

                return context.continue;
            },
            after: function(req, res, context) {

                return context.continue;
            }
        },
        start:{
            action: function(req, res, context) {


                return context.continue;
            }
        }
    },
    read: {
        fetch: {
            before: function (req, res, context) {
                console.log("*** user read");
                return context.continue;
            },
            action: function (req, res, context) {
                // change behavior of actually writing the data
                return context.continue;
            },
            after: function (req, res, context) {
                // set some sort of flag after writing list data
                return context.continue;
            }
        }
    },
    delete:{
        auth: function(req, res, context) {

            return context.error(403, "can't delete a product");
        }
    }
}
module.exports = user;
