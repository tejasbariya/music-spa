var app = angular.module('MusicApp'); 

// Player Controller
app.controller('playerController', function($scope, $timeout) {
    const audio = document.getElementById('audio');
    $scope.isPlaying = false;
    $scope.currentSongIndex = 0;
    $scope.songs = [];

    for (let i = 0; i < 10; i++) {
        // Pushing the songs in songs list
        $scope.songs.push({
            name: "Song " + i,
            src: "songs/s" + i + ".mp3",
            img: "imgs/default.png"
        });

        // loading the Image for i'th song
        const absoluteUrl = window.location.origin + "/songs/s" + i + ".mp3";
        getImgSrc(absoluteUrl, function(imgUrl) {
            // Use $timeout or $apply to tell Angular the image changed
            $timeout(function() {
                $scope.songs[i].img = imgUrl;
            });
        });
    }

    // setting the current Current song to 1st song
    $scope.currentSong = $scope.songs[$scope.currentSongIndex];

    // Play/Pause btn Logic
    $scope.playPause = () => {
        if ($scope.isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        $scope.isPlaying = !$scope.isPlaying;
    };

    // Next btn Logic
    $scope.next = () => {
        $scope.currentSongIndex = ($scope.currentSongIndex + 1) % $scope.songs.length;
        $scope.updateTrack();
    };

    // Prev btn Logic
    $scope.prev = () => {
        $scope.currentSongIndex = ($scope.currentSongIndex - 1 + $scope.songs.length) % $scope.songs.length;
        $scope.updateTrack();
    };

    // Updatting Track of song 
    $scope.updateTrack = () => {
        $scope.currentSong = $scope.songs[$scope.currentSongIndex];
        // Wait for DOM to update src, then play if was already playing
        $timeout(() => {
            if ($scope.isPlaying) audio.play();
        });
    };
});

// Get Image from Song
function getImgSrc(src, callback) {
    jsmediatags.read(src, {
        onSuccess: function(tag) {
            const picture = tag.tags.picture;
            if (picture) {
                let base64String = "";
                const bytes = new Uint8Array(picture.data);
                for (let i = 0; i < bytes.length; i++) {
                    base64String += String.fromCharCode(bytes[i]);
                }
                const imgUrl = "data:" + picture.format + ";base64," + btoa(base64String);
                callback(imgUrl);
            } else {
                callback("imgs/default.png");
            }
        },
        onError: function(error) {
            console.log("Error reading tags for " + src + ":", error);
            callback("imgs/default.png");
        }
    });
}