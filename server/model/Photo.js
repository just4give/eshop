/**
 * Created by Mithun.Das on 2/24/2016.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var path = require('path');
var fs = require('fs');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var photo = sequelize.define('photo', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },

    fileName: {
        type: Sequelize.STRING,
        field: 'fileName'
    },
    imageUrl: {
        type: Sequelize.TEXT,
        field: 'imageUrl'
    },
    thumbnailUrl: {
        type: Sequelize.TEXT,
        field: 'thumbnailUrl'
    },
    active: {
        type: Sequelize.BOOLEAN,
        field: 'active'
    }



},{
    freezeTableName: true,
    timestamps: false

});

photo.sync().then(function(){

});

photo.middleware = {
    delete:{
        auth: function(req, res, context) {

           // return context.error(403, "can't delete a photo");
            return  context.continue;
        },
        fetch: function(req, res, context) {
            console.log("photo delete:fetch ",context.instance.fileName);
            var thumbnailPath = path.join(config.image.repo, '/repo/thumb/', context.instance.fileName);
            var targetPath = path.join(config.image.repo, '/repo/', context.instance.fileName);

            fs.stat(thumbnailPath,function(err, stat){
                if(!err){
                    fs.unlink(thumbnailPath);
                }
            });

            fs.stat(targetPath,function(err, stat){
                if(!err){
                    fs.unlink(targetPath);
                }
            });

            var params1 = {
                Bucket: config.s3.org_bucket,
                Delete: {
                    Objects: [
                        {
                            Key: context.instance.fileName
                        }
                    ]
                }

            };
            var params2 = {
                Bucket: config.s3.thumb_bucket,
                Delete: {
                    Objects: [
                        {
                            Key: context.instance.fileName
                        }
                    ]
                }

            };
            s3.deleteObjects(params1, function(err, data) {

            });
            s3.deleteObjects(params2, function(err, data) {

            });


            return  context.continue;
        },
        write: function(req, res, context) {


            return  context.continue;
        }
    }
}
module.exports = photo;