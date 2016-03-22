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
        }
    }

}]);
