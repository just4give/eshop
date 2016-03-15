/**
 * Created by Mithun.Das on 12/4/2015.
 */
appModule.controller("DashboardController",["$scope","$rootScope","$log","$modal","$state", "toaster",
    function($scope,$rootScope,$log,$modal,$state,toaster){

        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.series = ['2015', '2016'];
        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
        $scope.labelspie = ["Apple iPad", "Samsung Galaxy S5", "Apple iPhone"];
        $scope.datapie = [300, 500, 100];

}]);