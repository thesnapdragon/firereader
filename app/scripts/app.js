'use strict';

angular.module('firereaderApp', ['pascalprecht.translate', 'angular-gestures'])
    .config(function ($routeProvider) {
        $routeProvider
          .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          })
          .when('/settings', {
            templateUrl: 'views/settings.html',
            controller: 'SettingsCtrl'
          })
          .when('/reader', {
            templateUrl: 'views/reader.html',
            controller: 'ReaderCtrl'
          })
          .otherwise({
            redirectTo: '/'
          });

    })
    .config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en-US', {
        'MENU': 'Menu',
        'SUBSCRIPTIONS': 'Subscriptions',
        'FEEDS': 'Feeds',
        'ALL_ITEMS': 'All items',
        'AUTHENTICATION': 'Authentication',
        'EMAIL': 'E-mail',
        'PASSWORD': 'Password',
        'LOGIN': 'Login',
        'LOGOUT': 'Logout',
        'SETTINGS': 'Settings',
        'LOAD_MORE_FEEDS': 'Load more feeds',
        'LOADING_FEEDS': 'Loading',
        'NO_MORE_FEEDS': 'No more feeds to load',
        'LOGIN_SUCCESS': 'You are authenticated to The Old Reader.',
        'SHOW_ONLY_UNREAD': 'Show only unread feeds as default',
        'ERROR_NOT_LOGGED_IN': 'Please login into The Old Reader!',
        'ERROR_BROWSER_NOT_SUPPORTED': 'Browser not supported!',
        'ERROR_CONNECTING': 'Error while connecting to The Old Reader!',
        'WHATIS_SETTINGS': 'Login to The Old Reader and other settings',
        'WHATIS_REFRESH': 'Refresh unread feeds count',
        'WHATIS_UNREAD': 'Show only unread feeds',
        'WHATIS_READ': 'Show all feeds'
    });

    var huTranslation = {
        'MENU': 'Menü',
        'SUBSCRIPTIONS': 'Feliratkozások',
        'FEEDS': 'Feedek',
        'ALL_ITEMS': 'Összes',
        'AUTHENTICATION': 'Autentikáció',
        'EMAIL': 'E-mail',
        'PASSWORD': 'Jelszó',
        'LOGIN': 'Belépés',
        'LOGOUT': 'Kilépés',
        'SETTINGS': 'Beállítások',
        'LOAD_MORE_FEEDS': 'Több feed betöltése',
        'LOADING_FEEDS': 'Betöltés',
        'NO_MORE_FEEDS': 'Nincs több olvasatlan feed',
        'LOGIN_SUCCESS': 'Sikeresen bejelentkeztél ide: The Old Reader',
        'SHOW_ONLY_UNREAD': 'Csak olvasatlan feedek mutatása alapértelmezetten',
        'ERROR_NOT_LOGGED_IN': 'Nem vagy belépve a The Old Reader-be!',
        'ERROR_BROWSER_NOT_SUPPORTED': 'Böngésző nem támogatott!',
        'ERROR_CONNECTING': 'Hiba a csatlakozás közben!',
        'WHATIS_SETTINGS': 'Belépés és egyéb beállítások',
        'WHATIS_REFRESH': 'Olvasatlan feedek számának frissítése',
        'WHATIS_UNREAD': 'Csak olvasatlan feedek mutatása',
        'WHATIS_READ': 'Minden feed mutatása'
    };
    $translateProvider.translations('hu', huTranslation);
    $translateProvider.translations('hu-HU', huTranslation);

    $translateProvider.preferredLanguage('hu-HU');
}]);
