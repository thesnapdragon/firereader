'use strict';

var INTERVAL_DELAY = 150;

angular.module('firereaderApp').directive('infiniteScroll', ['$parse', '$window', function($parse, $window) {
    return {
        link: function(scope, elm, attr) {
            var raw = elm[0];
            var fn = $parse(attr.infiniteScroll);
            var last, interval;

            var bindScroll = function() {
                elm.bind('scroll', function(event) {
                    last = raw.scrollTop;

                    startInterval(event);
                    unbindScroll();
                    scrollTrigger(event, false);
                });
            };

            var startInterval = function(event) {
                interval = $window.setInterval(function() {
                    if(last == raw.scrollTop) {
                        $window.clearInterval(interval);
                        bindScroll();
                        scrollTrigger(event, true);
                    } else {
                        last = raw.scrollTop;
                    }
                }, INTERVAL_DELAY);
            };

            var unbindScroll = function() {
                elm.unbind('scroll');
            };

            var scrollTrigger = function(event, isEndEvent) {
                fn(scope, {$event: event, isEndEvent: isEndEvent});
            };

            bindScroll();
        }
    }
}]);
