'use strict';

angular.module('firereaderApp').filter('subscriptionname', function () {
    return function(input, long) {
        if (input == undefined) return;
        var subscriptionname = input;
        if (subscriptionname.length > long) {
            subscriptionname = subscriptionname.slice(0, long);
            subscriptionname = subscriptionname.concat("...");
        }
        return subscriptionname;
    };
});
