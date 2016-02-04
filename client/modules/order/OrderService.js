/**
 * Created by Mithun.Das on 12/8/2015.
 */
appModule.factory('OrderService', ["$rootScope","$http","$q","$log", function($rootScope, $http, $q,$log){
    var apiContext = $rootScope.apiContext;

    return{

        saveCart: function(cart){
            var tempCart = {uuid:$rootScope.state.user.uuid, products:[]};
            angular.forEach(cart, function(item){
                tempCart.products.push({imgId: item.imgId, imgSrc: item.imgSrc, frameSize: item.format.frameSize, price: item.format.price, quantity: item.quantity,paperFinish: item.paperFinish});
            });
            $log.debug('saving cart');
            $log.debug(tempCart);

            var deferred = $q.defer();

            $http.post($rootScope.apiContext + "/api/order/cart", tempCart)
                .success(function (data){

                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        getCart: function(){
             var deferred = $q.defer();

            $http.get($rootScope.apiContext + "/api/order/cart/"+$rootScope.state.user.uuid)
                .success(function (data){

                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        deleteCart: function(cartId){
            var deferred = $q.defer();

            $http.post($rootScope.apiContext + "/api/order/cart/delete/"+cartId,{})
                .success(function (data){

                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        getShippingMethod: function(){
            var deferred = $q.defer();

            if($rootScope.state && $rootScope.state.shipping){
                deferred.resolve($rootScope.state.shipping);
            }else {
                $http.get($rootScope.apiContext + "/api/order/shipping")
                    .success(function (data) {
                        $rootScope.state.shipping = data;
                        deferred.resolve(data);
                    })
                    .error(function (err) {
                        deferred.reject(err);
                    });
            }

            return deferred.promise;
        },
        placeOrder: function(order){
            var uuid = $rootScope.state.user ? $rootScope.state.user.uuid:undefined;
            order.shippingMethod = order.shippingMethod.method;

            $log.debug(order);

            var deferred = $q.defer();

            $http.post($rootScope.apiContext + "/api/order/place/"+uuid, order)
                .success(function (data){

                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });

            return deferred.promise;
        }
        ,
        saveAddress : function(address){

        var deferred = $q.defer();

        var uuid = $rootScope.state.user ? $rootScope.state.user.uuid:undefined;

        $http.post($rootScope.apiContext + "/api/user/address/"+uuid,address)
            .success(function (data){

                deferred.resolve(data);
            })
            .error(function(err){
                deferred.reject(err);
            });




        return deferred.promise;
    },
    defaultAddress : function(){

        var deferred = $q.defer();

        var uuid = $rootScope.state.user ? $rootScope.state.user.uuid:undefined;

        $http.get($rootScope.apiContext + "/api/user/address/"+uuid)
            .success(function (data){

                deferred.resolve(data);
            })
            .error(function(err){
                deferred.reject(err);
            });
        return deferred.promise;
    },
        getAddress : function( addressId){

            var deferred = $q.defer();

            var uuid = $rootScope.state.user ? $rootScope.state.user.uuid:undefined;

            $http.get($rootScope.apiContext + "/api/user/address/"+uuid+"/"+addressId)
                .success(function (data){

                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });
            return deferred.promise;
        },
    allAddress : function(){

            var deferred = $q.defer();

            var uuid = $rootScope.state.user ? $rootScope.state.user.uuid:undefined;

            $http.get($rootScope.apiContext + "/api/user/addresses")
                .success(function (data){

                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });
            return deferred.promise;
        },
        getOrders : function(){

            var deferred = $q.defer();

            var uuid = $rootScope.state.user ? $rootScope.state.user.uuid:undefined;

            $http.get($rootScope.apiContext + "/api/order/all/"+uuid)
                .success(function (data){

                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });
            return deferred.promise;
        },
        getOrderDetails : function(orderId){

            var deferred = $q.defer();

            var uuid = $rootScope.state.user ? $rootScope.state.user.uuid:undefined;

            $http.get($rootScope.apiContext + "/api/order/detail/"+orderId+"/"+uuid)
                .success(function (data){

                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });
            return deferred.promise;
        },
        contactUs : function(form){

            var deferred = $q.defer();
            $http.post($rootScope.apiContext + "/api/order/contactus",form)
                .success(function (data){

                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });
             return deferred.promise;
        },
        updateCartItem : function(userId, cartId, cart){

            var deferred = $q.defer();
            $http.post($rootScope.apiContext + "/api/order/cart/"+userId+"/"+cartId,cart)
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
