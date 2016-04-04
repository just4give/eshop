/**
 * Created by Mithun.Das on 12/8/2015.
 */
appModule.factory('OrderService', ["$rootScope","$http","$q","$log", function($rootScope, $http, $q,$log){
    var apiContext = $rootScope.apiContext;

    return{

        query : function(pageNumber,limit,type,search){

            var deferred = $q.defer();

            $http.get("api/orders/search?page="+pageNumber+"&limit="+limit+"&type="+type+"&search="+angular.toJson(search))
                .success(function (data){
                    deferred.resolve(data);

                })
                .error(function(err){
                    deferred.reject(err);
                });
            return deferred.promise;
        },
        updateStatus : function(orderId,statusId){

            var deferred = $q.defer();

            $http.post("api/orders/updatestatus",{orderId: orderId, statusId: statusId})
                .success(function (data){
                    deferred.resolve(data);

                })
                .error(function(err){
                    deferred.reject(err);
                });
            return deferred.promise;
        },
        requestReturn : function(cartId,type){

            var deferred = $q.defer();

            $http.post("api/orders/return",{cartId: cartId, type: type})
                .success(function (data){
                    deferred.resolve(data);

                })
                .error(function(err){
                    deferred.reject(err);
                });
            return deferred.promise;
        }
    }

}]);
