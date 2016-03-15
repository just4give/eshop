/**
 * Created by Mithun.Das on 12/7/2015.
 */
appModule.controller("CartController",["$scope","$rootScope","$log","$modal","$state", "$timeout","$confirm","UserCart",
    function($scope,$rootScope,$log,$modal,$state,$timeout,$confirm,UserCart){

    $log.debug('initializing CheckoutController');

    $scope.totalProductPrice = 0;







    $scope.orderprogress=false;
    $scope.placeOrder = function(){
        $scope.modalErrorMessage ='';

        var noOfPrints =0;


        if(noOfPrints <=0){
            $scope.modalErrorMessage ='Your cart is empty.';
            $modal({scope: $scope, templateUrl: 'modules/common/tmpl/modal/api-error-modal.html', show: true});
            return;
        }


        $confirm({text: 'By clicking "I Confirm" , you will finalize your order.' ,ok:"I Confirm",cancel:"Cancel" , title:"Confirm your order"})
            .then(function() {

            });
    }

    $scope.getTotalProductPrice = function(){

        $scope.totalProductPrice = 0;
        angular.forEach($scope.cart, function(item){
            if(item.product){
                $scope.totalProductPrice+= item.product.price* item.quantity;
            }

        })
        return $scope.totalProductPrice;
    };

    $scope.deleteCartItem = function(item){

        $confirm({text: 'You are removing this item from cart.' ,ok:"Yes,delete",cancel:"Don't" , title:"Confirm delete"},{templateUrl : 'modules/checkout/tmpl/modal/cart-delete-confirm-modal.html'})
            .then(function() {
                UserCart.deleteCart(item);

            });


    }

    $scope.checkme = function(){
        $timeout(function(){
            $log.debug("setting indicator false");
            $scope.pIndicator=false;
        },3000);
    }


    $scope.increaseItemQuantity = function(selectedCartItem){
        UserCart.increaseQ(selectedCartItem);
    }

    $scope.decreaseeItemQuantity = function(selectedCartItem){
        UserCart.decreaseQ(selectedCartItem);

    }

    $scope.checkout = function(){
        $state.go("checkout");
    }


    }]);

appModule.run(function($confirmModalDefaults) {
    $confirmModalDefaults.templateUrl = 'modules/checkout/tmpl/modal/order-confirm-modal.html';
    $confirmModalDefaults.defaultLabels.title = 'Modal Title';
    $confirmModalDefaults.defaultLabels.ok = 'Yes';
    $confirmModalDefaults.defaultLabels.cancel = 'No';
})
