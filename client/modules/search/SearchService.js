/**
 * Created by Mithun.Das on 12/8/2015.
 */
appModule.factory('SearchService', ["$rootScope","$http","$q","$log", function($rootScope, $http, $q,$log){

    return{

        query : function(pageNumber,limit,search){

            var deferred = $q.defer();

            $http.get("api/products/search?page="+pageNumber+"&limit="+limit+"&search="+angular.toJson(search))
                .success(function (data){
                    deferred.resolve(data);

                })
                .error(function(err){
                    deferred.reject(err);
                });
            return deferred.promise;
        }
    }

}]);

appModule.directive('errSrc', function() {
    return {
        link: function(scope, element, attrs) {
            attrs.$set('src', attrs.loaderSrc);

            element.bind('error', function() {

                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});

/*
attrs.$observe('ngSrc', function(value) {
    if (!value && attrs.errSrc) {
        attrs.$set('src', attrs.errSrc);
    }
});*/
