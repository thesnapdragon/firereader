'use strict';

angular.module('firereaderApp').controller('IndexCtrl', ['$scope', '$http', 'Store', '$rootScope', '$location', '$translate', '$timeout', function ($scope, $http, Store, $rootScope, $location, $translate, $timeout) {

    $scope.init = function() {
        var language = window.navigator.userLanguage || window.navigator.language;
        try {
            $translate.uses(language);
        } catch (error) {
            $translate.uses("en-US");
        }

        if ($rootScope.settings == undefined) {
            if (typeof(Storage) !== "undefined") {
                if (localStorage.fireReaderSettings != undefined) {
                    try {
                        $rootScope.settings = JSON.parse(localStorage.fireReaderSettings);
                    } catch (error) {
                        utils.status.show($translate('ERROR_PARSING_SETTINGS'));
                    }
                } else {
                    $rootScope.settings = {
                        unreadSetting: true,
                    };
                }
            } else {
                utils.status.show($translate('ERROR_BROWSER_NOT_SUPPORTED'));
            }
        }

        if ($rootScope.currentPage == undefined) {
            $rootScope.currentPage = 'main';
        }

        if ($rootScope.currentPageParam == undefined) {
            $rootScope.currentPageParam = '';
        }

        if ($rootScope.allUnreadCount == undefined) {
            $rootScope.allUnreadCount = 0;
        }

        if ($rootScope.requestCounter == undefined) {
            $rootScope.requestCounter = 0;
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

        $timeout($scope.getUnreadCount, 1000);
    };

    $rootScope.$on("subscriptions.queryresult", function(event, value) {
        $rootScope.subscriptions = value;
    });

    $rootScope.$on("subscriptions.noqueryresult", function(event, value) {
        $scope.getSubscriptions();
        $scope.getUnreadCount();
    });

    $rootScope.goToPage = function(page, param, backParam) {
        if (backParam) {
            $rootScope.backParam = true;
        } else {
            if ($rootScope.backParam) {
                $rootScope.backParam = false;
                return;
            }
        }
        $rootScope.currentPage = page;
        $rootScope.currentPageParam = param;
    };

    $scope.getSubscriptions = function() {
        var authtoken = "";
        if (typeof(Storage) !== undefined) {
            authtoken = localStorage.fireReaderAuthtoken;
            if (authtoken != "" && authtoken != undefined) {
                $rootScope.requestCounter++;
                var url = "http://thesnapdragon.herokuapp.com/subscriptions?callback=JSON_CALLBACK&authtoken=" + authtoken;

                $http.jsonp(url).
                success(function(data) {
                    $rootScope.requestCounter--;
                    $rootScope.subscriptions = data.subscriptions;
                    Store.getDb("Store.delete", ["subscriptions"]);
                    Store.getDb("Store.add", ["subscriptions", $rootScope.subscriptions]);
                    localStorage.fireReaderSubscriptionsLastFetched = new Date();
                }).
                error(function(data, status, headers, config) {
                    $rootScope.requestCounter--;
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
        if ($rootScope.subscriptions == undefined) {
            $scope.getSubscriptions();
        }
        if (typeof(Storage) !== undefined) {
            var authtoken = localStorage.fireReaderAuthtoken;
            if (authtoken != "" && authtoken != undefined) {
                $rootScope.requestCounter++;
                var url = "http://thesnapdragon.herokuapp.com/unread-count?callback=JSON_CALLBACK&authtoken=" + authtoken;

                $http.jsonp(url).
                success(function(data) {
                    $rootScope.requestCounter--;
                    if (data.unreadcounts != undefined) {
                        $rootScope.allUnreadCount = data.max;
                        $rootScope.subscriptions.forEach(function(subscription) {
                            data.unreadcounts.forEach(function(entry) {
                                if (subscription.id == entry.id) {
                                    subscription.unreadCount = entry.count;
                                }
                            });
                        });
                    } else {
                        utils.status.show($translate('ERROR_CONNECTING'));
                    }
                }).
                error(function(data, status, headers, config) {
                    $rootScope.requestCounter--;
                    utils.status.show($translate('ERROR_CONNECTING'));
                });
            }
        } else {
            utils.status.show($translate('ERROR_BROWSER_NOT_SUPPORTED'));
        }
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
