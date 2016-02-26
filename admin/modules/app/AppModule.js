/**
 * Created by mithundas on 12/3/15.
 */
var admin = angular.module("admin",['ui.router','ui.bootstrap','ngAnimate', 'ngTouch','mgcrea.ngStrap','angular-confirm',
    'LocalStorageModule','ngFileUpload','toaster','viewhead','chart.js']);


admin.run(["$interval","localStorageService","$rootScope", function($interval,localStorageService,$rootScope){

    $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
        if(rejection === 'not authorized') {
            //Show toast
        }
    })



}]);


