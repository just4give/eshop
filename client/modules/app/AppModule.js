/**
 * Created by mithundas on 12/3/15.
 */
var appModule = angular.module("eshop",['ui.router','ui.bootstrap','ngAnimate', 'ngTouch','mgcrea.ngStrap','angular-confirm',
    'LocalStorageModule','ngFileUpload','toaster','headroom','viewhead','epilouge.ngService','rzModule','chart.js',
    'angularUtils.directives.dirPagination','smoothScroll','credit-cards','oc.lazyLoad','facebook','xeditable']);

appModule.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('eshop')
        .setStorageType('localStorage') //sessionStorage
        .setNotify(true, true);


});

appModule.run(["$interval","localStorageService","$rootScope", "RzSliderOptions","UserCart","$state","editableOptions",
    function($interval,localStorageService,$rootScope,RzSliderOptions,UserCart,$state ,editableOptions){

        editableOptions.theme = 'bs3';

        $rootScope.pspinner =false;

       // RzSliderOptions.options( { showTicks: true } );
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, rejection) {


            if(rejection === 'not authorized') {
                $state.go('login');
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
                $rootScope.showHeader=true;
                $rootScope.loginRedirect=fromState.name;
            }else{
                $rootScope.showHeader=true;
                $rootScope.loginRedirect= undefined;
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

appModule.config(function(FacebookProvider) {
    // Set your appId through the setAppId method or
    // use the shortcut in the initialize method directly.
    FacebookProvider.init('341307939406976');

})
/*
authorizeCurrentUserForRoute: function(role) {
    if(mvIdentity.isAuthorized(role)) {
        return true;
    } else {
        return $q.reject('not authorized');
    }

}*/
