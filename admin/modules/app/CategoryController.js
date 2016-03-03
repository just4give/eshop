/**
 * Created by Mithun.Das on 12/4/2015.
 */
admin.controller("CategoryController",["$scope","$rootScope","$log","$modal","$state", "toaster","Category","$confirm",
    function($scope,$rootScope,$log,$modal,$state,toaster,Category,$confirm){

    $scope.sortKey ="name";
    $scope.reverse =true;


    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    Category.query(function(data){
        $scope.records = data;
    })

    $scope.edit = function(id){
        $state.go("home.category-detail",{id:id});
    }
    $scope.create = function(){
        $state.go("home.category-detail",{id:-1});
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

admin.controller("CategoryDetailsController",["$scope","$rootScope","$log","$modal","$state", "toaster","$stateParams","Category","$confirm",
    function($scope,$rootScope,$log,$modal,$state,toaster,$stateParams,Category,$confirm){



        if($stateParams.id >0){
            Category.get({id:$stateParams.id},function(data){
                $scope.category= data;
            })
        }else{
            $scope.category = new Category();
        }

        $scope.save = function(){

            if($scope.category.id){
                $scope.category.$update(function(data){
                    $log.debug(data);
                    toaster.pop("info","","Category details updated");

                    $state.go("home.categories");
                })

            }else{
                $scope.category.$save(function(data){
                    $log.debug(data);
                    toaster.pop("info","","Category details created");

                    $state.go("home.categories");
                })
            }

        }



    }]);