/**
 * Created by Mithun.Das on 12/7/2015.
 */
appModule.controller("MyOrderController",["$scope","$rootScope","$log","$modal","$state", "$interval","OrderService",
    "toaster","UserCart","OrderTracking",
    function($scope,$rootScope,$log,$modal,$state,$interval,OrderService,toaster,UserCart,OrderTracking){

        $scope.recordsPerPage = 3;
        $scope.pagination = {current: 1};
        $scope.getSearchName=function(name){
            return name.replace(/\s+/g, '-').toUpperCase();
        }
        $scope.ordSearch ={};
        $scope.getResults = function(currentPage){

            OrderService.query(currentPage,$scope.recordsPerPage,'user',$scope.ordSearch)
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

        $scope.returnItem = function(orderIndex,cartIndex, type){
            $log.debug("order index ",orderIndex," cart index ", cartIndex);
            var order = $scope.orders[orderIndex];
            var cart = order.carts[cartIndex];
            OrderService.requestReturn(cart.id,type)
                .then(function(data){
                    if(data.success){
                        order.carts[cartIndex] = data.cart;
                        toaster.pop("info", "", data.message);
                    }else{
                        toaster.pop("error", "", data.message);
                    }
                },function(err){
                    toaster.pop("error", "", "System error !");
                })
        }

        $scope.showTracking = function(order){
            $scope.tracking = undefined;

            OrderTracking.query({orderId:order.id},function(data){
                if( Array.isArray(data) && data.length >0){
                    $scope.tracking  = data[0];
                    $log.debug($scope.tracking);
                }
            })
        }


}]);