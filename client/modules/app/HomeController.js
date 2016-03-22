/**
 * Created by Mithun.Das on 12/4/2015.
 */
appModule.controller("HomeController",["$scope","$rootScope","$log","$modal","$state", "$interval","$timeout","$state","localStorageService","Categories",
    function($scope,$rootScope,$log,$modal,$state,$interval,$timeout,$state,localStorageService,Categories){


    $log.debug('home controller');
    $log.debug($state.params);

    $scope.callback =  $state.params.callback;

    if($scope.callback ==='fb'){
        $state.go(localStorageService.cookie.get("ui-state"));

    }


}]);