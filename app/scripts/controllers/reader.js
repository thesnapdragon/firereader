'use strict';

angular.module('firereaderApp').controller('ReaderCtrl', ['$scope', '$http', '$rootScope', '$translate', function ($scope, $http, $rootScope, $translate) {
    $scope.markAsRead = function() {
        var idx = $rootScope.feeds[$rootScope.currentPageParam].categories.indexOf('user/-/state/com.google/fresh');
        if (idx != -1) {
            var authtoken = "";
            if (typeof(Storage) !== "undefined") {
                authtoken = localStorage.fireReaderAuthtoken;
                if (authtoken != "" && authtoken != undefined) {
                    var markunreadparams = {"authtoken": authtoken, "ids": $rootScope.feeds[$rootScope.currentPageParam].id.substr(32,24)};
                    var url = "http://thesnapdragon.herokuapp.com/mark-unread?callback=JSON_CALLBACK&" + $.param(markunreadparams);

                    $http.jsonp(url).
                        success(function(data) {
                            if (data != "OK") {
                                utils.status.show($translate('ERROR_CONNECTING'));
                            } else {
                                $rootScope.feeds[$rootScope.currentPageParam].categories[idx] = 'user/-/state/com.google/read';
                            }
                        }).
                        error(function(data, status, headers, config) {
                            utils.status.show($translate('ERROR_CONNECTING'));
                        });
                } else {
                    utils.status.show($translate('ERROR_NOT_LOGGED_IN'));
                }
            } else {
                utils.status.show($translate('ERROR_BROWSER_NOT_SUPPORTED'));
            }
        }
    };
}]);

