'use strict';

angular.module('firereaderApp').controller('SettingsCtrl', ['$scope', '$rootScope', '$http', '$translate', function ($scope, $rootScope, $http, $translate) {

    $scope.init = function() {
        if ($rootScope.settings == undefined) {
            $rootScope.settings = {
                unreadSetting: true,
            };
        }

        if ($rootScope.settings.authenticated == undefined) {
            $rootScope.settings.authenticated = false;
        }

        if (typeof(Storage) !== "undefined") {
            if (localStorage.fireReaderAuthtoken == undefined || localStorage.fireReaderAuthtoken == '') {
                $rootScope.settings.authenticated = false;
            } else {
                $rootScope.settings.authenticated = true;
            }
            if (localStorage.fireReaderSettings != undefined) {
                try {
                    $rootScope.settings = JSON.parse(localStorage.fireReaderSettings);
                } catch (error) {
                    utils.status.show($translate('ERROR_PARSING_SETTINGS'));
                }
            }
        } else {
            utils.status.show($translate('ERROR_BROWSER_NOT_SUPPORTED'));
        }
    };

    $scope.$watch('settings', function() {
        localStorage.fireReaderSettings = JSON.stringify($rootScope.settings);
    }, true);

    $scope.authenticate = function() {
        var getauthtokenparams = {"email" : $scope.email, "password": $scope.password};
        var url = "http://thesnapdragon.herokuapp.com/authtoken?callback=JSON_CALLBACK&" + $.param(getauthtokenparams);

        $http.jsonp(url).
        success(function(data) {
            if (data.authtoken != undefined && data.authtoken != "") {
                if (typeof(Storage) !== "undefined") {
                    localStorage.fireReaderAuthtoken = data.authtoken;
                    $rootScope.settings.authenticated = true;
                } else {
                    utils.status.show("Browser not supported!");
                }
            } else {
                utils.status.show("Email or password not correct!");
            }
        }).
        error(function(data, status, headers, config) {
            utils.status.show("Email or password not correct!");
        });
    };

    $scope.logout = function() {
        if (typeof(Storage) !== "undefined") {
            if (localStorage.fireReaderAuthtoken != undefined && localStorage.fireReaderAuthtoken != '') {
                localStorage.fireReaderAuthtoken = '';
                $rootScope.settings.authenticated = false;
            }
        } else {
            utils.status.show("Browser not supported!");
        }
    };

    $scope.clearemail = function() {
        $scope.email = "";
    };

    $scope.clearpassword = function() {
        $scope.password = "";
    };
}]);
