var app = angular.module('MusicApp', ['ngRoute']);
app.controller("MusicController", function($scope, $location) {
    // Global data
    $scope.songs = [];
    $scope.songs_last_index = 0;

    // Login Function
    $scope.login = function() {
        // Checking against your specific credentials
        console.log($scope.userInput.email)
        console.log($scope.userInput.password)
        if ($scope.userInput.email == "admin@ptb.com" && $scope.userInput.password == "ptb") {
            $location.path('/home.html'); // Redirect to home.html
        } else {
            $scope.msg = "Invalid Credentials";
        }
    };

    // Song Registration
    $scope.registerSong = function() {
        if (!$scope.home_input.reg_song_name) return;
        
        $scope.songs_last_index++;
        $scope.songs.push({
            "index": $scope.songs_last_index,
            "name": $scope.home_input.reg_song_name
        });
        $scope.home_input.reg_song_name = ''; // Clear input
        alert("Song Registered!");
    };

    // Song Search
    $scope.getSong = function() {
        let found = $scope.songs.find(s => s.name.toLowerCase() === $scope.home_input.get_song_name.toLowerCase());
        $scope.song_name = found ? found.name : "Not Found";
    };

    $scope.logout = function() {
        $location.path('/');
    };
});