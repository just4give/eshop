/**
 * Created by Mithun.Das on 12/7/2015.
 */
appModule.controller("ConfirmController",["$scope","$rootScope","$log","$modal","$state", "$timeout","$location","UserCart",
    "$stateParams",
    function($scope,$rootScope,$log,$modal,$state,$timeout,$location,UserCart,$stateParams){
        var params= $location.search();
        $scope.ackId= params.id;


    }]);


