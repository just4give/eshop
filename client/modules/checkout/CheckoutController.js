/**
 * Created by Mithun.Das on 12/7/2015.
 */
appModule.controller("CheckoutController",["$scope","$rootScope","$log","$modal","$state", "$interval","$confirm","OrderService","PhotoService",
    function($scope,$rootScope,$log,$modal,$state,$interval,$confirm,OrderService,PhotoService){

    $log.debug('initializing CheckoutController');
    $scope.step ="shipping";
    $scope.card = {
        samebilling: 'yes'
    }

    $scope.changeStep = function(nextStep){
        $scope.step = nextStep;
    }

    $scope.openAddressPopup = function(mode){

        $scope.address ={};
        var modal = $modal({scope: $scope, templateUrl: 'modules/checkout/tmpl/modal/address-modal.html', show: true});
    }

    }]);

