/**
 * Created by mithun.das on 3/23/2016.
 */
var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
//var templateDir = path.join(__dirname,'..', 'email-templates', 'welcome-email');
var welcomeEmailTemplate = new EmailTemplate(path.join(__dirname,'..', 'email-templates', 'welcome-email'));
var orderCancelEmailTemplate = new EmailTemplate(path.join(__dirname,'..', 'email-templates', 'order-cancel-email'));

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./config')[env];
var transporter = nodemailer.createTransport(config.mail.smtp);

var templateMap ={};
templateMap['welcome'] =  new EmailTemplate(path.join(__dirname,'..', 'email-templates', 'welcome-email'));
templateMap['order-cancel'] = new EmailTemplate(path.join(__dirname,'..', 'email-templates', 'order-cancel-email'));
templateMap['order-shipped'] = new EmailTemplate(path.join(__dirname,'..', 'email-templates', 'order-shipped-email'));
templateMap['order-placed'] = new EmailTemplate(path.join(__dirname,'..', 'email-templates', 'order-placed-email'));
templateMap['item-return-req'] = new EmailTemplate(path.join(__dirname,'..', 'email-templates', 'item-return-req-email'));
templateMap['item-return-processed'] = new EmailTemplate(path.join(__dirname,'..', 'email-templates', 'item-return-processed-email'));

var emailSender = {


    sendEmail: function(type,data, callback){

        var template = templateMap[type];
        console.log("sending email ", template);
        if( template){
            template.render(data, function (err, result) {
                if(err){
                    console.log("err ",err);
                    callback(err);
                    return;
                }

                transporter.sendMail({
                        from: config.mail.sender,
                        to: data.to,
                        cc: config.mail.receiver,
                        subject:data.subject,
                        html:result.html  },

                    function(error, info){
                        if(error){
                            console.log("Error in transport email ",error);
                            callback(error);
                            return;
                        }

                        callback(null,true);
                    });
            })
        }else{
            callback(new Error("Template not defined"));
        }

    },
    getHTMLTemplate :function(type,model){

    }
}

module.exports =emailSender;