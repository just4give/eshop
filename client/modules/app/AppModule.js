/**
 * Created by mithundas on 12/3/15.
 */
var appModule = angular.module("photoOrder",['ui.router','ui.bootstrap','ngAnimate', 'ngTouch','mgcrea.ngStrap','angular-confirm',
    'LocalStorageModule','ngFileUpload','facebook','toaster','headroom']);

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

}]);

appModule.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;

    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    console.log('http config...');
}
]);

appModule.config(function(FacebookProvider) {
    // Set your appId through the setAppId method or
    // use the shortcut in the initialize method directly.
    FacebookProvider.init('341307939406976');
    console.log('fb config...');
})

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
