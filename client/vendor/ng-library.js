/* Generated code for Angular based on Sequelize models */
angular.module('epilouge.ngService',['ngResource']);

angular.module('epilouge.ngService').factory('Category', ["$resource", "$log",function($resource,$log){

    return  $resource('/api/category/:id', { id: '@id' }, {
        update: {
            method: 'PUT' // this method issues a PUT request
        }
    });

}]);

angular.module('epilouge.ngService').factory('Photo', ["$resource", "$log",function($resource,$log){

    return  $resource('/api/photo/:id', { id: '@id' }, {
        update: {
            method: 'PUT' // this method issues a PUT request
        }
    });

}]);

angular.module('epilouge.ngService').factory('Product', ["$resource", "$log",function($resource,$log){

    return  $resource('/api/product/:id', { id: '@id' }, {
        update: {
            method: 'PUT' // this method issues a PUT request
        }
    });

}]);

angular.module('epilouge.ngService').factory('Shipping', ["$resource", "$log",function($resource,$log){

    return  $resource('/api/shipping/:id', { id: '@id' }, {
        update: {
            method: 'PUT' // this method issues a PUT request
        }
    });

}]);

angular.module('epilouge.ngService').factory('Tax', ["$resource", "$log",function($resource,$log){

    return  $resource('/api/tax/:id', { id: '@id' }, {
        update: {
            method: 'PUT' // this method issues a PUT request
        }
    });

}]);

angular.module('epilouge.ngService').factory('User', ["$resource", "$log",function($resource,$log){

    return  $resource('/api/user/:id', { id: '@id' }, {
        update: {
            method: 'PUT' // this method issues a PUT request
        }
    });

}]);

