/**
 * Created by Mithun.Das on 12/8/2015.
 */
appModule.controller("productDetailsController",["$scope","$rootScope","$log","$interval","$modal","toaster",
    function($scope,$rootScope,$log,$interval,$modal,toaster){

    $scope.quantities = [1,2,3,4,5,6,7,8,9,10];

    $scope.product =
     {
     id:101,
     name:"Microsoft Surface",
     url:"images/product/p1.png"
     };
    $scope.tabs =[{
            title: "Overview",
            content:"Overview of the product"
        },
            {
                title: "Specification",
                content:"Detail specification of the product"
    }];


    $scope.addToCart = function(){
        $rootScope.cart = $rootScope.cart || [];
        $rootScope.cart.push($scope.product);
        toaster.pop({
            type: 'success',
            body: 'added to cart successfully.',
            showCloseButton: true
        });
    }

    /* carousel */
    $scope.myInterval = 10000;
    $scope.noWrapSlides = false;
    var slides = $scope.slides = [ {image:'images/img000.png', text:"Stealing Deals on HD TVs. ",
        text2:"Everyday is christmas. Find your perfect TV today.",
        link:{text:"Buy", href:"/#/xyz"}},
        {image:'images/img001.png', text:"Give yourself the true power of computing. ",
            text2:"Browse wide range of Macbook options and pick yours.",
            link:{text:"Buy Mac", href:"/#/xyz"}},
        {image:'images/img002.png', text:"Windows laptop and tablets ",
            text2:"Power of widows and portability of tablet together. Surface is the next big gadget you should consider.",
            link:{text:"Buy", href:"/#/xyz"}}];
    /* carousel */



}]);
