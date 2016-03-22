/**
 * Created by Mithun.Das on 12/8/2015.
 */
appModule.factory('UserService', ["$rootScope","$http","$q", "$log",function($rootScope, $http, $q,$log){



    return{
        login : function(user){

            var deferred = $q.defer();

                $http.post("/api/users/login", user)
                    .success(function (data){

                        deferred.resolve(data);
                    })
                    .error(function(err){
                        deferred.reject(err);
                    });




            return deferred.promise;
        },
        isAuthorized  : function(){
            console.log("inside isAuthorized");
            var deferred = $q.defer();

            if($rootScope.loggedIn ){
                deferred.resolve(true);
            }else {
                $http.get("/api/users/loggedin")
                    .success(function (data){
                        if(data.success){

                            $rootScope.user = data.user;
                            $rootScope.loggedIn = true;
                            deferred.resolve(true);
                        }else{
                            console.log("1. not authorized");
                            deferred.reject('not authorized');
                        }


                    })
                    .error(function(err){
                        console.log("2. not authorized");
                        deferred.reject('not authorized');
                    });

            }





            return deferred.promise;
        },
        isAuthorizedRole  : function(role){
            var deferred = $q.defer();
            if($rootScope.loggedIn){
                if( $rootScope.user.roles.indexOf(role) !== -1){
                    deferred.resolve(true);
                }else{
                    deferred.reject('not authorized');
                }

            }else {
                $http.get("/api/users/loggedin")
                    .success(function (data){
                        if(data.success){

                            $rootScope.user = data.user;
                            $rootScope.loggedIn = true;
                            if( $rootScope.user.roles.indexOf(role) !== -1){
                                deferred.resolve(true);
                            }else{
                                deferred.reject('not authorized');
                            }


                        }else{
                            deferred.reject('not authorized');
                        }


                    })
                    .error(function(err){
                        deferred.reject('not authorized');
                    });

            }
            return deferred.promise;
        },
        isAdmin:function(){
            if($rootScope.loggedIn && $rootScope.user.roles.indexOf(role) !== -1){
                return true;
            }else{
                return false;
            }
        },
        fbLogin : function(){

            var deferred = $q.defer();

            $http.get("/api/users/login/facebook")
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

            $http.post( "/api/users/register", user)
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

            $http.post($rootScope.apiContext + "/api/users/logout", {})
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
