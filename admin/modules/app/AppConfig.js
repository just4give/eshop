admin.config(["$stateProvider","$urlRouterProvider", "$httpProvider","$locationProvider",
    function($stateProvider, $urlRouterProvider, $httpProvider,$locationProvider) {
    
	$urlRouterProvider.otherwise('login');
    
    $stateProvider
      .state('login', {
         url: '/login',
         templateUrl: 'modules/app/tmpl/login.html',
          controller:'LoginController'
     }).state('dashboard', {
            url: '/dashboard',
            templateUrl: 'modules/app/tmpl/dashboard.html'
    })

     ;




        
}]);
