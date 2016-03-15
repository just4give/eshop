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
                "client_id" : "AVMw5JN4k_zRzJ64NBiw4MsRtmIz-VzG7AL8Y9pLJIV8xzh5izEABb7P-IBDAih_x8nJhGTDrrE0rGAg",
                "client_secret" : "ENU_KLnpFMWA4ujjyhOtAewn8CjbPiLoXAmd05SqqKjoRhe8bvhNdO4PPTLoO5IFz-s-K4ZXX7FG6wzU",
                redirect_urls :{
                return_url: "http://localhost:4100/api/payment/execute",
                cancel_url: "http://localhost:4100/api/payment/cancel"
                }
            }
        },
        apiContext:"http://localhost:4200"

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