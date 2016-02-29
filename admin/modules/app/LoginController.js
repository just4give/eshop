/**
 * Created by Mithun.Das on 12/4/2015.
 */
admin.controller("LoginController",["$scope","$rootScope","$log","$modal","$state", "toaster",
    function($scope,$rootScope,$log,$modal,$state,toaster){

    $scope.loginform = {};


    $scope.submitLogin = function(){
        $rootScope.loggedIn = true;
        $state.go('home.dashboard');

    }

    $scope.logout =function(){



    }

}]);