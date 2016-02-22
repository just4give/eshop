/**
 * Created by mithundas on 12/3/15.
 */
var appModule = angular.module("photoOrder",['ui.router','ui.bootstrap','ngAnimate', 'ngTouch','mgcrea.ngStrap','angular-confirm',
    'LocalStorageModule','ngFileUpload','toaster','headroom','viewhead']);

appModule.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('photoOrder')
        .setStorageType('localStorage') //sessionStorage
        .setNotify(true, true)
    console.log('storage config...');
});

appModule.run(["$interval","localStorageService","$rootScope", function($interval,localStorageService,$rootScope){
    console.log('angular run...');
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
        console.log('$stateChangeStart');
        console.log(toState);
    });

    $rootScope.$on('$locationChangeSuccess', function(e) {
        console.log('$locationChangeSuccess');
    });


    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        console.log(event);
        console.log(toState);
    });


}]);

appModule.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;

    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    console.log('http config...');
}
]);


angular.element(document).ready(function() {
    console.log('document ready...');
});

appModule
    .config(function($tabProvider) {
        angular.extend($tabProvider.defaults, {
            animation: 'am-flip-x'
        });
    });

/*
authorizeCurrentUserForRoute: function(role) {
    if(mvIdentity.isAuthorized(role)) {
        return true;
    } else {
        return $q.reject('not authorized');
    }

}*/
