var app = angular.module('MusicApp');

app.controller('playerController', function($scope, $http, $timeout) {
    var audio = null;

    $scope.isPlaying      = false;
    $scope.currentSongIndex = 0;
    $scope.songs          = [];
    $scope.currentSong    = {};
    $scope.loading        = true;
    $scope.currentTime    = '0:00';
    $scope.duration       = '--:--';
    $scope.progressPercent  = '0%';
    $scope.progressBuffered = '0%';

    function getAudio() {
        if (!audio) audio = document.getElementById('audio');
        return audio;
    }

    function fmt(s) {
        if (!isFinite(s) || isNaN(s)) return '--:--';
        var m = Math.floor(s / 60);
        var sec = Math.floor(s % 60);
        return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    // Sync blurred art backdrop
    function syncArtBlur(src) {
        var blur = document.getElementById('artBlur');
        if (blur && src) {
            blur.style.backgroundImage = 'url(' + src + ')';
        }
    }

    $scope.loadLibrary = function() {
        $http.get('/api/songs')
            .then(function(response) {
                $scope.songs = response.data.map(function(s) {
                    return {
                        id: s.id,
                        name: s.name,
                        src: '/songs/' + s.fileName,
                        img: 'imgs/default.png',
                        artistName: s.uploadedBy || 'Local'
                    };
                });
                if ($scope.songs.length > 0) {
                    $scope.currentSong = $scope.songs[0];
                    $scope.extractImages();
                    $timeout(function() { $scope.bindAudioEvents(); }, 120);
                }
                $scope.loading = false;
            })
            .catch(function(err) {
                console.error('Error fetching library', err);
                $scope.loading = false;
            });
    };

    $scope.bindAudioEvents = function() {
        var a = getAudio();
        if (!a) return;

        a.ontimeupdate = function() {
            $scope.$apply(function() {
                $scope.currentTime = fmt(a.currentTime);
                if (a.duration) {
                    $scope.progressPercent = ((a.currentTime / a.duration) * 100).toFixed(2) + '%';
                }
            });
        };

        a.ondurationchange = function() {
            $scope.$apply(function() { $scope.duration = fmt(a.duration); });
        };

        a.onprogress = function() {
            if (a.buffered.length > 0 && a.duration) {
                $scope.$apply(function() {
                    $scope.progressBuffered = ((a.buffered.end(a.buffered.length - 1) / a.duration) * 100).toFixed(2) + '%';
                });
            }
        };

        a.onended = function() {
            $scope.$apply(function() { $scope.next(); });
        };

        a.onplay = function() {
            $scope.$apply(function() { $scope.isPlaying = true; });
        };

        a.onpause = function() {
            $scope.$apply(function() { $scope.isPlaying = false; });
        };
    };

    $scope.seek = function(event) {
        var a = getAudio();
        if (!a || !a.duration) return;
        var rect = event.currentTarget.getBoundingClientRect();
        a.currentTime = ((event.clientX - rect.left) / rect.width) * a.duration;
    };

    $scope.playPause = function() {
        if ($scope.songs.length === 0) return;
        var a = getAudio();
        if (!a) return;
        $scope.isPlaying ? a.pause() : a.play();
    };

    $scope.next = function() {
        if ($scope.songs.length === 0) return;
        $scope.currentSongIndex = ($scope.currentSongIndex + 1) % $scope.songs.length;
        $scope.updateTrack();
    };

    $scope.prev = function() {
        if ($scope.songs.length === 0) return;
        $scope.currentSongIndex = ($scope.currentSongIndex - 1 + $scope.songs.length) % $scope.songs.length;
        $scope.updateTrack();
    };

    $scope.updateTrack = function() {
        $scope.currentSong      = $scope.songs[$scope.currentSongIndex];
        $scope.progressPercent  = '0%';
        $scope.progressBuffered = '0%';
        $scope.currentTime      = '0:00';
        $scope.duration         = '--:--';
        syncArtBlur($scope.currentSong.img);
        $timeout(function() {
            var a = getAudio();
            if (a) { a.load(); if ($scope.isPlaying) a.play(); }
        }, 80);
    };

    $scope.extractImages = function() {
        $scope.songs.forEach(function(song, i) {
            getImgSrc(window.location.origin + song.src, function(imgUrl) {
                $timeout(function() {
                    $scope.songs[i].img = imgUrl;
                    if (i === $scope.currentSongIndex) {
                        $scope.currentSong.img = imgUrl;
                        syncArtBlur(imgUrl);
                    }
                });
            });
        });
    };
});

function getImgSrc(src, callback) {
    if (typeof jsmediatags === 'undefined') { callback('imgs/default.png'); return; }
    jsmediatags.read(src, {
        onSuccess: function(tag) {
            var pic = tag.tags.picture;
            if (pic) {
                var b64 = '', bytes = new Uint8Array(pic.data);
                for (var i = 0; i < bytes.length; i++) b64 += String.fromCharCode(bytes[i]);
                callback('data:' + pic.format + ';base64,' + btoa(b64));
            } else { callback('imgs/default.png'); }
        },
        onError: function() { callback('imgs/default.png'); }
    });
}
