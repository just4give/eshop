appModule.config(["$stateProvider","$urlRouterProvider", "$httpProvider","$locationProvider",
    function($stateProvider, $urlRouterProvider, $httpProvider,$locationProvider) {
    
	$urlRouterProvider.otherwise('/');
    
    $stateProvider
      .state('/', {
         url: '/?callback',
         templateUrl: 'modules/app/tmpl/home.html',
         controller: "HomeController"
     }).state('search', {
            url: '/search?query&category',
            templateUrl: 'modules/search/tmpl/search-result.html',
            controller: "searchController"
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

 /*    $locationProvider.html5Mode({
     enabled: true,
     requireBase: false
     });*/

    $locationProvider.hashPrefix('!');

    $httpProvider.interceptors.push('httpInterceptor');

    console.log('route config...');
        
}]);
