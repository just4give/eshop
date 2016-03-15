/**
 * Created by Mithun.Das on 12/7/2015.
 */
appModule.controller("CheckoutController",["$scope","$rootScope","$log","$modal","$state", "$interval","$confirm",
    "OrderService","PhotoService","$location", "UserPayment","$window",
    function($scope,$rootScope,$log,$modal,$state,$interval,$confirm,OrderService,PhotoService,$location,UserPayment,$window){

    $log.debug('initializing CheckoutController');
    $scope.step ="shipping";
    $scope.order = {};

    $scope.card = {
        samebilling: 'yes'
    }

    $scope.changeStep = function(nextStep){
        $scope.step = nextStep;
    }

    $scope.shiipingSelected=function(){

    }
    $scope.openAddressPopup = function(mode){

        $scope.address ={};
        var modal = $modal({scope: $scope, templateUrl: 'modules/checkout/tmpl/modal/address-modal.html', show: true});
    }
    $scope.payWithPayPal=function(){
        $scope.paymentMethod='paypal';
    }
    $scope.payWithCreditCard=function(){
        $scope.paymentMethod='credit_card';
    }
    $scope.makePurchase = function(){
       // var pgModal = $modal({scope: $scope, templateUrl: 'modules/checkout/tmpl/modal/order-progress-modal.html', show: true});
        $scope.orderPgIndc = true;
        $scope.order.paymentMethod = $scope.paymentMethod;
        if($scope.paymentMethod !== 'paypal'){
            $scope.order.card = $scope.card;
        }
        UserPayment.purchase($scope.order)
            .then(function(data){
                $log.debug("Payment successful ",data);

                $scope.orderPgIndc = false;
                if(data.method==='paypal'){
                    $window.location.href=data.redirectUrl;
                }else{
                    $state.go("confirm", {id: data.paymentId});
                }

            },function(err){
                $scope.orderPgIndc = false;
            })
    }


}]);


