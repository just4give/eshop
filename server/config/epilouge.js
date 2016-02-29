/**
 * Created by Mithun.Das on 2/24/2016.
 */
var sequelize = require('./sequelize');
var restMiddleware = require('./middleware');
var epilogue = require('epilogue');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = function(app,config){

    epilogue.initialize({
        app: app,
        sequelize: sequelize
    });


    //some crazy stuff
    var modelMap=Object();
    var epilogueResource=Object();
    var modelDir =config.modelPath;
    var files = fs.readdirSync(modelDir);
    _.forEach(files,function(file){
        var modelPath = path.join(modelDir,file);
        if(path.extname(file)==='.js'){
            var modelName = path.basename(modelPath,'.js');
            modelMap[modelName]= require(modelPath);
        }


    })

   _.forEach(modelMap, function(value,key){

        var resource =  epilogue.resource({
            model: value,
            endpoints: ['/api/'+key, '/api/'+key+'/:id'],
            associations: false
        });

        if(value.middleware){
            resource.use(value.middleware);
        }else{
            resource.use(restMiddleware);
        }
        epilogueResource['resource'+key] =resource;

    })

    return epilogueResource;

}


