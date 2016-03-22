/**
 * Created by Mithun.Das on 12/4/2015.
 */
appModule.controller("ShippingController",["$scope","$rootScope","$log","$modal","$state", "toaster","Shipping","$confirm",
    function($scope,$rootScope,$log,$modal,$state,toaster,Shipping,$confirm){

    $scope.sortKey ="name";
    $scope.reverse =true;


    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    Shipping.query(function(data){
        $scope.records = data;
    })

    $scope.edit = function(id){
        $state.go("admin.shipping-detail",{id:id});
    }
    $scope.create = function(){
        $state.go("admin.shipping-detail",{id:-1});
    }
    $scope.delete = function(r){
        $confirm({text: 'You are going to delete the record.' ,ok:"Yes,delete",cancel:"Cancel" , title:"Delete?"})
            .then(function() {
                var index = _.findIndex($scope.records, r);
                r.$delete(function(data){
                    $scope.records.splice(index,1);
                    toaster.pop("info","","Record deleted");
                });
            });
    }

}]);

appModule.controller("ShippingDetailsController",["$scope","$rootScope","$log","$modal","$state", "toaster","$stateParams","Shipping","$confirm",
    function($scope,$rootScope,$log,$modal,$state,toaster,$stateParams,Shipping,$confirm){



        if($stateParams.id >0){
            Shipping.get({id:$stateParams.id},function(data){
                $scope.shipping= data;
            })
        }else{
            $scope.shipping = new Shipping();
        }

        $scope.save = function(){

            if($scope.shipping.id){
                $scope.shipping.$update(function(data){
                    $log.debug(data);
                    toaster.pop("info","","Shipping details updated");

                    $state.go("admin.shippings");
                })

            }else{
                $scope.shipping.$save(function(data){
                    $log.debug(data);
                    toaster.pop("info","","Shipping details created");

                    $state.go("admin.shippings");
                })
            }

        }



    }]);