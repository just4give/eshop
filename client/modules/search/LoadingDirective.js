/**
 * Created by mithun.das on 3/30/2016.
 */

appModule.directive('errSrc', function() {
    return {
        link: function(scope, element, attrs) {
            attrs.$set('src', attrs.loaderSrc);

            element.bind('error', function() {

                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});