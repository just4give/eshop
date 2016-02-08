/**
 * Created by Mithun.Das on 12/4/2015.
 */
appModule.controller("UploadController",["$scope","$rootScope","$log","$modal","$state", "$interval","PhotoService","localStorageService","Upload","OrderService","$timeout",
    function($scope,$rootScope,$log,$modal,$state,$interval,PhotoService,localStorageService,Upload,OrderService,$timeout){

    $scope.totalPhoto = 0;
    $scope.imageBag =[];
    $scope.totalPrice=0;

    $scope.galleryBag =[];

    $scope.globalPaperFinish="glossy";


    PhotoService.getPricing().then(function(data){
        $scope.formats = data;
    },function(err){
        $log.debug(err);
        $rootScope.$broadcast('api_error',err);
    });

    $rootScope.increaseQuantity = function(m){
        m.quantity = m.quantity+1;
       // $scope.totalPrice += m.format.price;
       // $scope.totalPhoto++
    }

    $scope.getTotalPhotos = function(){
        $scope.totalPhoto =0;
        $scope.totalPrice =0;

        angular.forEach($scope.imageBag, function(item){
            $scope.totalPhoto += parseInt(item.quantity);
            $scope.totalPrice += item.format.price*item.quantity;
        })

        return $scope.totalPhoto;
    }

    $rootScope.decreaseeQuantity = function(m){
        if(m.quantity >1 ) {
            m.quantity = m.quantity - 1;
            //$scope.totalPrice -= m.format.price;
           // $scope.totalPhoto--;
        }
    }

    $scope.deleteImage = function(index){
        $log.debug("image deleted "+ index);
        var imgId = $scope.imageBag[index].imgId;
        $log.debug(imgId);
        PhotoService.deletePhoto(imgId)
            .then(function(data){
                //$scope.galleryBag.splice(index,1);
                $log.debug(data);

            },function(err){
                $rootScope.$broadcast('api_error',err);
            });
    }


    $scope.tooltip = {
        title: 'You have not selected any photo to print. Please increase quantity'
    }


    $scope.upload = function(file){

        $log.debug('****'+file);

        if(!file ||file.$error){
            //$scope.modalErrorMessage = 'Image size can not be more than 10MB';
            return;
        }

        var uuid = $rootScope.state.user ? $rootScope.state.user.uuid:undefined;

        var newImage = {progress: '0%' };
        $scope.imageBag.push(newImage);

        Upload.upload({
            url: '/api/photo/upload',
            method: 'POST',
            file:file,
            data: {'uuid': uuid}
        }).then(function (resp) {

            $log.debug(resp.data);
            newImage.imgSrc = resp.data.imgSrc;
            newImage.imgId = resp.data.imgId;
            newImage.width = resp.data.width;
            newImage.height = resp.data.height;
            newImage.quantity=1;


        }, function (resp) {
            $log.debug('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $log.debug('progress: ' + progressPercentage + '% ' );
            newImage.progress = progressPercentage +'%';
        });
        //http://localhost:3000/repo/d9f5acf0-9f98-11e5-85e5-8337cc274d49.JPG

       /* $timeout(function(){
            //newImage.imgSrc = "http://localhost:3000/repo/d9f5acf0-9f98-11e5-85e5-8337cc274d49.JPG";
        },5000);*/
    }

    $scope.uploadFiles = function(files){

        angular.forEach(files, function(file){
           $scope.upload(file);
        });
    }

    $scope.checkout = function(){
        if($scope.totalPhoto >0){
            $rootScope.cartImages =$rootScope.cartImages || [];
            var newProducs =[];

            angular.forEach($scope.imageBag,function(product){
                if(product.quantity > 0){
                    product.paperFinish = $scope.globalPaperFinish;
                    $rootScope.cartImages.push(product);
                    newProducs.push(product);
                }
            });

            if($rootScope.loggedIn){
                OrderService.saveCart(newProducs)
                    .then(function(data){

                        localStorageService.remove("cart");
                        $rootScope.retrieveCart();


                    },function(err){
                        $log.debug('erro saving cart...');
                        $rootScope.$broadcast('api_error',err);
                    });

            }else{
                localStorageService.set("cart", $rootScope.cartImages );
            }


            $state.go("checkout")
        }


    }

    $scope.updateTotal = function(){

        $scope.totalPrice=0;
        angular.forEach($scope.imageBag, function(m){
            $scope.totalPrice  += m.format.price* m.quantity;
        })
    }

    $scope.generateId = function(){
        var id = "8-"+Math.floor((Math.random() * 100) + 1)+"-"+Math.floor((Math.random() * 100) + 1);
        return id;
    }

    var galleryModal ;
    $scope.openGallery = function(){
        galleryModal = $modal({scope: $scope, templateUrl: 'modules/upload/tmpl/modal/gallery-modal.html', show: true});

    }

    $scope.addImport = function(){
        angular.forEach($scope.galleryBag, function(item){
            if(item.import){
                var present = false;

                angular.forEach($scope.imageBag, function(bagItem){
                    if(bagItem.id == item.id){
                        present = true;
                    }
                })
                if(!present){

                    item.quantity=1;
                    $scope.imageBag.push(item);
                }

            }

        });
    }
    $scope.deleteImageFromBag = function(index){
        $scope.imageBag.splice(index,1);
    }
    $rootScope.$watch('loggedIn',function(){
            if($rootScope.loggedIn){
                $log.debug('user logged in ');
                PhotoService.getGallery().
                then(function(data){
                    $scope.galleryBag = data;

                },function(err){
                    $rootScope.$broadcast('api_error',err);
                });

            }else{
                $log.debug('user logged out ');
            }

        });

    //image quality checking
    $scope.qualityMap = {"9x13": {excellent:{height:500, width:600},good:{height:400, width:500}, poor:{height:300, width:400}},
            "10x15": {excellent:{height:800, width:1000},good:{height:600, width:800}, poor:{height:400, width:600}}};

    $scope.getImageQuality = function(frameSize, heigh, width){

        var arr = frameSize.split('x');
        var fheight = parseInt(arr[0]);
        var fwidth = parseInt(arr[1]);
        if((heigh >= 120*fheight && width >= 120*fwidth) || (width >= 120*fheight && heigh >= 120*fwidth)){
            return "excellent";
        }else if((heigh >= 80*fheight && width >= 80*fwidth) || (width >= 80*fheight && heigh >= 80*fwidth)){
            return "good";
        }else{
            return "poor";
        }
    }

    $scope.updateGlobalFormat = function(format){
        $log.debug('updated global format '+ format.frameSize);
        angular.forEach($scope.imageBag, function(uploadedImage){
            uploadedImage.format = format;
        });

        $scope.updateTotal();
    }

}]);