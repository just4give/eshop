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

                return orderStatus.bulkCreate([
                    {id:1,code: 'ordered',label:'Ordered',active:true},
                    {id:2,code: 'prep',label:'Preparing Shipment',active:true},
                    {id:3,code: 'ready',label:'Ready to Ship',active:true},
                    {id:4,code: 'shipped',label:'Shipped',active:true},
                    {id:5,code: 'cancel',label:'Cancelled',active:true}]);
            }

        });
});


module.exports = orderStatus;