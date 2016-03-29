/**
 * Created by Mithun.Das on 12/4/2015.
 */
appModule.controller("loginController",["$window","$scope","$rootScope","$log","$modal", "$interval","$timeout",
    "$state","UserService","localStorageService","OrderService","UserCart","$stateParams","$location","Facebook",
    function($window,$scope,$rootScope,$log,$modal,$interval,$timeout,$state,UserService,localStorageService,OrderService,UserCart,$stateParams,$location,Facebook){

    $log.debug('initializing login controller');
    $log.debug($rootScope.bootstrappedUser);
    //$rootScope.search =  $rootScope.search || {};
    $rootScope.apiContext="";
    $scope.signupprogress = false;

    $scope.loginform ={};
    $scope.signupform ={};
    $rootScope.fbLoggedIn = false;
    $rootScope.fbUser = {};

    var callbackUrl = $stateParams.cb;
    $location.search('cb', null);

    var modal;

    //check cart
   /* if( !$rootScope.loggedIn) {
       // $rootScope.cartImages = localStorageService.get("cart");
    }*/
        if(!localStorageService.get('cart')){
            localStorageService.set('cart', []);
        }

        localStorageService.bind($rootScope, 'cart');

        /*$rootScope.$watch("cart",function(newValue,oldValue){
            $log.debug("*** cart modified");
           $rootScope.cartUpdated=true;
        },true);*/


        UserService.isAuthorized().
         then(function(data){

     },function(err){
         $rootScope.$broadcast('api_error',err);
     })

    $scope.openLoginPopup = function(){

         modal = $modal({scope: $scope, templateUrl: 'modules/common/tmpl/modal/login-modal.html', show: true});
    }

    $scope.submitLogin = function(){
        $scope.showLoginErr ='';
        $scope.signupprogress = true;

        $log.debug($scope.loginform );

        if(!$scope.loginform.username || !$scope.loginform.password ){
            $scope.showLoginErr = 'Please provide email and password.';
            $scope.signupprogress = false;
            return;
        }

        UserService.login($scope.loginform).then(function(data){
            $scope.signupprogress = false;

            if(!data.success){
                $scope.showLoginErr = "Login failed";
            }else{

                $rootScope.user = data.user;
                $rootScope.loggedIn = true;
                //UserCart.sync();
                if(modal){
                    modal.hide();
                }
                if($rootScope.loginRedirect){
                    $state.go($rootScope.loginRedirect);
                }else{
                    $state.go("home");
                }


                //then fetch call cart details
            }
        },function(err){
            $scope.signupprogress = false;
            $rootScope.$broadcast('api_error',err);
        });


    }



    $scope.logout = function(){

        UserService.logout().then(function(data){
            $rootScope.loggedIn = false;
            $rootScope.user=undefined;
            $rootScope.cart=[];
            localStorageService.remove("cart");
            $state.go('home');
        },function(err){

        });

    }

    $scope.signup = function(){
        $scope.showSignupErr ='';
        $scope.signupprogress = true;

        $log.debug($scope.signupform );

        if(!$scope.signupform.firstName || !$scope.signupform.lastName || !$scope.signupform.email || !$scope.signupform.password || !$scope.signupform.password2){
            $scope.showSignupErr = 'Please provide data for all the fields.';
            $scope.signupprogress = false;
            return;
        }
        if($scope.signupform.password !=$scope.signupform.password2 ){
            $scope.showSignupErr = 'Both passwords did not match.';
            $scope.signupprogress = false;
            return;
        }
        UserService.register($scope.signupform).then(function(data){
            $scope.signupprogress = false;
            if(!data.success){
                $scope.showSignupErr = data.message;
            }else{

                $rootScope.user = data.user;
                $rootScope.loggedIn = true;

                if($rootScope.loginRedirect){
                    $state.go($rootScope.loginRedirect);
                }else{
                    $state.go("home");
                }


            }
        },function(err){
            $scope.signupprogress = false;
            $rootScope.$broadcast('api_error',err);
        });

    }




        $scope.fbLogin = function() {
            //alert('fb login called' + $state.current.name);
            //localStorageService.cookie.set("ui-state",$state.current.name,1);

            //$window.location.href='http://localhost:3000/api/user/login/facebook';
            /*UserService.fbLogin().then(function(data) {
                $scope.signupprogress = false;
                $log.debug(data);
            },function(err){

            });*/
           // fnFBLogin();
           /* var url='https://www.facebook.com/dialog/oauth?client_id=341307939406976&redirect_uri=http://localhost:3000/api/user/login/facebook/callback';

            var fbLoginWindow = $window.open(url,'_blank', 'location=no,toolbar=yes,height=400,width=800');

            /!*window.fbLoginWindow.addEventListener('loadstart',function(event){
                console.log('load');
            });*!/

            fbLoginWindow.onload = function(){
                $log.debug('+++++ on load');
            }

            fbLoginWindow.onbeforeunload =function(){
                $log.debug('+++++ on close');
            }*/
            if(!$rootScope.fbLoggedIn){
                    Facebook.login(function(response) {
                        $log.debug(response);
                        if (response.status == 'connected') {
                            $rootScope.fbLoggedIn = true;
                            $scope.me($scope.fbLoginApp);

                        }

                    },{scope: 'email'});
                }else{
                    $scope.fbLoginApp();
                }

        };
        $scope.$watch(
            function() {
                return Facebook.isReady();
            },
            function(newVal) {
                if (newVal)
                    $scope.facebookReady = true;
            }
        );

        $scope.requestPassword = function(email){
            $log.debug("email ",email);
            $scope.signupprogress = true;
            $scope.pwdres = {};

            UserService.reqPassword(email)
                .then(function(data){
                    $scope.signupprogress = false;
                    $scope.pwdres = data;

                },function(err){
                    $scope.signupprogress = false;
                    $rootScope.$broadcast('api_error',err);
                });
        }


        Facebook.getLoginStatus(function(response) {
            $log.debug('checking fb login status');
            $log.debug(response);
            if (response.status == 'connected') {
                $rootScope.fbLoggedIn = true;
                $scope.me();
            }

        });

        $scope.me = function(callback) {
            Facebook.api('/me?fields=name,email,first_name,last_name,picture', function(response) {

                $scope.$apply(function() {
                    $rootScope.fbUser = response;
                    if(callback){
                        callback();
                    }
                });

            });
        };

        $scope.fbLoginApp = function(){
            $log.debug("log into app with facebook credential");
            var fbUser = {
                email: $rootScope.fbUser.email,
                facebookId: $rootScope.fbUser.id,
                firstName : $rootScope.fbUser.first_name,
                lastName : $rootScope.fbUser.last_name
            };
            $scope.signupprogress = true;
            UserService.fbLogin(fbUser).then(function(data){
                $scope.signupprogress = false;

                if(!data.success){
                    $scope.showLoginErr = "Login failed";
                }else{

                    $rootScope.user = data.user;
                    $rootScope.loggedIn = true;

                    if($rootScope.loginRedirect){
                        $state.go($rootScope.loginRedirect);
                    }else{
                        $state.go("home");
                    }

                }
            },function(err){
                $scope.signupprogress = false;
                $rootScope.$broadcast('api_error',err);
            });

        }

      /*  $rootScope.search = function(query){
            $state.go("search",{query: query});
        }*/
}]);


var fnFBLogin = function(){
    //var url='https://www.facebook.com/dialog/oauth?client_id=341307939406976&redirect_uri=http://localhost:3000/api/user/login/facebook/callback';
    var url='http://localhost:3000/api/user/login/facebook'
    //var url = 'http://localhost:3000';
    window.fbLoginWindow = window.open(url,'_blank', 'location=no,height=400,width=800');

    window.fbLoginWindow.addEventListener('loadstart',function(event){
        console.log('load');
    });
    window.fbLoginWindow.addEventListener('exit',function(){
        console.log('exit');
    });
    window.fbLoginWindow.onload =function(){
        console.log('on load');
        window.fbLoginWindow.onbeforeunload = function(){
            //doc.location.reload(true); //will refresh page after popup close
            console.log('before close');
        }
    };
    window.fbLoginWindow.close = function(){
        console.log('on close');
    };
};