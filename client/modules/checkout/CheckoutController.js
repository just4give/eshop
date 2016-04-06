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

    var fieldsMap ={
        "payer.funding_instruments[0].credit_card.number":"Card Number",
        "payer.funding_instruments[0].credit_card.type":"Card Card Type",
        "payer.funding_instruments[0].credit_card.expire_month":"Expiry Month",
        "payer.funding_instruments[0].credit_card.expire_year":"Expiry Year",
        "payer.funding_instruments[0].credit_card.cvv2":"CVV",
    }

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
    $scope.years =[
        {label:'2016', value:16},
        {label:'2017', value:17},
        {label:'2018', value:18},
        {label:'2019', value:19},
        {label:'2020', value:20},
        {label:'2021', value:21},
        {label:'2022', value:22},
        {label:'2023', value:23},
        {label:'2024', value:24},
        {label:'2025', value:25}] ;
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
        $scope.apiSMessage = "Checking your coupon..."
        UserPayment.applyCoupon(coupon)
            .then(function(data){
                $scope.orderPgIndc = false;

                if(data.valid){
                    $scope.apiSMessage="You saved $"+data.amt+" by coupon";
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

       //FIXME:
        if(!$scope.formCard.cardNumber.$ccType){
            $scope.formCard.cardNumber.$ccType = "visa";
        }
        if($scope.paymentMethod !== 'paypal'){
            $scope.order.card = $scope.card;
            $scope.order.card.type = $scope.formCard.cardNumber.$ccType.toLowerCase();
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
        var pmodal = $modal({scope: $scope, templateUrl: 'modules/checkout/tmpl/modal/order-progress-modal.html', show: true});

        UserPayment.purchase($scope.order)
            .then(function(data){
                $log.debug("payment response ", data);
                 if(data.method==='paypal'){
                    $window.location.href=data.redirectUrl;
                    $scope.apiSMessage = "You are being redirected to paypal. Please wait..."
                }else{
                    $scope.orderPgIndc = false;
                    $scope.apiSMessage="";
                     if(pmodal){
                         pmodal.hide();
                     }
                    $state.go("confirm", {id: data.paymentId});
                }

            },function(err){
                $log.debug(err);
                $scope.orderPgIndc = false;
                $scope.apiSMessage="";
                if(pmodal){
                    pmodal.hide();
                }
                $scope.apiEMessage = "Your order was not successful."
                if(err.httpStatusCode == 400){
                    angular.forEach(err.response.details,function(detail){
                        $scope.apiEMessage +=  "<br>"+fieldsMap[detail.field] + "->"+detail.issue;
                    })

                }
            })
    }


}]);


