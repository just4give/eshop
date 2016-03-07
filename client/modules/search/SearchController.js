/**
 * Created by Mithun.Das on 12/8/2015.
 */
appModule.controller("searchController",["$scope","$rootScope","$log","$timeout","$modal","toaster","$stateParams","$state",
    "Product","Categories","Merchandises",
    function($scope,$rootScope,$log,$timeout,$modal,toaster,$stateParams,$state,Product,Categories,Merchandises){

    $scope.quantities = [1,2,3,4,5,6,7,8,9,10];
    $rootScope.search = {query : $stateParams.query, checkedCategories :[],checkedMerchandises:[]};

    $log.debug("Search query = ",$rootScope.search );
    $scope.categories=Categories;
    $scope.merchandises=Merchandises;
    $scope.facetOpen=true;

    angular.forEach(Categories,function(d){
        //$rootScope.search.checkedCategories.push(d.name);
    })
    angular.forEach(Merchandises,function(d){
        //$rootScope.search.checkedMerchandises.push(d.name);
    })

    $scope.slider = {
        min: 0,
        max: 1000,
        options: {
            floor: 0,
            ceil: 1000,
            translate: function(value) {
                return '$' + value;
            }
        }
    };
        $timeout(function () {
            $scope.$broadcast('rzSliderForceRender');
        });
    $scope.getResults = function(currentPage){
        Product.query({q:$rootScope.search.query,
            category:$rootScope.search.checkedCategories,
            merchandise: $rootScope.search.checkedMerchandises},function(data,headers){
            $log.debug("searched products ", data);
            $scope.products = data;
        });
    }

    $scope.getResults(1);
    $scope.reSearch = function(){
        $scope.getResults(1);
    }
    $scope.toggleCheck = function (code,list) {
        if (list.indexOf(code) === -1) {
            list.push(code);
        } else {
            list.splice(list.indexOf(code), 1);
        }

        $scope.reSearch(1);
    };


/* $scope.products = [
     {
     id:101,
     name:"Microsoft Surface",
     url:"images/product/p1.png",
     price:100
     },
     {
         id:102,
         name:"Apple iPhone 6 plus",
         url:"images/product/p2.jpeg",
         price:110
     },
     {
         id:103,
         name:"Samsung Galaxy S6",
         url:"images/product/p3.png",
         price:199
     },
     {
         id:104,
         name:"Apple iPad Mini",
         url:"images/product/p4.jpg",
         price:349
     },
     {
         id:105,
         name:"HP Monitor",
         url:"images/product/p5.png",
         price:160
     },
     {
         id:106,
         name:"Toshiba Laptop",
         url:"images/product/p6.jpg",
         price:300
     },
     {
         id:107,
         name:"Bose Bluetooth Speaker",
         url:"images/product/p7.jpg",
         price:199
     },
     {
         id:108,
         name:"Beats Headphone",
         url:"images/product/p8.jpg",
         price:99
     }];*/

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

    $scope.addToCart = function(product){
        $rootScope.cart = $rootScope.cart || [];
        var item =angular.copy(product);

        item.quantity=1;
        $rootScope.cart.push(item);

        toaster.pop({
            type: 'success',
            body: 'added to cart successfully.',
            showCloseButton: true
        });
    }


}]);
