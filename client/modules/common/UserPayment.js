/**
 * Created by Mithun.Das on 3/13/2016.
 */
appModule.factory('UserPayment', ["$rootScope","$http","$q", "$log",function($rootScope, $http, $q,$log){



    return{
        purchase : function(order){

            var deferred = $q.defer();

            $http.post("/api/payments/create", order)
                .success(function (data){

                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });
            return deferred.promise;
        },
        applyCoupon : function(coupon){

            var deferred = $q.defer();

            $http.post("/api/payments/coupon", coupon)
                .success(function (data){

                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });
            return deferred.promise;
        },
        calcTax : function(){

            var deferred = $q.defer();

            $http.post("/api/payments/calctax" )
                .success(function (data){

                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });
            return deferred.promise;
        },

    }

}]);
