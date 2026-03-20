var app = angular.module('MusicApp', ['ngRoute']);

// Setup HTTP Interceptor for JWT tokens
app.factory('authInterceptor', function($q, $location, $window) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            if ($window.localStorage.getItem('token')) {
                config.headers.Authorization = 'Bearer ' + $window.localStorage.getItem('token');
            }
            return config;
        },
        responseError: function(response) {
            if (response.status === 401 || response.status === 403) {
                $window.localStorage.removeItem('token');
                $window.localStorage.removeItem('user');
                $location.path('/login');
            }
            return $q.reject(response);
        }
    };
});

app.config(function($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');

    $routeProvider
    .when('/', {
        templateUrl : "pages/home.html",
        controller: 'MainController'
    })
    .when('/register', {
        templateUrl : 'pages/register.html',
        controller: 'loginController'
    })
    .when('/login', {
        templateUrl : 'pages/login.html',
        controller: 'loginController'
    })
    .when('/player', {
        templateUrl : 'pages/player.html',
        controller: 'playerController'
    })
    .when('/upload', {
        templateUrl : 'pages/upload.html',
        controller: 'uploadController'
    })
    .otherwise({
        redirectTo: '/'
    });
});