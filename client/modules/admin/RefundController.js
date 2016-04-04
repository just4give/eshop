/**
 * Created by Mithun.Das on 12/4/2015.
 */
appModule.controller("RefundController",["$scope","$rootScope","$log","$modal","$state", "toaster","Refund","$confirm",
    function($scope,$rootScope,$log,$modal,$state,toaster,Refund,$confirm){

    $scope.sortKey ="name";
    $scope.reverse =true;


    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    Refund.query(function(data){
        $scope.records = data;
    })

    $scope.edit = function(id){
        $state.go("admin.refund-detail",{id:id});
    }
    $scope.create = function(){

    }


}]);

appModule.controller("RefundDetailsController",["$scope","$rootScope","$log","$modal","$state", "toaster",
    "$stateParams","Refund","$confirm","Cart","UserPayment",
    function($scope,$rootScope,$log,$modal,$state,toaster,$stateParams,Refund,$confirm,Cart,UserPayment){



        if($stateParams.id >0){
            Refund.get({id:$stateParams.id},function(data){
                $scope.refund= data;
            })
        }else{
            $scope.refund = new Refund();
        }

        /*$scope.saveTax = function(){

            if($scope.refund.id){
                $scope.refund.$update(function(data){
                    $log.debug(data);
                    toaster.pop("info","","Tax details updated");

                    $state.go("admin.refunds");
                })

            }else{
                $scope.refund.$save(function(data){
                    $log.debug(data);
                    toaster.pop("info","","Refund details created");

                    $state.go("admin.refunds");
                })
            }

        }*/

        $scope.processRefund = function(){
            UserPayment.processRefund($scope.refund.id, $scope.refund.refundAmnt)
                .then(function(data){
                    if(data.success){
                        toaster.pop("info","","Refund processed ...");
                        $state.go("admin.refunds");
                    }else{
                        toaster.pop("error","",data.message);
                    }

                },function(err){
                    toaster.pop("error","",err.message);
                })
        }



    }]);