/**
 * Created by Mithun.Das on 12/8/2015.
 */
appModule.controller("searchController",["$scope","$rootScope","$log","$interval","$modal","toaster",
    function($scope,$rootScope,$log,$interval,$modal,toaster){

    $scope.quantities = [1,2,3,4,5,6,7,8,9,10];

 $scope.products = [
     {
     id:101,
     name:"Microsoft Surface",
     url:"images/product/p1.png"
     },
     {
         id:102,
         name:"Apple iPhone 6 plus",
         url:"images/product/p2.jpeg"
     },
     {
         id:103,
         name:"Samsung Galaxy S6",
         url:"images/product/p3.png"
     },
     {
         id:104,
         name:"Apple iPad Mini",
         url:"images/product/p4.jpg"
     },
     {
         id:105,
         name:"HP Monitor",
         url:"images/product/p5.png"
     },
     {
         id:106,
         name:"Toshiba Laptop",
         url:"images/product/p6.jpg"
     },
     {
         id:107,
         name:"Bose Bluetooth Speaker",
         url:"images/product/p7.jpg"
     },
     {
         id:108,
         name:"Beats Headphone",
         url:"images/product/p8.jpg"
     }];

    $scope.quickView = function(index){

        $scope.selectedProduct = $scope.products[index];
        $scope.selectedProduct.quantity=1;

        $scope.tabs =[{
                title: "Overview",
            content:"Overview of the product"
            },
            {
                title: "Specification",
                content:"Detail specification of the product"
            }];



        var modal = $modal({scope: $scope, templateUrl: 'modules/search/tmpl/modal/product-quickview-modal.html', show: true});
    }


    //$rootScope.cartProducts = $scope.products;

    $scope.addToCart = function(index){
        $rootScope.cart = $rootScope.cart || [];
        $rootScope.cart.push($scope.products[index]);

        toaster.pop({
            type: 'success',
            body: 'added to cart successfully.',
            showCloseButton: true
        });
    }


}]);
