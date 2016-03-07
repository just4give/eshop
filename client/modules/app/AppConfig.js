appModule.config(["$stateProvider","$urlRouterProvider", "$httpProvider","$locationProvider",
    function($stateProvider, $urlRouterProvider, $httpProvider,$locationProvider) {
    
	$urlRouterProvider.otherwise('home');
    
    $stateProvider
      .state('home', {
         url: '/?callback',
         templateUrl: 'modules/app/tmpl/home.html',
         controller: "HomeController"
     }).state('search', {
            url: '/search?query&category',
            templateUrl: 'modules/search/tmpl/search-result.html',
            controller: "searchController",
            resolve:{
                Categories: function(Category,$q){
                    var deferred = $q.defer();

                    Category.query(function(data){

                        deferred.resolve(data);
                    })

                    return deferred.promise;
                },
                Merchandises: function(Merchandise,$q){
                    var deferred = $q.defer();

                    Merchandise.query(function(data){

                        deferred.resolve(data);
                    })

                    return deferred.promise;
                }
            }
    })
    .state('details', {
            url: '/details/:id',
            templateUrl: 'modules/search/tmpl/product-details.html',
            controller:'productDetailsController'
    }).state('cart', {
            url: '/cart',
            templateUrl: 'modules/checkout/tmpl/cart.html',
            controller:"CartController"
    }).state('checkout', {
            url: '/checkout',
            templateUrl: 'modules/checkout/tmpl/checkout.html',
            controller:"CheckoutController"
    })
    .state('myorder', {
            url: '/myorder',
            templateUrl: 'modules/order/tmpl/my-order.html',
            controller:"MyOrderController"
    }).state('who', {
        url: '/who',
        templateUrl: 'modules/app/tmpl/who-we-are.html'
    }).state('contact', {
        url: '/contact',
        templateUrl: 'modules/app/tmpl/contact-us.html',
        controller: 'ContactController'
    })
     ;

     $locationProvider.html5Mode(true);


    $locationProvider.hashPrefix('!');

    $httpProvider.interceptors.push('httpInterceptor');

    console.log('route config...');
        
}]);
