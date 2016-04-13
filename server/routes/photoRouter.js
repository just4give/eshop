/**
 * Created by Mithun.Das on 2/26/2016.
 */
var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({limit:'10mb'});
var fs = require('fs');
var IdGenerator = require('node-uuid');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var path = require('path');
var easyimg = require('easyimage');
var Photo = require('../model/Photo');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var auth = require('../config/auth');


router.post('/upload', multipartMiddleware,auth.requiresRole("admin"),function (req, res, next) {

    var  file = req.files.file;

    var fileExtn = path.extname(file.name);
    var fileName = file.name;



    Photo.create({fileName:fileName, thumbnailUrl: 'TBD', imageUrl:'TBD',active:true})
        .then(function(photo){
                //record created in database
            var thumbnailPath = config.image.repo+ '/repo/thumb/'+ photo.id+fileExtn;
            var targetPath = config.image.repo+ '/repo/'+ photo.id+fileExtn;
            console.log("target", targetPath);

            fs.rename(file.path, targetPath, function(err) {
                if(err) {
                    photo.destroy();
                    return next(err);
                }
                //create thumbnail just after moving file to repo
                easyimg.thumbnail({
                    src:targetPath, dst:thumbnailPath,
                    width:200,
                    x:0, y:0
                }).then(
                    function(image) {


                        if(config.s3.enabled){
                            fs.readFile(targetPath, function (err, data){
                                if(err){
                                    return next(err);
                                }
                                var params = {
                                    Key: photo.id+fileExtn,
                                    Body: data,
                                    Bucket: config.s3.org_bucket
                                };

                                s3.upload(params, function (err, data) {
                                    if(err){
                                        return next(err);
                                    }

                                    fs.unlink(targetPath, function (err) {

                                    })
                                    fs.readFile(thumbnailPath, function (err, data){
                                        if(err){
                                            return next(err);
                                        }
                                        var params = {
                                            Key: photo.id+fileExtn,
                                            Body: data,
                                            Bucket: config.s3.thumb_bucket
                                        };

                                        s3.upload(params, function (err, data) {
                                            if(err){
                                                return next(err);
                                            }
                                            fs.unlink(thumbnailPath, function (err) {

                                            })

                                            photo.thumbnailUrl = "https://s3.amazonaws.com/"+ config.s3.thumb_bucket +"/" + photo.id+fileExtn;
                                            photo.imageUrl = "https://s3.amazonaws.com/"+ config.s3.org_bucket +"/" + photo.id+fileExtn;;
                                            photo.fileName = photo.id+fileExtn;

                                            photo.save()
                                                .then(function(){
                                                    res.json(photo);
                                                })

                                        });

                                    });
                                });

                            });
                        }else{
                            photo.thumbnailUrl = config.image.rootUrl+'/repo/thumb/'+ photo.id+fileExtn;
                            photo.imageUrl = config.image.rootUrl+'/repo/'+ photo.id+fileExtn;;
                            photo.fileName = photo.id+fileExtn;

                            photo.save()
                                .then(function(){
                                    res.json(photo);
                                })
                        }



                    },
                    function (err) {
                        console.log(err);
                        photo.destroy();
                        return next(err);
                    }
                );




            });


        },function(err){
            console.log(err);
            return next(err);
        });





});

/*router.post("/upload/s3", function(req,res,next){
    console.log("Bucket ",config.s3.org_bucket);
    var s3orgbucket = new AWS.S3();
    fs.readFile(config.image.repo+ '/repo/thumb/49.jpg', function (err, data){
        if(err){
            return next(err);
        }

        var params = {
            Bucket: config.s3.org_bucket,

            Delete: {
                Objects: [
                    {
                        Key: '49.jpg'
                    }
                ]
            }

        };
        s3orgbucket.deleteObjects(params, function(err, data) {
           if(err){
               return next(err);
           }

            res.json("deleted");
        });

    });

    /!*
    Bucket Policy

     {
     "Version": "2008-10-17",
     "Statement": [
     {
     "Sid": "AllowPublicRead",
     "Effect": "Allow",
     "Principal": {
     "AWS": "*"
     },
     "Action": [
     "s3:GetObject"
     ],
     "Resource": [
     "arn:aws:s3:::my-brand-new-bucket/!*"
     ]
     }
     ]
     }

     *!/


});*/

module.exports = router;