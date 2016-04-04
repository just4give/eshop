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

            var deferred = $q.defer();


                $http.get("/api/users/loggedin")
                    .success(function (data){
                        if(data.success){

                            $rootScope.user = data.user;
                            $rootScope.loggedIn = true;
                            deferred.resolve(true);
                        }else{

                            deferred.reject('not authorized');
                        }


                    })
                    .error(function(err){

                        deferred.reject('not authorized');
                    });







            return deferred.promise;
        },
        isAuthorizedRole  : function(role){
            var deferred = $q.defer();
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


            return deferred.promise;
        },
        isAdmin:function(){
            if($rootScope.loggedIn && $rootScope.user.roles.indexOf(role) !== -1){
                return true;
            }else{
                return false;
            }
        },
        fbLogin : function(fbUser){

            var deferred = $q.defer();

            $http.post("/api/users/login/facebook",fbUser)
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
        },
        reqPassword : function(email){

            var deferred = $q.defer();

            $http.post($rootScope.apiContext + "/api/users/reqpassword", {email:email})
                .success(function (data){

                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });




            return deferred.promise;
        },
        changePassword : function(pwd){
            var deferred = $q.defer();
            $http.post($rootScope.apiContext + "/api/users/chngpassword", {password:pwd})
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
