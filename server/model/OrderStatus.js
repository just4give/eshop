/**
 * Created by Mithun.Das on 2/24/2016.
 */
var Sequelize = require('sequelize');
var sequelize = require('../config/sequelize');


var orderStatus = sequelize.define('orderStatus', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },

    code: {
        type: Sequelize.STRING,
        field: 'code'
    },
    label: {
        type: Sequelize.STRING,
        field: 'label'
    },
    active: {
        type: Sequelize.BOOLEAN,
        field: 'active'
    }



},{
    freezeTableName: true,
    timestamps: false

});

orderStatus.sync().then(function(){
    return orderStatus.findAll()
        .then(function(data){
            if(data.length==0){

                return orderStatus.create({
                    id:1,
                    code: 'ordered',
                    label:'Ordered',
                    active:true
                });
            }

        });
});


module.exports = orderStatus;