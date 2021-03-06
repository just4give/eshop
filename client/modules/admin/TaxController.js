/**
 * Created by Mithun.Das on 12/4/2015.
 */
appModule.controller("TaxController",["$scope","$rootScope","$log","$modal","$state", "toaster","Tax","$confirm",
    function($scope,$rootScope,$log,$modal,$state,toaster,Tax,$confirm){

    $scope.sortKey ="name";
    $scope.reverse =true;


    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    Tax.query(function(data){
        $scope.records = data;
    })

    $scope.edit = function(id){
        $state.go("admin.tax-detail",{id:id});
    }
    $scope.create = function(){
        $state.go("admin.tax-detail",{id:-1});
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
        $rootScope.pspinner=true;
         var index = _.findIndex($scope.records, r);
        r.active = !r.active;
        r.$update(function(data){
            $scope.records[index]=data;
            toaster.pop("info","","Status updated");
            $rootScope.pspinner=false;

        });

    }
}]);

appModule.controller("TaxDetailsController",["$scope","$rootScope","$log","$modal","$state", "toaster","$stateParams","Tax","$confirm",
    function($scope,$rootScope,$log,$modal,$state,toaster,$stateParams,Tax,$confirm){



        if($stateParams.id >0){
            Tax.get({id:$stateParams.id},function(data){
                $scope.tax= data;
            })
        }else{
            $scope.tax = new Tax();
        }

        $scope.saveTax = function(){

            if($scope.tax.id){
                $scope.tax.$update(function(data){
                    $log.debug(data);
                    toaster.pop("info","","Tax details updated");

                    $state.go("admin.taxes");
                })

            }else{
                $scope.tax.$save(function(data){
                    $log.debug(data);
                    toaster.pop("info","","Tax details created");

                    $state.go("admin.taxes");
                })
            }

        }



    }]);