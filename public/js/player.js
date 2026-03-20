var app = angular.module('MusicApp'); 

app.controller('playerController', function($scope, $http, $timeout) {
    const audio = document.getElementById('audio');
    
    $scope.isPlaying = false;
    $scope.currentSongIndex = 0;
    $scope.songs = [];
    $scope.currentSong = {};
    $scope.loading = true;

    // Fetch songs from API
    $scope.loadLibrary = function() {
        $http.get('/api/songs')
            .then(function(response) {
                let dbSongs = response.data;
                $scope.songs = dbSongs.map((s, index) => {
                    return {
                        id: s.id,
                        name: s.name,
                        src: "/songs/" + s.fileName, // Serve from express static
                        img: "imgs/default.png",
                        artistName: s.uploadedBy || "Local"
                    };
                });

                if ($scope.songs.length > 0) {
                    $scope.currentSong = $scope.songs[0];
                    $scope.extractImages();
                }
                $scope.loading = false;
            })
            .catch(function(error) {
                console.error("Error fetching library", error);
                $scope.loading = false;
            });
    };

    // Extract ID3 tags for all songs
    $scope.extractImages = function() {
        $scope.songs.forEach((song, i) => {
            const absoluteUrl = window.location.origin + song.src;
            getImgSrc(absoluteUrl, function(imgUrl) {
                $timeout(function() {
                    $scope.songs[i].img = imgUrl;
                    if (i === $scope.currentSongIndex) {
                        $scope.currentSong.img = imgUrl;
                    }
                });
            });
        });
    };

    // Play/Pause Logic
    $scope.playPause = () => {
        if ($scope.songs.length === 0) return;

        if ($scope.isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        $scope.isPlaying = !$scope.isPlaying;
    };

    // Next Track
    $scope.next = () => {
        if ($scope.songs.length === 0) return;
        $scope.currentSongIndex = ($scope.currentSongIndex + 1) % $scope.songs.length;
        $scope.updateTrack();
    };

    // Prev Track
    $scope.prev = () => {
        if ($scope.songs.length === 0) return;
        $scope.currentSongIndex = ($scope.currentSongIndex - 1 + $scope.songs.length) % $scope.songs.length;
        $scope.updateTrack();
    };

    // Autoplay next on song end
    if (audio) {
        audio.onended = function() {
            $scope.$apply(function() {
                $scope.next();
            });
        };
    }

    $scope.updateTrack = () => {
        $scope.currentSong = $scope.songs[$scope.currentSongIndex];
        $timeout(() => {
            if ($scope.isPlaying) audio.play();
        });
    };
});

// Helper: ID3 Tags
function getImgSrc(src, callback) {
    if (typeof jsmediatags === 'undefined') {
        callback("imgs/default.png");
        return;
    }
    
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
            // Usually happens if no ID3 tags exist
            callback("imgs/default.png");
        }
    });
}