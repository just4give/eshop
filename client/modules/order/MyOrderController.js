/**
 * Created by Mithun.Das on 12/7/2015.
 */
appModule.controller("MyOrderController",["$scope","$rootScope","$log","$modal","$state", "$interval","OrderService","toaster","UserCart",
    function($scope,$rootScope,$log,$modal,$state,$interval,OrderService,toaster,UserCart){

        $scope.recordsPerPage = 3;
        $scope.pagination = {current: 1};
        $scope.getSearchName=function(name){
            return name.replace(/\s+/g, '-').toUpperCase();
        }
        $scope.ordSearch ={};
        $scope.getResults = function(currentPage){

            OrderService.query(currentPage,10,$scope.ordSearch)
                .then(function (data) {
                    $scope.orders  = data.rows;
                    $scope.totalRecords = data.count;
                }, function (err) {

                    toaster.pop("error", "", "System error !");
                });

        }


        $scope.getResults($scope.pagination.current);
        /*$scope.reSearch = function(){
            $scope.getResults(1);
        }*/

        $scope.pageChanged = function(newPage) {
            $scope.getResults(newPage);
        };

        $scope.addToCart = function(product){


            var product =angular.copy(product);
            UserCart.addToCart(product);

            toaster.pop({
                type: 'success',
                body: 'added to cart successfully.',
                showCloseButton: true
            });
        }


}]);