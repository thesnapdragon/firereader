'use strict';

angular.module('firereaderApp').controller('SettingsCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

    // model datas
    $scope.email = '';
    $scope.password = '';

    // needed in view
    $scope.authenticated = false;

    $scope.init = function() {
        if (typeof(Storage) !== "undefined") {
            if (localStorage.fireReaderAuthtoken == undefined || localStorage.fireReaderAuthtoken == '') {
                $scope.authenticated = false;
            } else {
                $scope.authenticated = true;
            }
            if (localStorage.fireReaderSettings != undefined) {
                $rootScope.settings = JSON.parse(localStorage.fireReaderSettings);
            }
        } else {
            utils.status.show("Browser not supported!");
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
                    $scope.authenticated = true;
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
            if (localStorage.fireReaderAuthtoken == undefined || localStorage.fireReaderAuthtoken == '') {
                $scope.authenticated = null;
            } else {
                localStorage.fireReaderAuthtoken = '';
                $scope.authenticated = null;
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
