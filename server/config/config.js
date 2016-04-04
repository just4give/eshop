/**
 * Created by mithundas on 12/29/15.
 */
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');
var modelPath = path.join(rootPath, 'server/model');

module.exports = {
    development: {

        rootPath: rootPath,
        port: process.env.PORT || 3100,
        host     : "localhost",
        user     : "root",
        password : "root",
        database : "eshop",
        connectionLimit: 50,
        modelPath: modelPath,
        image:{
            repo: "/xampp/htdocs/apps/static",
            thumb:{
                height: 200,
                width:180
            },
            original:{
                height: 400,
                width:360
            },
            rootUrl:"http://cpa.local.com"
        },
        paypal:{
            "api" : {
                "host" : "api.sandbox.paypal.com",
                "port" : "",
                "client_id" : "AQBzaVkwDcE5FxjD8b-WSidhmeVisqyONNckR4fSJLNkg8qKNp5RktfB7cPs1UYqJxFpfmiWLJurqL1p",
                "client_secret" : "EHrJIRqyOJaO7RicMe07dJMhxP4LxfvZlSGQkkbVFPLFVPkVjXaDZB-4PDrFYGXk20RS3IO9Yd7V_b0y",
                redirect_urls :{
                return_url: "http://localhost:4100/api/payments/execute",
                cancel_url: "http://localhost:4100/api/payments/cancel"
                }
            }
        },
        apiContext:"http://localhost:4100",
        mail: {
            "smtp": "smtps://noreply.techfcous@gmail.com:Appstacksolutions@smtp.gmail.com",
            "sender":"eShop <noreply.techfocus@gmail.com>",
            "receiver":"eShop <noreply.techfocus@gmail.com>"
        }


    },
    aws: {

        rootPath: rootPath,
        port: process.env.PORT || 3100,
        host     : "localhost",
        user     : "root",
        password : "password",
        database : "eshop",
        connectionLimit: 50

    }
}