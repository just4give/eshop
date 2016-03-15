/**
 * Created by Mithun.Das on 2/26/2016.
 */
var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({limit:'01mb'});
var fs = require('fs');
var IdGenerator = require('node-uuid');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var path = require('path');
var easyimg = require('easyimage');
var Photo = require('../model/Photo');



/*router.post('/upload', multipartMiddleware,function (req, res, next) {
    console.log("uploding image");
    var  file = req.files.file;
    var id = IdGenerator.v1();
    var fileName = id +  path.extname(file.name);
    var thumbnailPath = config.image.repo+ '/repo/thumb/'+ fileName;
    var targetPath = config.image.repo+ '/repo/'+ fileName;
    console.log("target", targetPath);

    fs.rename(file.path, targetPath, function(err) {
        if(err) {
            return next(err);
        }
        //create thumbnail just after moving file to repo
        easyimg.thumbnail({
            src:targetPath, dst:thumbnailPath,
            width:180, height:200,
            x:0, y:0
        }).then(
            function(image) {
                var imageUrl = config.apiContext+'/repo/thumb/'+ fileName;
                Photo.create({fileName:fileName, thumbnailUrl: imageUrl, imageUrl:imageUrl,active:true})
                    .then(function(data){
                    res.json(data);
                },function(err){
                    console.log(err);
                    return next(err);
                });


            },
            function (err) {
                console.log(err);
                return next(err);
            }
        );




    });

});*/

router.post('/upload', multipartMiddleware,function (req, res, next) {
    console.log("uploding image");
    var  file = req.files.file;
   // var id = IdGenerator.v1();
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

                        var imageUrl = config.image.rootUrl+'/repo/thumb/'+ photo.id+fileExtn;
                        photo.thumbnailUrl = imageUrl;
                        photo.imageUrl = imageUrl;
                        photo.fileName = photo.id+fileExtn;

                        photo.save()
                            .then(function(){
                                res.json(photo);
                            })

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

module.exports = router;