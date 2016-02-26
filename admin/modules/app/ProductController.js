/**
 * Created by Mithun.Das on 12/4/2015.
 */
admin.controller("ProductController",["$scope","$rootScope","$log","$modal","$state", "toaster","Upload",
    function($scope,$rootScope,$log,$modal,$state,toaster,Upload){

    $scope.product={};

    $scope.taxes = [{id:1, name:'Electronics Tax', pct:6.5},{id:2, name:'Apparel Tax', pct:4.5}];

        $scope.upload = function(file,cnt){

            $rootScope.productImages = $rootScope.productImages||[];
            $log.debug('****'+file);

            if(!file ||file.$error){
                //$scope.modalErrorMessage = 'Image size can not be more than 10MB';
                $rootScope.uploadMap[cnt]=false;
                return;
            }



            var newImage = {progress: '0%' };
            $rootScope.productImages.push(newImage);

            Upload.upload({
                url: '/api/photo/upload',
                method: 'POST',
                file:file
            }).then(function (resp) {

                $log.debug(resp.data);
                newImage.imgSrc = resp.data.imgSrc;
                newImage.imgId = resp.data.imgId;
                newImage.width = resp.data.width;
                newImage.height = resp.data.height;


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

}]);