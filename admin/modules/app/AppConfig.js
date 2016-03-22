admin.config(["$stateProvider","$urlRouterProvider", "$httpProvider","$locationProvider",
    function($stateProvider, $urlRouterProvider, $httpProvider,$locationProvider) {
    
	$urlRouterProvider.otherwise('login');
    
    $stateProvider
      .state('login', {
         url: '/login',
         templateUrl: 'modules/www/tmpl/login.html',
          controller:'LoginController'
     }).state('home', {
            url: '/home',
            templateUrl: 'modules/www/tmpl/home.html'
    })
        .state('home.dashboard', {
        url: '/dashboard',
        templateUrl: 'modules/www/tmpl/dashboard.html',
        controller:'DashboardController'
    })
        .state('home.orders', {
        url: '/orders',
        templateUrl: 'modules/www/tmpl/orders.html'
    })
        .state('home.products', {
            url: '/products',
            templateUrl: 'modules/www/tmpl/products.html',
            controller:'ProductController'
        })
        .state('home.product-detail', {
            url: '/products/:id',
            templateUrl: 'modules/www/tmpl/product-edit.html',
            controller: 'ProductDetailsController'
        })
        .state('home.taxes', {
            url: '/taxes',
            templateUrl: 'modules/www/tmpl/taxes.html',
            controller: 'TaxController'
        })
        .state('home.tax-detail', {
            url: '/taxes/:id',
            templateUrl: 'modules/www/tmpl/tax-edit.html',
            controller: 'TaxDetailsController'
        })
        .state('home.categories', {
            url: '/categories',
            templateUrl: 'modules/www/tmpl/categories.html',
            controller: 'CategoryController'
        })
        .state('home.category-detail', {
            url: '/categories/:id',
            templateUrl: 'modules/www/tmpl/category-edit.html',
            controller: 'CategoryDetailsController'
        })
        .state('home.merchandises', {
            url: '/merchandises',
            templateUrl: 'modules/www/tmpl/merchandises.html',
            controller: 'MerchandiseController'
        })
        .state('home.merchandise-detail', {
            url: '/merchandises/:id',
            templateUrl: 'modules/www/tmpl/merchandise-edit.html',
            controller: 'MerchandiseDetailsController'
        })
     ;




        
}]);
