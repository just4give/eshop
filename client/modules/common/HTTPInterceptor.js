appModule.factory("httpInterceptor", ["$log", "$rootScope",function($log,$rootScope){
	return {
		
		request : function(config){
			$log.debug("intercepting request...");
			$rootScope.pspinner=true;
			return config;
		},
		response : function(response){
			$log.debug("intercepting response...");
			$rootScope.pspinner=false;
			return response;
		}
		
	}
}])