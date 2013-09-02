'use strict';

angular.module('firereaderApp').directive('focus', function () {
    return {
        link: function(scope, element, attrs) {
            element[0].focus();
        }
    };
});
