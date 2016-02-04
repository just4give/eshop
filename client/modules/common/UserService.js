/**
 * Created by Mithun.Das on 12/8/2015.
 */
appModule.factory('UserService', ["$rootScope","$http","$q", "$log",function($rootScope, $http, $q,$log){



    return{
        login : function(user){

            var deferred = $q.defer();

                $http.post($rootScope.apiContext + "/api/user/login", user)
                    .success(function (data){

                        deferred.resolve(data);
                    })
                    .error(function(err){
                        deferred.reject(err);
                    });




            return deferred.promise;
        },
        loggedIn : function(user){

            var deferred = $q.defer();

            $http.get($rootScope.apiContext + "/api/user/loggedin")
                .success(function (data){

                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });




            return deferred.promise;
        },
        fbLogin : function(){

            var deferred = $q.defer();

            $http.get($rootScope.apiContext + "/api/user/login/facebook")
                .success(function (data){

                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });




            return deferred.promise;
        },
        register : function(user){

            var deferred = $q.defer();

            $http.post($rootScope.apiContext + "/api/user/register", user)
                .success(function (data){

                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });




            return deferred.promise;
        },
        fbRegister : function(user){

            var deferred = $q.defer();

            $http.post($rootScope.apiContext + "/api/user/fb/register", user)
                .success(function (data){

                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });




            return deferred.promise;
        },
        logout : function(){

            var deferred = $q.defer();

            $http.post($rootScope.apiContext + "/api/user/logout", {})
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
