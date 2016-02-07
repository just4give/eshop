appModule.config(["$stateProvider","$urlRouterProvider", "$httpProvider",function($stateProvider, $urlRouterProvider, $httpProvider) {
    
	$urlRouterProvider.otherwise('/');
    
    $stateProvider
      .state('/', {
         url: '/?callback',
         templateUrl: 'modules/app/tmpl/home.html',
         controller: "HomeController"
     }).state('details', {
            url: '/details/:id',
            templateUrl: 'modules/search/tmpl/product-details.html',
            controller:'productDetailsController'
    }).state('upload', {
        url: '/upload',
        templateUrl: 'modules/upload/tmpl/upload-container.html',
        controller:"UploadController"
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
    }).state('pricing', {
        url: '/pricing',
        templateUrl: 'modules/app/tmpl/pricing.html'
    })
     ;

    $httpProvider.interceptors.push('httpInterceptor');

    console.log('route config...');
        
}]);
