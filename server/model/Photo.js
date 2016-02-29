/**
 * Created by Mithun.Das on 2/24/2016.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');


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

            return context.error(403, "can't delete a photo");
        }
    }
}
module.exports = photo;