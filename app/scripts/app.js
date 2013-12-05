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
          .when('/about', {
            templateUrl: 'views/about.html'
          })
          .otherwise({
            redirectTo: '/'
          });

    })
    .config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en-US', {
        'MENU': 'Menu',
        'SUBSCRIPTIONS': 'Subscriptions',
        'HELP': 'Help',
        'ABOUT': 'About',
        'FEEDS': 'Feeds',
        'ALL_ITEMS': 'All items',
        'AUTHENTICATION': 'Authentication',
        'EMAIL': 'E-mail',
        'PASSWORD': 'Password',
        'LOGIN': 'Login',
        'LOGOUT': 'Logout',
        'SETTINGS': 'Settings',
        'REGISTER_TEXT': 'If you don\'t have account at The Old Reader you can register now!',
        'REGISTER_BUTTON': 'Register',
        'LOAD_MORE_FEEDS': 'Load more feeds',
        'LOADING_FEEDS': 'Loading',
        'NO_MORE_FEEDS': 'No more feeds to load',
        'LOGIN_SUCCESS': 'You are authenticated to The Old Reader.',
        'SHOW_ONLY_UNREAD': 'Show only unread feeds as default',
        'VERSION': 'Version',
        'INFORMATION': 'Information',
        'CREATEDBY': 'Created by',
        'CHANGELOG': 'Changelog',
        'LICENSE': 'License',
        'ERROR_NOT_LOGGED_IN': 'Please login into The Old Reader!',
        'ERROR_BROWSER_NOT_SUPPORTED': 'Browser not supported!',
        'ERROR_CONNECTING': 'Error while connecting to The Old Reader!',
        'ERROR_PARSING_SETTINGS': 'Error while parsing settings!',
        'WHATIS_SETTINGS': 'Login to The Old Reader and other settings',
        'WHATIS_REFRESH': 'Refresh unread feeds count',
        'WHATIS_UNREAD': 'Show only unread feeds',
        'WHATIS_READ': 'Show all feeds',
        'WHATIS_VISIT': 'Read original version'
    });

    var huTranslation = {
        'MENU': 'Menü',
        'SUBSCRIPTIONS': 'Feliratkozások',
        'HELP': 'Súgó',
        'ABOUT': 'Információ',
        'FEEDS': 'Feedek',
        'ALL_ITEMS': 'Összes',
        'AUTHENTICATION': 'Autentikáció',
        'EMAIL': 'E-mail',
        'PASSWORD': 'Jelszó',
        'LOGIN': 'Belépés',
        'LOGOUT': 'Kilépés',
        'REGISTER_TEXT': 'Ha még nincs The Old Reader felhasználód regisztrálj most!',
        'REGISTER_BUTTON': 'Regisztrálás',
        'SETTINGS': 'Beállítások',
        'LOAD_MORE_FEEDS': 'Több feed betöltése',
        'LOADING_FEEDS': 'Betöltés',
        'NO_MORE_FEEDS': 'Nincs több olvasatlan feed',
        'LOGIN_SUCCESS': 'Sikeresen bejelentkeztél ide: The Old Reader',
        'SHOW_ONLY_UNREAD': 'Csak olvasatlan feedek mutatása alapértelmezetten',
        'VERSION': 'Verzió',
        'INFORMATION': 'Információ',
        'CREATEDBY': 'Készítette',
        'CHANGELOG': 'Changelog',
        'LICENSE': 'Licensz',
        'ERROR_NOT_LOGGED_IN': 'Nem vagy belépve a The Old Reader-be!',
        'ERROR_BROWSER_NOT_SUPPORTED': 'Böngésző nem támogatott!',
        'ERROR_CONNECTING': 'Hiba a csatlakozás közben!',
        'ERROR_PARSING_SETTINGS': 'Hiba a beállítások olvasásánál!',
        'WHATIS_SETTINGS': 'Belépés és egyéb beállítások',
        'WHATIS_REFRESH': 'Olvasatlan feedek számának frissítése',
        'WHATIS_UNREAD': 'Csak olvasatlan feedek mutatása',
        'WHATIS_READ': 'Minden feed mutatása',
        'WHATIS_VISIT': 'Eredeti változat elolvasása'
    };
    $translateProvider.translations('hu', huTranslation);
    $translateProvider.translations('hu-HU', huTranslation);

    $translateProvider.preferredLanguage('hu-HU');
}]);
