/**
 * Created by Mithun.Das on 12/4/2015.
 */
appModule.controller("HomeController",["$scope","$rootScope","$log","$modal","$state", "$interval","$timeout","$state","localStorageService",
    function($scope,$rootScope,$log,$modal,$state,$interval,$timeout,$state,localStorageService){


    $log.debug('home controller');
    $log.debug($state.params);

    $scope.callback =  $state.params.callback;

    if($scope.callback ==='fb'){
        $state.go(localStorageService.cookie.get("ui-state"));

    }
    $interval(function(){
        $(".left-ads").addClass("flash animated ");

        $timeout(function(){
            $(".left-ads").removeClass("flash animated ");
        },1000);

    },5000);


    $scope.animateProcess = function(){

        angular.element("#process-list li").addClass('bounce-in-up');
    }
    $scope.animateDiscount = function(){

            angular.element("#discount-list li").addClass('bounce-in-up');
    }

}]);