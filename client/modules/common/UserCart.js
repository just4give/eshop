/**
 * Created by Mithun.Das on 3/13/2016.
 */
appModule.factory("UserCart", ["$log","$rootScope","Cart","localStorageService","$interval","Product","toaster",
    function($log,$rootScope,Cart,localStorageService,$interval,Product,toaster){

        $interval(function(){
            funcSync();
        },1000);

        $rootScope.$watch("loggedIn",function(newValue, oldValue){
            if(newValue && newValue===true){
                $log.debug("User just logged in");
                retrieveCart();
            }
        });

        var funcSync = function(){

            //sync only if user is logged in
            if($rootScope.loggedIn && $rootScope.cartUpdated){
                $log.debug("*** syncing cart");
                $rootScope.cart = $rootScope.cart || [];
                angular.forEach($rootScope.cart, function(item){



                    if(item.id){
                        item.$update(function(data){

                            var indx =  _.findIndex($rootScope.cart,{productId:data.productId});
                            if(indx!= -1){

                                $rootScope.cart[indx]=data;
                                Product.get({id:data.productId},function(p){
                                    $rootScope.cart[indx].product = p;
                                })

                            }
                        })

                    }else{
                        Cart.save(item,function(data){
                            $log.debug(data);
                            var indx =  _.findIndex($rootScope.cart,{productId:data.productId});
                            if(indx!= -1){

                                $rootScope.cart[indx]=data;
                                Product.get({id:data.productId},function(p){
                                    $rootScope.cart[indx].product = p;
                                })

                            }
                        })
                    }
                });


                $rootScope.cartUpdated=false;
            }

        }

        var addToCart =function(product){

            $rootScope.cart = $rootScope.cart || [];
            $rootScope.cartUpdated=true;

            var indx =  _.findIndex($rootScope.cart,{productId:product.id});
            console.log("Product index ", indx);
            if(indx!=-1){

                $rootScope.cart[indx].quantity++;
                $rootScope.cart[indx].price =  $rootScope.cart[indx].quantity* $rootScope.cart[indx].product.price;
            }else{
                var cartItem = new Cart();
                cartItem.quantity=1;
                cartItem.productId = product.id;
                cartItem.product = product;
                cartItem.price = product.price;
                $rootScope.cart.push(cartItem);
            }

        }

        var increaseQ = function(item){
            var indx =  _.findIndex($rootScope.cart,{productId:item.productId});
            if(indx!=-1){
                item.quantity++;
                item.price = item.quantity*item.product.price;
                $rootScope.cartUpdated=true;
            }

        }
        var decreaseQ = function(item){
            var indx =  _.findIndex($rootScope.cart,{productId:item.productId});
            if(indx!=-1){
                if(item.quantity>1){
                    item.quantity--;
                    item.price = item.quantity*item.product.price;
                    $rootScope.cartUpdated=true;
                }
            }

        }

        var retrieveCart = function(){
            if($rootScope.loggedIn && $rootScope.state && $rootScope.state.user){
                $rootScope.cartUpdated=false;
                Cart.query({userId: $rootScope.state.user.id ,orderId:null},function(data){
                    $log.debug("retrieved user cart details ", data);
                    angular.forEach(data, function(dbCartItem){
                        var indx =  _.findIndex($rootScope.cart,{productId:dbCartItem.productId});

                        if(indx!= -1){
                            //same product item exists in current cart , so merge them
                            if($rootScope.cart[indx].id !== dbCartItem.id){
                                dbCartItem.quantity += $rootScope.cart[indx].quantity;
                                dbCartItem.price = dbCartItem.quantity*dbCartItem.product.price;
                            }

                            $rootScope.cart[indx] = dbCartItem;

                        }else{
                            $rootScope.cart.push(dbCartItem);

                        }
                    })
                    $rootScope.cartUpdated=true;
                });
            }
        }

        var deleteCart = function(cartItem){
            var indx =  _.findIndex($rootScope.cart,{productId:cartItem.productId});
            if(indx!=-1){
                if(cartItem.id){
                    cartItem.$delete(function(data){
                        $rootScope.cart.splice(indx,1);
                        toaster.pop("info","","Item removed from cart");
                    });
                }else{
                    $rootScope.cart.splice(indx,1);
                    toaster.pop("info","","Item removed from cart");
                }
            }
        }

        var imageUrlContext = "http://cpa.local.com/repo/thumb";
        var getImageUrl = function(fileName){

            return imageUrlContext+ "/"+fileName;
        }


        return{
            addToCart:addToCart,
            sync: funcSync,
            increaseQ:increaseQ,
            decreaseQ:decreaseQ,
            retrieveCart:retrieveCart,
            deleteCart:deleteCart,
            getImageUrl:getImageUrl
        }

    }]);
