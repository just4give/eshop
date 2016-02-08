/**
 * Created by Mithun.Das on 12/4/2015.
 */
appModule.controller("loginController",["$window","$scope","$rootScope","$log","$modal", "$interval","$timeout","$state","UserService","localStorageService","OrderService","Facebook",
    function($window,$scope,$rootScope,$log,$modal,$interval,$timeout,$state,UserService,localStorageService,OrderService,Facebook){

    $log.debug('initializing login controller');
    $log.debug($rootScope.bootstrappedUser);

    $rootScope.apiContext="";
    $scope.signupprogress = false;

    $scope.loginform ={};
    $scope.signupform ={};
    $rootScope.fbLoggedIn = false;
    $rootScope.fbUser = {};

    var modal;

        angular.element(document).ready(function() {
            console.log('document ready inside logib controller...');
            $rootScope.hideAppSpinner = true;
            $timeout(function(){
                $rootScope.appLoaded = true;
                $('header').css('display','block');
                $('nav').css('display','block');
            },2000);

        });
    //check cart
    if( !$rootScope.loggedIn) {
        $rootScope.cartImages = localStorageService.get("cart");
    }
    //check if user cookie is available, if yes, log user in
      /* var userCookie =  localStorageService.cookie.get("app-user");
        if(userCookie && userCookie.uuid){
            $log.debug('user cookie found');
            $log.debug(userCookie);
            $rootScope.state = $rootScope.state || {};
            $rootScope.state.user = userCookie;
            $rootScope.loggedIn = true;
        }*/
     UserService.loggedIn().
         then(function(data){
         if(data.success){
             $rootScope.state = $rootScope.state || {};
             $rootScope.state.user = data.user;
             $rootScope.loggedIn = true;
         }else{
             $rootScope.loggedIn = false;
             if($rootScope.state){
                 $rootScope.state.user = undefined;
             }

         }
     },function(err){
         $rootScope.$broadcast('api_error',err);
     })

    $scope.openLoginPopup = function(){
        $log.debug('opening login modal');
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
            $log.debug('login response');
            $log.debug(data);

            if(!data.success){
                $scope.showLoginErr = "Login failed";
            }else{
                if(!$rootScope.state){
                    $rootScope.state ={};
                }
                $rootScope.state.user = data.user;
                $rootScope.loggedIn = true;
                $scope.setUserCookie(data.user);

                if(modal){
                    modal.hide();
                }

                //if cart is not empty , persist cart and remove from local storage
                if( $rootScope.cartImages &&  $rootScope.cartImages.length>0){
                    OrderService.saveCart($rootScope.cartImages)
                        .then(function(data){
                            $log.debug('cart saved...');
                            $log.debug(data);
                            localStorageService.remove("cart");
                            $rootScope.retrieveCart();


                        },function(err){
                            $log.debug('erro saving cart...');
                            $rootScope.$broadcast('api_error',err);
                        });
                }else{
                    $log.debug('get cart');
                    $rootScope.retrieveCart();
                }
                //then fetch call cart details
            }
        },function(err){
            $scope.signupprogress = false;
            $rootScope.$broadcast('api_error',err);
        });


    }
    $scope.checkout = function(){
      $state.go('cart');
    }

    $rootScope.retrieveCart = function(){
        OrderService.getCart()
            .then(function(data){
               // $rootScope.cartImages =data;
                $rootScope.cartImages =[];
                angular.forEach(data, function(item){
                    $rootScope.cartImages.push({id:item.id, imgId:item.imgId, imgSrc:item.imgSrc, quantity: item.quantity, format: {frameSize: item.frameSize, price: item.price},paperFinish:item.paperFinish,
                        userId:item.userId});
                })


            },function(err){
                $rootScope.$broadcast('api_error',err);
            });
    }

    $scope.logout = function(){

        UserService.logout().then(function(data){
            $rootScope.loggedIn = false;
            $rootScope.state.user=undefined;
            $rootScope.cartImages=[];
            localStorageService.remove("cart");
            localStorageService.cookie.remove("app-user");
            $state.go('/');
        },function(err){

        });

    }
    $scope.setUserCookie=function(data){
        localStorageService.cookie.set("app-user",data,1);
    }
    $scope.register = function(){
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
            if(data.errorCode){
                $scope.showSignupErr = data.errorMessage;
            }else{
                if(!$rootScope.state){
                    $rootScope.state ={};
                }
                $rootScope.state.user = data;
                $rootScope.loggedIn = true;
                $scope.setUserCookie(data);
                if(modal){
                    modal.hide();
                }
            }
        },function(err){
            $scope.signupprogress = false;
            $rootScope.$broadcast('api_error',err);
        });

    }


    //FB login /reg stuffs starts here
        $scope.$watch(
            function() {
                return Facebook.isReady();
            },
            function(newVal) {
                if (newVal)
                    $scope.facebookReady = true;
            }
        );

        Facebook.getLoginStatus(function(response) {
            $log.debug('checking fb login status');
            $log.debug(response);
            if (response.status == 'connected') {
                $rootScope.fbLoggedIn = true;
                $scope.me();
            }

        });

        $scope.fbRegister = function(){

            if(!$rootScope.fbLoggedIn){
                Facebook.login(function(response) {
                    $log.debug(response);
                    if (response.status == 'connected') {
                        $rootScope.fbLoggedIn = true;
                        $scope.me( $scope.fbRegisterOpenModal);

                    }

                });
            }else{

                $scope.fbRegisterOpenModal();
            }

        }

        var fbRegModal ;
        $scope.fbRegisterOpenModal = function(){

            fbRegModal = $modal({scope: $scope, templateUrl: 'modules/common/tmpl/modal/fb-reg-modal.html', show: true});
        }
        $scope.fbRegisterAppConfirm = function(){

            if(!$rootScope.fbUser.first_name || !$rootScope.fbUser.last_name || !$rootScope.fbUser.email || ! $rootScope.fbUser.id ){
                $scope.fbShowSignupErr = 'Please provide data for all the fields.';
                $scope.signupprogress = false;
                return;
            }

            var fbUser = {
                firstName: $rootScope.fbUser.first_name,
                lastName: $rootScope.fbUser.last_name,
                email: $rootScope.fbUser.email,
                facebookId: $rootScope.fbUser.id
            };
            UserService.fbRegister(fbUser).then(function(data){
                $scope.signupprogress = false;
                if(data.errorCode){
                    $scope.showSignupErr = data.errorMessage;
                }else{
                    if(!$rootScope.state){
                        $rootScope.state ={};
                    }
                    $rootScope.state.user = data;
                    $rootScope.loggedIn = true;
                    $scope.setUserCookie(data);
                    if(modal){
                        modal.hide();
                    }
                    if(fbRegModal){
                        fbRegModal.hide();
                    }
                }
            },function(err){
                $scope.signupprogress = false;
                $rootScope.$broadcast('api_error',err);
            });


        }
        $scope.fbLogin = function() {
            //alert('fb login called' + $state.current.name);
            localStorageService.cookie.set("ui-state",$state.current.name,1);

            $window.location.href='http://localhost:3000/api/user/login/facebook';
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

        };


        $scope.fbLoginApp = function(){
            $scope.showLoginErr ='';
            $scope.signupprogress = true;



            if(!$rootScope.fbUser.email || !$rootScope.fbUser.id ){
                $scope.showLoginErr = 'Something went wrong with facebook login.';
                $scope.signupprogress = false;
                return;
            }


            var fbUser = {
                email: $rootScope.fbUser.email,
                facebookId: $rootScope.fbUser.id
            };

/*            UserService.fbLogin(fbUser).then(function(data){
                $scope.signupprogress = false;
                $log.debug(data);

                if(data.errorCode){
                    $scope.showLoginErr = data.errorMessage;
                }else{
                    if(!$rootScope.state){
                        $rootScope.state ={};
                    }
                    $rootScope.state.user = data;
                    $rootScope.loggedIn = true;
                    $scope.setUserCookie(data);
                    if(modal){
                        modal.hide();
                    }

                    //if cart is not empty , persist cart and remove from local storage
                    if( $rootScope.cartImages &&  $rootScope.cartImages.length>0){
                        OrderService.saveCart($rootScope.cartImages)
                            .then(function(data){
                                $log.debug('cart saved...');
                                $log.debug(data);
                                localStorageService.remove("cart");
                                $rootScope.retrieveCart();


                            },function(err){
                                $log.debug('erro saving cart...');
                                $rootScope.$broadcast('api_error',err);
                            });
                    }else{
                        $log.debug('get cart');
                        $rootScope.retrieveCart();
                    }
                    //then fetch call cart details
                }
            },function(err){
                $scope.signupprogress = false;
                $rootScope.$broadcast('api_error',err);
            });*/
        }

        $scope.me = function(callback) {
            Facebook.api('/me', function(response) {
                /**
                 * Using $scope.$apply since this happens outside angular framework.
                 */

                $scope.$apply(function() {
                    $rootScope.fbUser = response;
                    if(callback){
                        callback();
                    }
                });

            });
        };
       /* $scope.logout = function() {
            Facebook.logout(function() {
                $scope.$apply(function() {
                    $scope.user   = {};
                    $scope.logged = false;
                });
            });
        }*/

        $rootScope.search = function(query){
            $state.go("search",{query: query});
        }
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