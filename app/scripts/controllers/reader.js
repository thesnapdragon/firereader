'use strict';

angular.module('firereaderApp').controller('ReaderCtrl', ['$scope', '$location', 'Store', '$rootScope', function ($scope, $location, Store, $rootScope) {

    $scope.feedid = null;
    $scope.feed = null;

    $rootScope.$on("feeds.queryresult", function(event, value) {
        $scope.feed = value[$scope.feedid];
        $scope.$apply();
    });

    $rootScope.$on("feeds.noqueryresult", function(event, value) {
        // TODO
    });

    $scope.$watch('location.search()', function() {
        $scope.feedid = ($location.search()).feedid;
        Store.getDb("Store.query", ["feeds"]);
    }, true);

}]);

