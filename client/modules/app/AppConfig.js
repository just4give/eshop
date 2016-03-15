appModule.config(["$stateProvider","$urlRouterProvider", "$httpProvider","$locationProvider",
    function($stateProvider, $urlRouterProvider, $httpProvider,$locationProvider) {
    
	$urlRouterProvider.otherwise('home');
    
    $stateProvider
      .state('home', {
         url: '/?callback',
         templateUrl: 'modules/app/tmpl/home.html',
         controller: "HomeController"
     }) .state('login', {
            url: '/login?cb',
            templateUrl: 'modules/app/tmpl/login.html',
            controller: "loginController"
        })
        .state('search', {
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
    }).state('product', {
            url: '/product/:name/:id',
            templateUrl: 'modules/search/tmpl/product-details.html',
            controller:'productDetailsController',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'eshop',
                        files: [

                            'vendor/bootstrap/dist/css/bootstrap.min.css',
                            'vendor/font-awesome/css/font-awesome.min.css',
                            'vendor/angular/angular-csp.css',
                            'vendor/animate.css/animate.min.css',
                            'vendor/angularjs-toaster/toaster.min.css',
                            'vendor/angularjs-slider/dist/rzslider.css',
                            'vendor/metisMenu/dist/metisMenu.min.css',
                            'vendor/bootstrap-additions/dist/bootstrap-additions.min.css',
                            'css/admin.css',
                            'css/style.css'

                        ]
                    })
                }
            }
        })
        .state('cart', {
            url: '/cart',
            templateUrl: 'modules/checkout/tmpl/cart.html',
            controller:"CartController"
    }).state('checkout', {
            url: '/checkout',
            templateUrl: 'modules/checkout/tmpl/checkout.html',
            controller:"CheckoutController"
    }).state('confirm', {
            url: '/confirm',
            templateUrl: 'modules/checkout/tmpl/confirm.html',
            controller:"ConfirmController"
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
        .state('admin', {
            url: '/admin',
            templateUrl: 'modules/admin/tmpl/home.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'eshop',
                        files: [

                            'vendor/bootstrap/dist/css/bootstrap.min.css',
                            'vendor/font-awesome/css/font-awesome.min.css',
                            'vendor/angular/angular-csp.css',
                            'vendor/animate.css/animate.min.css',
                            'vendor/angularjs-toaster/toaster.min.css',
                            'vendor/angularjs-slider/dist/rzslider.css',
                            'vendor/metisMenu/dist/metisMenu.min.css',
                            'vendor/bootstrap-additions/dist/bootstrap-additions.min.css',
                            'css/admin.css',
                            'css/style.css'

                        ]
                    })
                }
            }
        })
    .state('admin.dashboard', {
            url: '/dashboard',
            templateUrl: 'modules/admin/tmpl/dashboard.html',
            controller:'DashboardController'
        })
        .state('admin.orders', {
            url: '/orders',
            templateUrl: 'modules/admin/tmpl/orders.html'
        })
        .state('admin.products', {
            url: '/products',
            templateUrl: 'modules/admin/tmpl/products.html',
            controller:'ProductController',

        })
        .state('admin.product-detail', {
            url: '/products/:id',
            templateUrl: 'modules/admin/tmpl/product-edit.html',
            controller: 'ProductDetailsController'
        })
        .state('admin.taxes', {
            url: '/taxes',
            templateUrl: 'modules/admin/tmpl/taxes.html',
            controller: 'TaxController'
        })
        .state('admin.tax-detail', {
            url: '/taxes/:id',
            templateUrl: 'modules/admin/tmpl/tax-edit.html',
            controller: 'TaxDetailsController'
        })
        .state('admin.categories', {
            url: '/categories',
            templateUrl: 'modules/admin/tmpl/categories.html',
            controller: 'CategoryController'
        })
        .state('admin.category-detail', {
            url: '/categories/:id',
            templateUrl: 'modules/admin/tmpl/category-edit.html',
            controller: 'CategoryDetailsController'
        })
        .state('admin.merchandises', {
            url: '/merchandises',
            templateUrl: 'modules/admin/tmpl/merchandises.html',
            controller: 'MerchandiseController'
        })
        .state('admin.merchandise-detail', {
            url: '/merchandises/:id',
            templateUrl: 'modules/admin/tmpl/merchandise-edit.html',
            controller: 'MerchandiseDetailsController'
        })
     ;

     $locationProvider.html5Mode(true);


    $locationProvider.hashPrefix('!');

    $httpProvider.interceptors.push('httpInterceptor');


        
}]);
