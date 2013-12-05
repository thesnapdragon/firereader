'use strict';

angular.module('firereaderApp').directive('prepareFeed', [ '$timeout', '$rootScope', function ($timeout, $rootScope) {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            $timeout(function() {
                element.find("a").attr("target", "_blank");
            });
            if (scope.$index == $rootScope.currentPageParam) {
                $timeout(function() {
                    $("#slidebox")[0].slideTo($rootScope.currentPageParam);
                });
            }
        }
    };
  }]);
