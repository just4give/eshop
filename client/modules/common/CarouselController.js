/**
 * Created by mithundas on 12/3/15.
 */
appModule.controller("carouselController",["$scope","$log","$interval",function($scope,$log,$interval){
    $scope.slides = [
        {image: 'images/img000.png', description: 'Image 00'},
        {image: 'images/img001.png', description: 'Image 01'},
        {image: 'images/img002.png', description: 'Image 02'}
    ];

    $scope.direction = 'left';
    $scope.currentIndex = 0;

    $scope.setCurrentSlideIndex = function (index) {
        $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
        $scope.currentIndex = index;
    };

    $scope.isCurrentSlideIndex = function (index) {
        return $scope.currentIndex === index;
    };

    $scope.prevSlide = function () {
        $scope.direction = 'left';
        $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
    };

    $scope.nextSlide = function () {
        $scope.direction = 'right';
        $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
    };

    $interval(function(){
        $scope.prevSlide();
    },5000);
}]);

appModule.animation('.slide-animation', ["$log",function ($log) {
    return {
        beforeAddClass: function (element, className, done) {
            var scope = element.scope();
            $log.debug(element);
            if (className == 'ng-hide') {
                var finishPoint = element.parent().width();
                if(scope.direction !== 'right') {
                    finishPoint = -finishPoint;
                }
                $log.debug("finish "+finishPoint);
                TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
            }
            else {
                done();
            }
        },
        removeClass: function (element, className, done) {
            var scope = element.scope();
            $log.debug(element);
            if (className == 'ng-hide') {
                element.removeClass('ng-hide');

                var startPoint = element.parent().width();
                if(scope.direction === 'right') {
                    startPoint = -startPoint;
                }
                $log.debug("start "+startPoint);
                TweenMax.fromTo(element, 0.5, { left: startPoint }, {left: 0, onComplete: done });
            }
            else {
                done();
            }
        }
    };
}]);

appModule.controller('CarouselDemoCtrl', function ($scope) {
    $scope.myInterval = 10000;
    $scope.noWrapSlides = false;
    var slides = $scope.slides = [ {image:'images/img000.png', text:"Stealing Deals on HD TVs. ",
        text2:"Everyday is christmas. Find your perfect TV today.",
        link:{text:"Buy", href:"/#/xyz"}},
        {image:'images/img001.png', text:"Give yourself the true power of computing. ",
        text2:"Browse wide range of Macbook options and pick yours.",
        link:{text:"Buy Mac", href:"/#/xyz"}},
        {image:'images/img002.png', text:"Windows laptop and tablets ",
        text2:"Power of widows and portability of tablet together. Surface is the next big gadget you should consider.",
        link:{text:"Buy", href:"/#/xyz"}}];

});