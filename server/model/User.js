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
    /*var salt, hash;
     salt = createSalt();
     hash = hashPwd(salt, 'password');
     return user.create({
     firstName:'micky',
     lastName: 'mouse',
     email:'micky@gmail.com',
     username:'micky@gmail.com',
     password:hash,
     salt: salt
     });*/
});

var hashPwd = function(salt, pwd) {
    var hmac = crypto.createHmac('sha1', salt);
    return hmac.update(pwd).digest('hex');
}

var createSalt = function() {
    return crypto.randomBytes(128).toString('base64');
}

module.exports = user;
