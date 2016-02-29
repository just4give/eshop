admin.config(["$stateProvider","$urlRouterProvider", "$httpProvider","$locationProvider",
    function($stateProvider, $urlRouterProvider, $httpProvider,$locationProvider) {
    
	$urlRouterProvider.otherwise('login');
    
    $stateProvider
      .state('login', {
         url: '/login',
         templateUrl: 'modules/app/tmpl/login.html',
          controller:'LoginController'
     }).state('home', {
            url: '/home',
            templateUrl: 'modules/app/tmpl/home.html'
    })
        .state('home.dashboard', {
        url: '/dashboard',
        templateUrl: 'modules/app/tmpl/dashboard.html',
        controller:'DashboardController'
    })
        .state('home.orders', {
        url: '/orders',
        templateUrl: 'modules/app/tmpl/orders.html'
    })
        .state('home.products', {
            url: '/products',
            templateUrl: 'modules/app/tmpl/products.html',
            controller:'ProductController'
        })
        .state('home.product-detail', {
            url: '/products/:id',
            templateUrl: 'modules/app/tmpl/product-edit.html',
            controller: 'ProductDetailsController'
        })
        .state('home.taxes', {
            url: '/taxes',
            templateUrl: 'modules/app/tmpl/taxes.html',
            controller: 'TaxController'
        })
        .state('home.tax-detail', {
            url: '/taxes/:id',
            templateUrl: 'modules/app/tmpl/tax-edit.html',
            controller: 'TaxDetailsController'
        })

     ;




        
}]);
