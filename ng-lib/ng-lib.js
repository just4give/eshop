/**
 * Created by Mithun.Das on 2/25/2016.
 */
console.log("generating angular library");

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var modelDir = '../server/model';
var files = fs.readdirSync(modelDir);
var context = {
    services:[]
}

_.forEach(files,function(file){
    var modelPath = path.join(modelDir,file);
    console.log(modelPath, require(modelPath).metadata);
    if(path.extname(file)==='.js'){
        var modelName = path.basename(modelPath,'.js');

        context.services.push({
            model:modelName.toLowerCase(),
            factory: modelName
        })
    }


})
console.log(context);

var Engine = require('velocity').Engine
var engine = new Engine( {template:'./ng-template.vm'} );
//var result = engine.render( require('./ng-lib/context'));
var result = engine.render( context);
//console.log(result);



fs.writeFile('./ng-library.txt', result, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});