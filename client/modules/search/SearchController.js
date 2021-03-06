/**
 * Created by Mithun.Das on 12/8/2015.
 */
appModule.controller("searchController",["$scope","$rootScope","$log","$timeout","$interval","$modal","toaster","$stateParams","$state",
    "SearchService","Categories","Merchandises","UserCart",
    function($scope,$rootScope,$log,$timeout,$interval,$modal,toaster,$stateParams,$state,SearchService,Categories,Merchandises,UserCart){

    $scope.quantities = [1,2,3,4,5,6,7,8,9,10];
    $rootScope.search = $rootScope.search|| {query : $stateParams.query, priceMin:0, priceMax:1000,checkedCategories :[],checkedMerchandises:[]};

    $log.debug("Search query = ",$rootScope.search );
    $scope.categories=Categories;
    $scope.merchandises=Merchandises;
    $scope.facetOpen=true;
    $scope.recordsPerPage = 10;
    $scope.pagination = {current: 1};
    $scope.sortKeys = [
        {label:"price low to high", sortObj: ['price','ASC']},
        {label:"price high to low", sortObj: ['price','DESC']},
        {label:"New arrival", sortObj: ['createdAt','ASC']}];

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
            },
            onChange: function(sliderId, modelValue, highValue){
                $scope.slider.changed=true;
            }
        }
    };

    $interval(function(){
        if($scope.slider.changed){
            $scope.slider.changed=false;
            $scope.reSearch();
        }
    },2000)


    $timeout(function () {
        $scope.$broadcast('rzSliderForceRender');
    });

    $scope.getResults = function(currentPage){
        $scope.prgIndicator= true;
        SearchService.query(currentPage,$scope.recordsPerPage,$rootScope.search)
            .then(function (data) {
                $scope.products  = data.rows;
                $scope.totalRecords = data.count;
                $scope.prgIndicator= false;
            }, function (err) {
                $scope.prgIndicator= false;
                toaster.pop("error", "", "System error !");
            });

    }

    $scope.getSearchName=function(name){
        return name.replace(/\s+/g, '-').toUpperCase();
    }
    $scope.getResults($scope.pagination.current);


    $scope.pageChanged = function(newPage) {
        $scope.getResults(newPage);
    };



    $scope.reSearch = function(){
        $scope.pagination.current=1;
        $scope.getResults($scope.pagination.current);
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


        var product =angular.copy(product);
        UserCart.addToCart(product);

        toaster.pop({
            type: 'success',
            body: 'added to cart successfully.',
            showCloseButton: true
        });
    }
    $scope.loadMore = function(){
        $scope.pagination.current++;
        $scope.getResults($scope.pagination.current);


    }

}]);
