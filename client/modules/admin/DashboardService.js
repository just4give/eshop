/**
 * Created by mithun.das on 3/31/2016.
 */

appModule.factory("DashboardService",["$rootScope","$log","$q","$http", function($rootScope,$scope,$q,$http){

    var getDashboard = function(){

        var deferred = $q.defer();

        $http.get("api/dashboard/metadata")
            .success(function (data){

                $rootScope.dashboard = data.data;
                deferred.resolve(data);

            })
            .error(function(err){
                deferred.reject(err);
            });
        return deferred.promise;
    }

    return {
        getDashboard :getDashboard
    }

}])
