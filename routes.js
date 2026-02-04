var app = angular.module('MusicApp', ['ngRoute']);

app.config(function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl : "pages/home.html"
    })
    .when('/login', {
        templateUrl : 'pages/login.html'
    })
});