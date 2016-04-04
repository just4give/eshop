/**
 * Created by Mithun.Das on 12/4/2015.
 */
appModule.controller("MerchandiseController",["$scope","$rootScope","$log","$modal","$state", "toaster","Merchandise","$confirm",
    function($scope,$rootScope,$log,$modal,$state,toaster,Merchandise,$confirm){

    $scope.sortKey ="name";
    $scope.reverse =true;


    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    Merchandise.query(function(data){
        $scope.records = data;
    })

    $scope.edit = function(id){
        $state.go("admin.merchandise-detail",{id:id});
    }
    $scope.create = function(){
        $state.go("admin.merchandise-detail",{id:-1});
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
    $scope.toggleStatus = function(r){

        var index = _.findIndex($scope.records, r);
        r.active = !r.active;
        r.$update(function(data){
            $scope.records[index]=data;
            toaster.pop("info","","Status updated");
        });

    }

}]);

appModule.controller("MerchandiseDetailsController",["$scope","$rootScope","$log","$modal","$state", "toaster","$stateParams","Merchandise","$confirm",
    function($scope,$rootScope,$log,$modal,$state,toaster,$stateParams,Merchandise,$confirm){



        if($stateParams.id >0){
            Merchandise.get({id:$stateParams.id},function(data){
                $scope.merchandise= data;
            })
        }else{
            $scope.merchandise = new Merchandise();
        }

        $scope.save = function(){

            if($scope.merchandise.id){
                $scope.merchandise.$update(function(data){
                    $log.debug(data);
                    toaster.pop("info","","Merchandise details updated");

                    $state.go("admin.merchandises");
                })

            }else{
                $scope.merchandise.$save(function(data){
                    $log.debug(data);
                    toaster.pop("info","","Merchandise details created");

                    $state.go("admin.merchandises");
                })
            }

        }



    }]);