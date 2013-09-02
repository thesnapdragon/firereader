'use strict';

angular.module('firereaderApp').controller('IndexCtrl', ['$scope', '$http', 'Store', '$rootScope', '$location', '$translate', function ($scope, $http, Store, $rootScope, $location, $translate) {

    $scope.subscriptions = null;
    $scope.unreadAll = 0;

    $scope.init = function() {
        var language = window.navigator.userLanguage || window.navigator.language;
        try {
            $translate.uses('hu-HU');
        } catch (error) {
            $translate.uses("en-US");
        }

        Store.getDb("Store.query", ["subscriptions"]);

        // if older than 3 minutes get subscriptions
        var now = new Date();
        if (localStorage.fireReaderSubscriptionsLastFetched == null ||
            localStorage.fireReaderSubscriptionsLastFetched == undefined) {

            var last = new Date(localStorage.fireReaderSubscriptionsLastFetched);
            if (last.getTime() + 3*60000 < now.getTime()) {
                $scope.getSubscriptions();
            }
        }

        $scope.getUnreadCount();
    };

    $rootScope.$on("subscriptions.queryresult", function(event, value) {
        $scope.subscriptions = value;
    });

    $rootScope.$on("subscriptions.noqueryresult", function(event, value) {
        $scope.getSubscriptions();
    });

    $scope.goToSubscription = function(subscription) {
        $rootScope.goToSubscription = subscription.id;
    };

    $scope.getSubscriptions = function() {
        var authtoken = "";
        if (typeof(Storage) !== undefined) {
            authtoken = localStorage.fireReaderAuthtoken;
            if (authtoken != "" && authtoken != undefined) {
                var url = "http://thesnapdragon.herokuapp.com/subscriptions?callback=JSON_CALLBACK&authtoken=" + authtoken;

                $http.jsonp(url).
                success(function(data) {
                    $scope.subscriptions = data.subscriptions;
                    Store.getDb("Store.delete", ["subscriptions"]);
                    Store.getDb("Store.add", ["subscriptions", $scope.subscriptions]);
                    localStorage.fireReaderSubscriptionsLastFetched = new Date();
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
    };

    $scope.getUnreadCount = function() {
        var authtoken = "";
        if (typeof(Storage) !== undefined) {
            authtoken = localStorage.fireReaderAuthtoken;
            if (authtoken != "" && authtoken != undefined) {
                var url = "http://thesnapdragon.herokuapp.com/unread-count?callback=JSON_CALLBACK&authtoken=" + authtoken;

                $http.jsonp(url).
                success(function(data) {
                    if (data.unreadcounts != undefined) {
                        $scope.unreadAll = data.max;
                        $scope.subscriptions.forEach(function(subscription) {
                            data.unreadcounts.forEach(function(entry) {
                                if (subscription.id == entry.id) {
                                    subscription.unreadcount = entry.count;
                                }
                            });
                        });
                    } else {
                        utils.status.show($translate('ERROR_CONNECTING'));
                    }
                }).
                error(function(data, status, headers, config) {
                    utils.status.show($translate('ERROR_CONNECTING'));
                });
            }
        } else {
            utils.status.show($translate('ERROR_BROWSER_NOT_SUPPORTED'));
        }
    };

    $scope.refresh = function() {
        $scope.getUnreadCount();
    };

    $scope.whatIsThisIndex = function(control) {
        switch(control) {
            case "settings":
                utils.status.show($translate('WHATIS_SETTINGS'));
                break;
            case "refresh":
                utils.status.show($translate('WHATIS_REFRESH'));
                break;
        }
    };

}]);
