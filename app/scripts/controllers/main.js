'use strict';

angular.module('firereaderApp').controller('MainCtrl', ['$scope', '$location', '$http', 'Store', '$rootScope', '$translate', '$timeout', function ($scope, $location, $http, Store, $rootScope, $translate, $timeout) {

    $scope.location = $location;

    $scope.initMain = function() {
        $timeout($rootScope.getFeeds, 1000);
        $rootScope.dontLoad = false;

        if ($rootScope.feedsRead == undefined) {
            $rootScope.feedsRead = 0;
        }
    };

    $rootScope.$watch('currentPage + currentPageParam', function() {
        $timeout($scope.router, 100);
    }, true);

    $rootScope.$watch('settings.unreadSetting', function() {
        if ($rootScope.settings == undefined || $rootScope.feeds == undefined || $rootScope.currentPage == 'previous') return;
        $rootScope.continuation = null;
        $rootScope.feeds = [];
        $rootScope.feedsLoaded = 0;
        $rootScope.feedsRead = 0;
        $timeout($scope.router, 100);
    }, true);

    $scope.router = function() {
        switch($rootScope.currentPage) {
            case 'settings':
                $location.path('/settings').search("");
                break;
            case 'main':
                $location.path('/').search("");
                $rootScope.continuation = null;
                $rootScope.feeds = [];
                $rootScope.feedsLoaded = 0;
                $rootScope.feedsRead = 0;
                $rootScope.getFeeds($rootScope.currentPageParam);
                break;
            case 'reader':
                $location.path('/reader').search("");
                break;
            case 'previous':
                $location.path('/').search("");
                break;
        }
    };

    $rootScope.disableLoading = function() {
        $rootScope.dontLoad = true;
    };

    $rootScope.getFeeds = function(subscriptionId) {
        if ($rootScope.dontLoad) {
            $rootScope.dontLoad = false;
            return;
        }
        if (!$rootScope.settings.authenticated) {
            utils.status.show($translate('ERROR_NOT_LOGGED_IN'));
            return;
        }
        if ($rootScope.continuation == -1) {
            console.log("no more feed");
            return;
        }
        if (!$rootScope.DBOpened || $rootScope.canLoadMoreFeed == 0) return;
        if ($rootScope.feeds == undefined) {
            $rootScope.feeds = [];
        }
        $rootScope.canLoadMoreFeed = 0;
        if (typeof(Storage) !== "undefined") {
            var authtoken = localStorage.fireReaderAuthtoken;
            if (authtoken != "" && authtoken != undefined) {
                $scope.subscriptionid = ($location.search()).subscriptionid;
                var getfeedparams = {"authtoken": authtoken, "subscriptionid": subscriptionId, "unread": $rootScope.settings.unreadSetting, "c": $rootScope.continuation, "n": 10};
                var url = "http://thesnapdragon.herokuapp.com/feed?callback=JSON_CALLBACK&" + $.param(getfeedparams);
                $http.jsonp(url).
                    success(function(data) {
                            if (data.items != undefined) {
                                $rootScope.feeds = $rootScope.feeds.concat(data.items);
                            }
                            $rootScope.feeds = $rootScope.feeds;
                            $rootScope.continuation = data.continuation == undefined ? -1 : data.continuation;
                            Store.getDb("Store.delete", ["feeds"]);
                            Store.getDb("Store.add", ["feeds", $rootScope.feeds]);
                            if (data.items != undefined) {
                                $rootScope.feedsLoaded += data.items.length;
                            }
                            if ($rootScope.continuation != -1) {
                                $rootScope.canLoadMoreFeed = 1;
                            } else {
                                $rootScope.canLoadMoreFeed = -1;
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
    };

    $scope.scrollCallback = function(event, isEndEvent) {
        if ($scope.currentPage != 'main') return;
        if (isEndEvent) {
            // load more feeds
            if (event.target.scrollTop + event.target.offsetHeight >= event.target.scrollHeight) {
                $("#loadMoreButton").click();
            }

            // mark as read
            var unreadList = [];
            // get max feed counter that is visible
            var maxRead = Math.round((event.target.scrollTop + event.target.offsetHeight) / (event.target.scrollHeight / $rootScope.feedsLoaded));
            if (maxRead > $rootScope.feedsLoaded) maxRead = $rootScope.feedsLoaded;

            // get all feedid that are unread
            for (var i = $rootScope.feedsRead; i < maxRead; i++) {
                var idx = $rootScope.feeds[i].categories.indexOf('user/-/state/com.google/fresh');
                if (idx != -1) {
                    unreadList.push($rootScope.feeds[i].id.substr(32,24));
                }
            }

            if (unreadList.length > 0) {
                var authtoken = "";
                if (typeof(Storage) !== "undefined") {
                    authtoken = localStorage.fireReaderAuthtoken;
                    if (authtoken != "" && authtoken != undefined) {
                        var markunreadparams = {"authtoken": authtoken, "ids": unreadList};
                        var url = "http://thesnapdragon.herokuapp.com/mark-unread?callback=JSON_CALLBACK&" + $.param(markunreadparams);

                        $http.jsonp(url).
                            success(function(data) {
                                if (data != "OK") {
                                    utils.status.show($translate('ERROR_CONNECTING'));
                                } else {
                                    // mark all feeds as read
                                    for (var i = $rootScope.feedsRead; i < maxRead - 1; i++) {
                                        var idx = $rootScope.feeds[i].categories.indexOf('user/-/state/com.google/fresh');
                                        if (idx != -1) {
                                            $rootScope.feeds[i].categories[idx] = 'user/-/state/com.google/read';
                                        }
                                        $rootScope.feedsRead = i;
                                    }
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
        }
    };

    $scope.pageLeft = function() {
        if ($rootScope.currentPage == 'reader') {
            if ($rootScope.currentPageParam < $rootScope.feedsLoaded - 1) {
                $rootScope.currentPageParam++;
                $rootScope.goToPage('reader', $rootScope.currentPageParam);
            }
        }
    };

    $scope.pageRight = function() {
        if ($rootScope.currentPage == 'reader') {
            if ($rootScope.currentPageParam > 0) {
                $rootScope.currentPageParam--;
                $rootScope.goToPage('reader', $rootScope.currentPageParam);
            }
        }
    };

    $scope.whatIsThisMain = function(control) {
        switch(control) {
            case "unread":
                utils.status.show($translate('WHATIS_UNREAD'));
                break;
            case "read":
                utils.status.show($translate('WHATIS_READ'));
                break;
            case "visit":
                utils.status.show($translate('WHATIS_VISIT'));
                break;
        }
    };

}]);
