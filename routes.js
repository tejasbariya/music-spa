var app = angular.module('MusicApp', ['ngRoute']);

app.config(function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl : "pages/home.html"
    })
    .when('/register', {
        templateUrl : 'pages/register.html'
    })
    .when('/login', {
        templateUrl : 'pages/login.html'
    })
});