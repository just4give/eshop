/**
 * Created by mithundas on 12/3/15.
 */
var appModule = angular.module("eshop",['ui.router','ui.bootstrap','ngAnimate', 'ngTouch','mgcrea.ngStrap','angular-confirm',
    'LocalStorageModule','ngFileUpload','toaster','headroom','viewhead','epilouge.ngService','rzModule','chart.js',
    'angularUtils.directives.dirPagination','smoothScroll','credit-cards','oc.lazyLoad']);

appModule.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('eshop')
        .setStorageType('localStorage') //sessionStorage
        .setNotify(true, true)

});

appModule.run(["$interval","localStorageService","$rootScope", "RzSliderOptions","UserCart",
    function($interval,localStorageService,$rootScope,RzSliderOptions,UserCart ){

       // RzSliderOptions.options( { showTicks: true } );
    $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
        if(rejection === 'not authorized') {
            //Show toast
        }
    })
//create a new instance
    new WOW().init();

    $rootScope.$on('$routeChangeStart', function (next, current) {
        //when the view changes sync wow
        new WOW().sync();
    });

    $rootScope.$on('$stateChangeStart', function (event, toState) {

    });

    $rootScope.$on('$locationChangeSuccess', function(e) {

    });


    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        console.log(toState);
            if(toState.name==='login'){
                $rootScope.showHeader=false;
            }else{
                $rootScope.showHeader=true;
            }
    });

    $rootScope.getImageUrl = function(fileName){
       return  UserCart.getImageUrl(fileName);
    }


}]);

appModule.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;

    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

}
]);


angular.element(document).ready(function() {

});

appModule
    .config(function($tabProvider) {
        angular.extend($tabProvider.defaults, {
            animation: 'am-flip-x'
        });
    });
appModule.config(function($asideProvider) {
    angular.extend($asideProvider.defaults, {
        animation: 'am-fadeAndSlideRight',
        placement: 'right'
    });
})
/*
authorizeCurrentUserForRoute: function(role) {
    if(mvIdentity.isAuthorized(role)) {
        return true;
    } else {
        return $q.reject('not authorized');
    }

}*/
