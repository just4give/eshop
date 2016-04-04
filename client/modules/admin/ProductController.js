
appModule.controller("ProductController",["$scope","$rootScope","$log","$modal","$state", "toaster","Product","$confirm",
    function($scope,$rootScope,$log,$modal,$state,toaster,Product,$confirm){

        $scope.sortKey ="name";
        $scope.reverse =true;


        $scope.sort = function(keyname){
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }

        Product.query(function(data,headers){
            var rangeFields = headers('Content-Range').split(/\s|-|\//);
            $scope.totalRecords = parseInt(rangeFields[3]);
            $log.debug("Total ",$scope.totalRecords);
            $scope.records = data;
        })

        $scope.edit = function(id){
            $state.go("admin.product-detail",{id:id});
        }
        $scope.create = function(){
            $state.go("admin.product-detail",{id:-1});
        }
        $scope.delete = function(r){
            $confirm({text: 'You are going to delete the record.' ,ok:"Yes,delete",cancel:"Cancel" , title:"Delete?"})
                .then(function() {
                    var index = _.findIndex($scope.records, r);
                    r.$delete(function(data){
                        $scope.records.splice(index,1);
                        toaster.pop("info","","Record deleted");
                    });
                });
        }
        $scope.toggleStatus = function(r){

            var index = _.findIndex($scope.records, r);
            r.active = !r.active;
            r.$update(function(data){
                $scope.records[index]=data;
                toaster.pop("info","","Status updated");
            });

        }

    }]);

appModule.controller("ProductDetailsController",["$scope","$rootScope","$log","$modal","$state", "toaster","Upload","$window",
    "Product","Tax","Photo","Category","Merchandise","$stateParams","$confirm","$timeout","ProductGallery",
    function($scope,$rootScope,$log,$modal,$state,toaster,Upload,$window,Product,Tax,Photo,Category,Merchandise,$stateParams,
             $confirm,$timeout,ProductGallery){



        $scope.slides=[];

        $scope.upload = function(file,cnt){

            $scope.slides = $scope.slides||[];


            if(!file ||file.$error){
                //$scope.modalErrorMessage = 'Image size can not be more than 10MB';
                $rootScope.uploadMap[cnt]=false;
                return;
            }

            if($scope.slides.length >=1){

                toaster.pop("info","","You are limited to upload only 1 image per product");
                return;
            }

            var newImage = {progress: '0%' };
            $scope.slides.push(newImage);

            Upload.upload({
                url: '/api/photo/upload',
                method: 'POST',
                file:file
            }).then(function (resp) {

                $log.debug(resp.data);
                newImage.imageUrl = resp.data.imageUrl;
                newImage.id = resp.data.id;



            }, function (resp) {

            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

                newImage.progress = progressPercentage +'%';
            });

        }


        $scope.uploadFiles = function(files){
            var cnt=1;
            $rootScope.uploadMap = new Object();
            angular.forEach(files, function(file){
                $rootScope.uploadMap[cnt]= true;
                $scope.upload(file,cnt++);
            });
        }

        $scope.uploadProductImage = function(file){
           if(!file ||file.$error){
                return;
            }
            var newImage = {progress: '0%',imageUrl:undefined };
            var existingPhoto = $scope.product.photo;
            $scope.product.photo=newImage;

            Upload.upload({
                url: '/api/photo/upload',
                method: 'POST',
                file:file
            }).then(function (resp) {
                   $log.debug(resp.data);
                    newImage.imageUrl = resp.data.imageUrl;
                    newImage.id = resp.data.id;
                    $scope.product.photo = resp.data;
                    $scope.product.photoId= resp.data.id;

                    if($scope.product.id >0) {
                        $scope.product.$update(function (data) {
                            $log.debug("updated product");
                            $log.debug(data);
                            $scope.product.photo = resp.data;
                            if (existingPhoto) {
                                Photo.get({id: existingPhoto.id}, function (photo) {
                                    photo.$delete(function (data) {

                                    }, function (err) {

                                    });
                                })
                            }
                        })
                    }
          }, function (err) {
                if(existingPhoto){
                    $scope.product.photo =$scope.product.photo;
                }
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

                newImage.progress = progressPercentage +'%';
            });

        }

        $scope.uploadProductAdditionalImage = function(file){

            if(!$scope.product.id ){
                toaster.pop("info","","Please save the product before you upload additional photos");
                return;
            }
            if(!file ||file.$error){
                return;
            }
            $scope.product.productGalleries = $scope.product.productGalleries || [];
            var newImage = {progress: '0%',imageUrl:undefined };
            var index = $scope.product.productGalleries.length;
            $scope.product.productGalleries.push(new ProductGallery());
            $scope.product.productGalleries[index].photo = newImage;
            $scope.product.productGalleries[index].productId=$scope.product.id;

            Upload.upload({
                url: '/api/photo/upload',
                method: 'POST',
                file:file
            }).then(function (resp) {
                $log.debug(resp.data);
                newImage.imageUrl = resp.data.imageUrl;
                newImage.id = resp.data.id;
                $scope.product.productGalleries[index].photoId= resp.data.id;
                $scope.product.productGalleries[index].$save(function(data){
                    $log.debug("productGalleries saved");
                    $scope.product.productGalleries[index].photo = newImage;
                })

            }, function (err) {

            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

                newImage.progress = progressPercentage +'%';
            });

        }

        if($stateParams.id >0){
            Product.get({id:$stateParams.id},function(data){
                $scope.product= data;
                $scope.slides=[];
                $scope.slides.push(data.photo);
            })
        }else{
            $scope.product = new Product();
        }

        Tax.query({active:true},function(data){
            $scope.taxes = data;
        })
        Category.query({active:true},function(data){
            $scope.categories = data;
        })
        Merchandise.query({active:true},function(data){
            $scope.merchandises=data;
        })

        $scope.save = function(){

            if($scope.product.id){
                $scope.product.$update(function(data){
                    $log.debug(data);
                    toaster.pop("info","","Product  updated");

                    $state.go("admin.products");
                })

            }else{
                $scope.product.$save(function(data){
                    $log.debug(data);
                    toaster.pop("info","","Product  created");

                    $state.go("admin.products");
                })
            }

        }

        $scope.deleteGalleryPhoto = function(r){
            $confirm({text: 'You are going to delete the record.' ,ok:"Yes,delete",cancel:"Cancel" , title:"Delete?"})
                .then(function() {
                    var index = _.findIndex( $scope.product.productGalleries, r);
                    var photoGallery = $scope.product.productGalleries[index];
                    var photoId = photoGallery.photoId;

                    ProductGallery.delete({id: photoGallery.id},function(data){
                        Photo.get({id: photoId}, function (photo) {
                            photo.$delete(function (data) {
                                $scope.product.productGalleries.splice(index,1);
                                toaster.pop("info","","Record deleted");

                            }, function (err) {

                            });
                        })


                        },function(err){
                            $log.debug(err);
                            toaster.pop("error","",err.data.message);
                        });



                });
        }

        $scope.priceCopy = function(product){
            if(!product.price){
                product.price=product.regularPrice;
            }
        }
  /*      var overlay =  $("#image-slider .overlay");
        var slider =  $("#image-slider");
        var sliderW = slider.width();
        var imageDisplayed = Math.floor(sliderW/210);
        overlay.width($scope.slides.length*210);
        var maxLeft=($scope.slides.length - imageDisplayed)*-210;
            angular.element($window).bind('resize', function(){
            sliderW = slider.width();
            imageDisplayed = sliderW/210;
            maxLeft=   ($scope.slides.length - imageDisplayed)*-210;
        });


        $scope.slideLeft= function(){

            var leftPos = overlay.position().left;
            $log.debug("left=" + leftPos);
            if(leftPos<=-100){
                overlay.css('left', leftPos+ 210);
            }
        }

        $scope.slideRight = function(){
            var leftPos = overlay.position().left;
            $log.debug("left=" + leftPos );
            if(leftPos> maxLeft){
                overlay.css('left', leftPos-210);
            }
        }*/

    }]);