appModule.config(["$stateProvider","$urlRouterProvider", "$httpProvider","$locationProvider",
    function($stateProvider, $urlRouterProvider, $httpProvider,$locationProvider) {


    var routeRoleChecks = {

        auth: function(UserService) {
            return UserService.isAuthorized();
        },
        authWithAdminRole: function(UserService) {
            return UserService.isAuthorizedRole("admin");
        },
        authWithSuperUserRole: function(UserService) {
            return UserService.isAuthorizedRole("super");
        }
    }

	$urlRouterProvider.otherwise('home');
    
    $stateProvider
      .state('home', {
         url: '/?callback',
         templateUrl: 'modules/app/tmpl/home.html',
         controller: "HomeController",
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

                    Category.query({active:true},function(data){

                        deferred.resolve(data);
                    })

                    return deferred.promise;
                },
                Merchandises: function(Merchandise,$q){
                    var deferred = $q.defer();

                    Merchandise.query({active:true},function(data){

                        deferred.resolve(data);
                    })

                    return deferred.promise;
                }
            }
    })
    .state('details', {
            url: '/details/:id',
            templateUrl: 'modules/search/tmpl/product-details.html',
            controller:'productSearchDetailsController'
    }).state('product', {
            url: '/product/:name/:id',
            templateUrl: 'modules/search/tmpl/product-details.html',
            controller:'productSearchDetailsController',
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
            controller:"CheckoutController",
            resolve:{
                auth: routeRoleChecks.auth
            }
    }).state('profile', {
            url: '/profile',
            templateUrl: 'modules/profile/tmpl/myprofile.html',
            controller:"ProfileController",
            resolve:{
                auth: routeRoleChecks.auth
            }
    }).state('confirm', {
            url: '/confirm?id',
            templateUrl: 'modules/checkout/tmpl/confirm.html',
            controller:"ConfirmController"
        })
    .state('myorder', {
            url: '/myorder',
            templateUrl: 'modules/order/tmpl/my-order.html',
            controller:"MyOrderController",
            resolve:{
                auth: routeRoleChecks.auth
            }
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
                },
                Dashboard : function(DashboardService){
                    return DashboardService.getDashboard();
                },
                auth: routeRoleChecks.authWithAdminRole
            }
        })
    .state('admin.dashboard', {
            url: '/dashboard',
            templateUrl: 'modules/admin/tmpl/dashboard.html',
            controller:'DashboardController',
            resolve:{

            }
        })
        .state('admin.orders', {
            url: '/orders',
            templateUrl: 'modules/admin/tmpl/orders.html',
            controller:'AdminOrderController'
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
        .state('admin.shippings', {
            url: '/shippings',
            templateUrl: 'modules/admin/tmpl/shippings.html',
            controller: 'ShippingController'
        })
        .state('admin.shipping-detail', {
            url: '/shippings/:id',
            templateUrl: 'modules/admin/tmpl/shipping-edit.html',
            controller: 'ShippingDetailsController'
        })
        .state('admin.refunds', {
            url: '/refunds',
            templateUrl: 'modules/admin/tmpl/refunds.html',
            controller: 'RefundController'
        })
        .state('admin.refund-detail', {
            url: '/refunds/:id',
            templateUrl: 'modules/admin/tmpl/refund-edit.html',
            controller: 'RefundDetailsController'
        })
        .state('admin.coupons', {
            url: '/coupons',
            templateUrl: 'modules/admin/tmpl/coupons.html',
            controller: 'CouponController'
        })
        .state('admin.coupon-detail', {
            url: '/coupons/:id',
            templateUrl: 'modules/admin/tmpl/coupon-edit.html',
            controller: 'CouponDetailsController'
        })

     ;

     $locationProvider.html5Mode(true);


    $locationProvider.hashPrefix('!');

    $httpProvider.interceptors.push('httpInterceptor');


        
}]);
