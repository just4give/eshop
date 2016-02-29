
admin.controller("ProductController",["$scope","$rootScope","$log","$modal","$state", "toaster","Product","$confirm",
    function($scope,$rootScope,$log,$modal,$state,toaster,Product,$confirm){

        $scope.sortKey ="name";
        $scope.reverse =true;


        $scope.sort = function(keyname){
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }

        Product.query(function(data){
            $scope.records = data;
        })

        $scope.edit = function(id){
            $state.go("home.product-detail",{id:id});
        }
        $scope.create = function(){
            $state.go("home.product-detail",{id:-1});
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

    }]);

admin.controller("ProductDetailsController",["$scope","$rootScope","$log","$modal","$state", "toaster","Upload","$window",
    "Product","Tax","Photo","$stateParams","$confirm",
    function($scope,$rootScope,$log,$modal,$state,toaster,Upload,$window,Product,Tax,Photo,$stateParams,$confirm){



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

        if($stateParams.id >0){
            Product.get({id:$stateParams.id},function(data){
                $scope.product= data;
                $scope.slides=[];
                $scope.slides.push(data.photo);
            })
        }else{
            $scope.product = new Product();
        }

        Tax.query(function(data){
            $scope.taxes = data;
        })


        $scope.save = function(){

            if($scope.product.id){
                $scope.product.$update(function(data){
                    $log.debug(data);
                    toaster.pop("info","","Tax details updated");

                    $state.go("home.products");
                })

            }else{
                $scope.product.$save(function(data){
                    $log.debug(data);
                    toaster.pop("info","","Tax details created");

                    $state.go("home.products");
                })
            }

        }

        $scope.deletePhoto = function(r){
            $confirm({text: 'You are going to delete the record.' ,ok:"Yes,delete",cancel:"Cancel" , title:"Delete?"})
                .then(function() {
                    var index = _.findIndex($scope.slides, r);

                    Photo.get({id:r.id},function(photo){
                        photo.$delete(function(data){
                            $scope.slides.splice(index,1);
                            toaster.pop("info","","Record deleted");
                        },function(err){
                            $log.debug(err);
                            toaster.pop("error","",err.data.message);
                        });
                    })


                });
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