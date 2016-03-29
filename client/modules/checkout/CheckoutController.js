/**
 * Created by Mithun.Das on 12/7/2015.
 */
appModule.controller("CheckoutController",["$scope","$rootScope","$log","$modal","$state", "$interval","$confirm",
    "OrderService","PhotoService","$location", "UserPayment","$window","Shipping","Address","toaster",
    function($scope,$rootScope,$log,$modal,$state,$interval,$confirm,OrderService,PhotoService,$location,UserPayment,$window,Shipping,
             Address,toaster){

    $log.debug('initializing CheckoutController');
    $scope.step ="shipping";
    $scope.order = {};
    $scope.order.discount=0;

    $scope.months = [
        {label:'01-Jan', value:1},
        {label:'02-Feb', value:2},
        {label:'03-Mar', value:3},
        {label:'04-Apr', value:4},
        {label:'05-May', value:5},
        {label:'06-Jun', value:6},
        {label:'07-Jul', value:7},
        {label:'08-Aug', value:8},
        {label:'09-Sep', value:9},
        {label:'10-Oct', value:10},
        {label:'11-Nov', value:11},
        {label:'12-Dec', value:12}]    ;
    $scope.years =[2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];
    //get all active shipping methods
    Shipping.query({active:true},function(data){
            $scope.shippings = data;
    });

    Address.query({active:true},function(data){
        $scope.addresses = data;
    });

    $scope.card = {
        samebilling: 'yes'
    }


    //calculate tax

    UserPayment.calcTax()
            .then(function(data){
                $scope.order.tax = data.tax;
            },function(err){
                toaster.pop("error","","Tax will be calculated during payment");
            })
    //calculate
        $scope.getTotalProductPrice = function(){

            $scope.order.productCost = 0;
            angular.forEach($scope.cart, function(item){
                if(item.product){
                    $scope.order.productCost+= item.product.price* item.quantity;
                }

            })
            return $scope.order.productCost;
        }();

    $scope.applyCoupon = function(){
        var coupon = {
            code: $scope.couponCode,
            amt: $scope.order.productCost
        }
        $scope.orderPgIndc = true;
        $scope.apiSMessage = "Checking your coupon"
        UserPayment.applyCoupon(coupon)
            .then(function(data){
                $scope.orderPgIndc = false;

                if(data.valid){
                    $scope.apiSMessage="";
                    $scope.apiEMessage="";
                    $scope.order.discount= data.amt;
                    $scope.order.couponId=data.id;
                }else{
                    $scope.order.discount=0;
                    $scope.apiEMessage=data.message;
                    $scope.apiSMessage="";
                }

            },function(err){
                $scope.orderPgIndc = false;
            })
    }
    $scope.orderShippingCost=0;
    $scope.changeShipping = function(shipping){

        $scope.order.shippingCost = shipping.price;
    }
    $scope.openAddressPopup = function(mode){

        $scope.address = new Address();
        var modal = $modal({scope: $scope, templateUrl: 'modules/checkout/tmpl/modal/address-modal.html', show: true});
    }
    $scope.createAddress = function(address){
        if($scope.address.id){
            $scope.address.$update(function(data){
                toaster.pop("info","","Address updated successfully");

            })
        }else {
            $scope.address.$save(function (data) {
                toaster.pop("info", "", "New address created");
                $scope.addresses.push(data);
            })
        }
    }
    $scope.editAddress = function(address){
        $scope.address = address;
        var modal = $modal({scope: $scope, templateUrl: 'modules/checkout/tmpl/modal/address-modal.html', show: true});
    }
    $scope.deleteAddress = function(index){
        $confirm({text: 'Do you want to delete this address?' ,ok:"Yes,delete",cancel:"Don't" , title:"Confirm delete"},{templateUrl : 'modules/checkout/tmpl/modal/cart-delete-confirm-modal.html'})
            .then(function() {
                var r = $scope.addresses[index];
                r.active=false;
                r.$update(function(data){
                    $scope.addresses.splice(index,1);
                    toaster.pop("info","","Address deleted");
                });

            });
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
        $scope.order.finalCost = $scope.order.productCost+$scope.order.tax+$scope.order.shippingCost-$scope.order.discount;
        if($scope.paymentMethod !== 'paypal'){
            $scope.order.card = $scope.card;
        }
        $scope.apiSMessage = "Order being processed...Please do not refresh the page or hit back";
        $scope.apiEMessage="";
        var cartIds=[];
        angular.forEach($scope.cart, function(item){
            if(item.id){
                cartIds.push(item.id);
            }
        })
        $scope.order.cartIds = cartIds;

        UserPayment.purchase($scope.order)
            .then(function(data){
                $log.debug("Payment successful ",data);


                if(data.method==='paypal'){
                    $window.location.href=data.redirectUrl;
                    $scope.apiSMessage = "You are being redirected to paypal. Please wait..."
                }else{
                    $scope.orderPgIndc = false;
                    $scope.apiSMessage="";
                    $state.go("confirm", {id: data.paymentId});
                }

            },function(err){
                $log.debug(err);
                $scope.orderPgIndc = false;
                $scope.apiSMessage="";

                $scope.apiEMessage = "Your order was not successful."
                if(err.message){
                    $scope.apiEMessage = err.message;
                }
            })
    }


}]);


