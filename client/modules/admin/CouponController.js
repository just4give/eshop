/**
 * Created by Mithun.Das on 12/4/2015.
 */
appModule.controller("CouponController",["$scope","$rootScope","$log","$modal","$state", "toaster","Coupon","$confirm",
    function($scope,$rootScope,$log,$modal,$state,toaster,Coupon,$confirm){

    $scope.sortKey ="name";
    $scope.reverse =true;


    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    Coupon.query(function(data){
        $scope.records = data;
    })

    $scope.edit = function(id){
        $state.go("admin.coupon-detail",{id:id});
    }
    $scope.create = function(){
        $state.go("admin.coupon-detail",{id:-1});
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

appModule.controller("CouponDetailsController",["$scope","$rootScope","$log","$modal","$state", "toaster","$stateParams","Coupon","$confirm",
    function($scope,$rootScope,$log,$modal,$state,toaster,$stateParams,Coupon,$confirm){

        $scope.types=[{code:"amt", description:"Amount"},{code:"pct", description:"Percentage"}];

        $scope.dateOptions = {
            //dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2025, 1, 1),
            minDate: new Date(),
            startingDay: 1
        };
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }
        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };
        $scope.popup2 = {
            opened: false
        };

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };
        $scope.popup1 = {
            opened: false
        };


        if($stateParams.id >0){
            Coupon.get({id:$stateParams.id},function(data){
                $scope.coupon= data;
                $scope.coupon.validFrom = Date.parse( $scope.coupon.validFrom);
                $scope.coupon.validThrough = Date.parse( $scope.coupon.validThrough);
            })
        }else{
            $scope.coupon = new Coupon();
            var today = new Date();
            $scope.coupon.validFrom = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            $scope.coupon.validThrough = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        }

        $scope.save = function(){

            if($scope.coupon.id){
                $scope.coupon.$update(function(data){
                    $log.debug(data);
                    toaster.pop("info","","Coupon details updated");

                    $state.go("admin.coupons");
                })

            }else{
                $scope.coupon.$save(function(data){
                    $log.debug(data);
                    toaster.pop("info","","Coupon details created");

                    $state.go("admin.coupons");
                })
            }

        }



    }]);