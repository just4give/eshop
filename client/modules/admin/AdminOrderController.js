/**
 * Created by Mithun.Das on 12/7/2015.
 */
appModule.controller("AdminOrderController",["$scope","$rootScope","$log","$modal","$state", "$interval","OrderService","toaster",
    "UserCart","OrderStatus","OrderTracking",
    function($scope,$rootScope,$log,$modal,$state,$interval,OrderService,toaster,UserCart,OrderStatus,OrderTracking){

        $scope.recordsPerPage = 5;
        $scope.pagination = {current: 1};

        $scope.ordSearch ={};
        $scope.getResults = function(currentPage){

            OrderService.query(currentPage,$scope.recordsPerPage,'admin',$scope.ordSearch)
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

        OrderStatus.query({active:true},function(data){
            $scope.ordStats = data;
        })

        $scope.changeStatus = function(data,order){
            $log.debug(data);
            $scope.tobeStatus = data;
            $scope.selectedOrder = order;
            if(data.code === 'shipped'){
                $modal({scope: $scope, templateUrl: 'modules/admin/tmpl/order-status-modal.html', show: true});
                return false;
            }else{

                OrderService.updateStatus($scope.selectedOrder.id, $scope.tobeStatus.id)
                    .then(function(data){

                        $log.debug("order updated ", data);

                        if(data.success){
                            var indx =  _.findIndex($scope.orders,{id:data.order.id});
                            $scope.orders[indx] = data.order;
                            toaster.pop("info", "", "Status updated successfully");
                            return true;
                        }else{
                            toaster.pop("error", "", data.message);
                        }

                    },function(err){
                        toaster.pop("error", "", "System error !");
                    });

            }

        }
        $scope.updateShipping = function(){
            var tracking = new OrderTracking();
            tracking.carrier = $scope.selectedOrder.carrier;
            tracking.trackingNumber = $scope.selectedOrder.trackingNumber;
            tracking.orderId = $scope.selectedOrder.id;

            tracking.$save(function(data){
                //now update order status
                OrderService.updateStatus($scope.selectedOrder.id, $scope.tobeStatus.id)
                    .then(function(data){
                        $log.debug("order updated ", data);
                        var indx =  _.findIndex($scope.orders,{id:data.id});
                        $scope.orders[indx] = data;
                        toaster.pop("info", "", "Status updated successfully");
                    },function(err){
                        toaster.pop("error", "", "System error !");
                    })
            })

           // $scope.selectedOrder.orderStatus =  $scope.tobeStatus;
        }

        $scope.showTracking = function(index){
            OrderTracking.query({orderId: $scope.orders[index].id},function(data){
                $log.debug("tracking infor ", data);
                if(data.length>0){
                    $scope.orders[index].orderTracking = data[0];
                }else{
                    toaster.pop("info", "", "No tracking information found!");
                }
            })
        }

        $scope.carriers =[{code:"fedex",label:"Fedex"},
            {code:"ups",label:"UPS"},
            {code:"fedex",label:"Fedex"}];

}]);