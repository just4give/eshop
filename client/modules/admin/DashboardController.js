/**
 * Created by Mithun.Das on 12/4/2015.
 */
appModule.controller("DashboardController",["$scope","$rootScope","$log","$modal","$state", "toaster","Dashboard","$filter",
    function($scope,$rootScope,$log,$modal,$state,toaster,Dashboard,$filter){

        $log.debug(Dashboard);

        //prepare report data
        $scope.linechartoptions = {
            scaleLabel: function(label) {
                    $log.debug('calling label');
                   return  $filter('currency')(label.value);
                },
           tooltipTemplate: function (data){
               return   data.label + ":"+ $filter('currency')(data.value);
           }
        };
        $scope.piechartoptions = {

            tooltipTemplate: function (data){
                return   data.label + ": Sold Qty "+ data.value;
            }
        };
        $scope.series =["Last 10 Days Sale"];
        $scope.labels=[];
        $scope.data =[];
        if(Dashboard.data.sales){
            var innerData =[];
            angular.forEach(Dashboard.data.sales, function(sale){
                $scope.labels.push(sale.day);
                innerData.push(sale.cost);
            })
            $scope.data.push(innerData);


        }
        if(Dashboard.data.productSales){
            $scope.labelspie = [];
            $scope.datapie = [];

            angular.forEach(Dashboard.data.productSales, function(pSale){
                $scope.labelspie.push(pSale.name);
                $scope.datapie.push(pSale.quantity);
            })
        }

        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };


}]);