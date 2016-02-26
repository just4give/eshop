/**
 * Created by Mithun.Das on 12/4/2015.
 */
admin.controller("LoginController",["$scope","$rootScope","$log","$modal","$state", "toaster",
    function($scope,$rootScope,$log,$modal,$state,toaster){

    $scope.loginform = {};


    $scope.submitLogin = function(){

        $state.go('dashboard');

    }

    $scope.logout =function(){



    }

}]);