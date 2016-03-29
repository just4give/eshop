/**
 * Created by Mithun.Das on 12/4/2015.
 */
appModule.controller("ProfileController",["$scope","$rootScope","$log","$modal","$state", "$interval","UserService","toaster",
    function($scope,$rootScope,$log,$modal,$state,$interval,UserService,toaster){

    $scope.profile = angular.copy($rootScope.user);
    $scope.pwdchng=false;

    if($scope.profile.facebookId){
        $log.debug("found facebookId ",$scope.profile.facebookId);
        $log.debug("fb user ", $rootScope.fbUser);
        if($rootScope.fbUser && $rootScope.fbUser.id===$scope.profile.facebookId && $rootScope.fbUser.picture && $rootScope.fbUser.picture.data){
            $scope.profile.picture = $rootScope.fbUser.picture.data.url;
        }
    }

    $scope.changePassword = function(){
        UserService.changePassword($scope.profile.password)
            .then(function(data){
                if(data.success){
                    toaster.pop("info","", data.message);
                    $scope.pwdchng=false;
                }
            },function(err){
                $log.debug(err);
                toaster.pop("error","", "Could not update password");
            })
    }

}]);

appModule.directive('passwordMatch', ["$log",function ($log) {


    return {
        restrict: 'A',
        scope:true,
        require: 'ngModel',
        link: function (scope, elem , attrs,control) {

            var checker = function () {

                //get the value of the first password
                var e1 = scope.$eval(attrs.ngModel);

                //get the value of the other password
                var e2 = scope.$eval(attrs.passwordMatch);
                if(e2!=null)
                    return e1 == e2;
            };
            scope.$watch(checker, function (n) {

                //set the form control to valid if both
                //passwords are the same, else invalid
                $log.debug('is password matching '+ n);
                if(n != undefined){
                    control.$setValidity("passwordNoMatch", n);
                }

            });
        }
    };
}]);