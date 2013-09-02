'use strict';

angular.module('firereaderApp').controller('MainCtrl', ['$scope', '$location', '$http', 'Store', '$rootScope', '$translate', function ($scope, $location, $http, Store, $rootScope, $translate) {

    $scope.location = $location;
    $scope.feeds = [];
    $scope.continuation = null;
    $scope.reading = true;
    // 1: can load, 0: is loading, -1: can not load
    $scope.canLoadMoreFeed = 1;
    $rootScope.feedsLoaded = 0;
    $scope.feedsRead = 0;
    $scope.isOnSettingsPage = false;
    $scope.isOnMainPage = false;
    $scope.unread = true;

    $rootScope.settings = {
        unreadSetting: true,
    };

    // GET param: subscriptionid
    $scope.subscriptionid = null;

    $scope.$watch('location.search()', function() {
        // if settings button pressed go to login
        if (($location.search()).settings != undefined) {
            $location.path('/settings').search("");
        }

        if (($location.search()).dontload != undefined) {
            var subscriptionid = $rootScope.goToSubscription == undefined ? "" : $rootScope.goToSubscription;
            $location.search("subscriptionid=" + subscriptionid);
        }

        if ($location.search().subscriptionid != undefined) {
            $scope.subscriptionid = $location.search().subscriptionid;
        }

        if ($location.search().subscriptionid == undefined || $location.search().subscriptionid == "") {
            $scope.isOnMainPage = true;
        }

        if ($location.search().unread != undefined) {
            $scope.unread = $location.search().unread;
        } else {
            $scope.unread = $rootScope.settings.unreadSetting;
        }

        if ($location.path() == "/settings") {
            $scope.isOnSettingsPage = true;
        } else {
            $scope.isOnSettingsPage = false;
        }

        if ($location.path() == "/reader") {
            $scope.reading = true;
        } else {
            $scope.backPath = $location.path();
            $scope.backSearch = $location.search();
            $scope.reading = false;
        }

        if ($location.path() != "/reader" && $location.path() != "/settings") {
            $scope.loadMoreFeeds();
        }

    }, true);

    $scope.$watch('rootScope.settings', function() {
        $scope.unread = $rootScope.settings.unreadSetting;
    }, true);

    $scope.loadMoreFeeds = function() {
        if ($rootScope.DBOpened != true) return;
        if ($scope.continuation != -1) {
            $scope.canLoadMoreFeed = 0;
            var authtoken = "";
            if (typeof(Storage) !== "undefined") {
                authtoken = localStorage.fireReaderAuthtoken;
                if (authtoken != "" && authtoken != undefined) {
                    $scope.subscriptionid = ($location.search()).subscriptionid;
                    var getfeedparams = {"authtoken": authtoken, "subscriptionid": $scope.subscriptionid, "unread": $scope.unread, "c": $scope.continuation, "n": 10};
                    var url = "http://thesnapdragon.herokuapp.com/feed?callback=JSON_CALLBACK&" + $.param(getfeedparams);

                    $http.jsonp(url).
                        success(function(data) {
                                $scope.feeds = $scope.feeds.concat(data.items);
                                $rootScope.feeds = $scope.feeds;
                                $scope.continuation = data.continuation == undefined ? -1 : data.continuation;
                                Store.getDb("Store.delete", ["feeds"]);
                                Store.getDb("Store.add", ["feeds", $scope.feeds]);
                                if (data.items != undefined) {
                                    $rootScope.feedsLoaded += data.items.length;
                                }
                                if ($scope.continuation != -1) {
                                    $scope.canLoadMoreFeed = 1;
                                } else {
                                    $scope.canLoadMoreFeed = -1;
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
        } else {
            $scope.canLoadMoreFeed = -1;
        }
    };

    $scope.goBack = function() {
        $location.path($scope.backPath).search($scope.backSearch);
    };

    $scope.setUnread = function(unread) {
        if ($scope.subscriptionid == undefined) $scope.subscriptionid = "";
        $location.search("subscriptionid=" + $scope.subscriptionid +"&unread=" + unread);
    };

    $scope.goTo = function(url) {
        var unread = $location.search().unread;
        if (unread == undefined) unread = true;
        $location.search("subscriptionid=" + url + "&unread=" + unread);
    };

    $scope.readFeed = function(id) {
        $location.path("/reader").search("feedid=" + id);
    };

    $scope.scrollCallback = function(event, isEndEvent) {
        if ($scope.reading || $scope.isOnSettingsPage) return;
        if (isEndEvent) {
            // load more feeds
            if (event.target.scrollTop + event.target.offsetHeight >= event.target.scrollHeight) {
                $("#loadMoreButton").click();
            }

            // mark as read
            var unreadList = [];
            // get max feed counter that is visible
            var maxRead = Math.round((event.target.scrollTop + event.target.offsetHeight) / (event.target.scrollHeight / $scope.feedsLoaded)) - 1;
            if (maxRead > $scope.feedsLoaded) maxRead = $scope.feedsLoaded;

            // get all feedid that are unread
            for (var i = $scope.feedsRead; i < maxRead; i++) {
                var idx = $rootScope.feeds[i].categories.indexOf('user/-/state/com.google/fresh');
                if (idx != -1) {
                    $rootScope.feeds[i].categories[idx] = 'user/-/state/com.google/read';
                    unreadList.push($rootScope.feeds[i].id.substr(32,24));
                }
                $scope.feedsRead = i;
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
                                }
                            }).
                            error(function(data, status, headers, config) {
                                utils.status.show($translate('ERROR_CONNECTING'));
                            });
                    } else {
                        utils.status.show($translate('ERROR_BROWSER_NOT_SUPPORTED'));
                    }
                } else {
                    $scope.canLoadMoreFeed = -1;
                }
            }
        }
    };

    $scope.pageLeft = function() {
        if ($scope.reading) {
            var id = $location.search().feedid;
            var numberId = parseInt(id);
            if (numberId < $rootScope.feedsLoaded - 1) {
                $location.path("/reader").search("feedid=" + (numberId + 1));
            }
        }
    };

    $scope.pageRight = function() {
        if ($scope.reading) {
            var id = $location.search().feedid;
            var numberId = parseInt(id);
            if (numberId > 0) {
                $location.path("/reader").search("feedid=" + (numberId - 1));
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
        }
    };

}]);
