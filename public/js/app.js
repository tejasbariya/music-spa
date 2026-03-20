// Directives for file upload
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.controller("MainController", function($scope, $location, $window, $http) {
    $scope.isLoggedIn = function() {
        return !!$window.localStorage.getItem('token');
    };

    $scope.logout = function() {
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('user');
        $location.path('/login');
    };

    $scope.isActive = function(path) {
        return $location.path() === path;
    };

    // --- Home/Search Logic ---
    $scope.searchQuery = "";
    $scope.searchResults = [];
    $scope.lastSearch = "";
    $scope.isSearching = false;
    $scope.searchError = "";

    // CHANGED: Replaced iTunes API with Deezer API
    $scope.searchSongs = function() {
        if (!$scope.searchQuery) return;
        
        $scope.isSearching = true;
        $scope.searchError = "";
        
        const term = encodeURIComponent($scope.searchQuery);
        // Deezer API format (using JSONP to avoid CORS issues)
        const url = `https://api.deezer.com/search?q=${term}&limit=10&output=jsonp`;

        $http.jsonp(url, { jsonpCallbackParam: 'callback' })
        .then(function(response) {
            // Deezer returns data in an array called 'data'
            if (response.data && response.data.data) {
                // Map Deezer properties to match the old iTunes properties
                // so your HTML and playPreview function don't break!
                $scope.searchResults = response.data.data.map(function(track) {
                    return {
                        trackName: track.title,
                        artistName: track.artist.name,
                        previewUrl: track.preview, // The 30-second audio clip
                        artworkUrl100: track.album.cover_medium // Album art
                    };
                });
            } else {
                $scope.searchResults = [];
            }
            
            $scope.lastSearch = $scope.searchQuery;
            $scope.isSearching = false;
        }).catch(function(error) {
            $scope.searchError = "Error fetching from API. Try again.";
            $scope.isSearching = false;
            console.error(error);
        });
    };

    $scope.playPreview = function(track) {
        // Stop currently playing audio on home page if any
        if (window.previewAudio) {
            window.previewAudio.pause();
        }
        
        window.previewAudio = new Audio(track.previewUrl);
        window.previewAudio.play();
        alert(`Playing preview: ${track.trackName}`);
    };
});

app.controller("uploadController", function($scope, $http, $timeout) {
    $scope.uploadData = { name: '', file: null };
    $scope.selectedFileName = "";
    $scope.isUploading = false;
    $scope.uploadError = "";
    $scope.uploadSuccess = "";

    $scope.fileNameChanged = function(element) {
        $scope.$apply(function() {
            if (element.files.length > 0) {
                $scope.selectedFileName = element.files[0].name;
            } else {
                $scope.selectedFileName = "";
            }
        });
    };

    $scope.uploadSong = function() {
        if (!$scope.uploadData.file) {
            $scope.uploadError = "Please select a file to upload.";
            return;
        }

        $scope.isUploading = true;
        $scope.uploadError = "";
        $scope.uploadSuccess = "";

        var formData = new FormData();
        formData.append('song', $scope.uploadData.file);
        if ($scope.uploadData.name) {
            formData.append('name', $scope.uploadData.name);
        }

        $http.post('/api/songs/upload', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .then(function(response) {
            $scope.uploadSuccess = response.data.message;
            $scope.isUploading = false;
            $scope.uploadData = { name: '', file: null };
            $scope.selectedFileName = "";
            
            // clear success message after 3s
            $timeout(function() { $scope.uploadSuccess = ""; }, 3000);
        })
        .catch(function(error) {
            $scope.uploadError = error.data?.message || "Error uploading file.";
            $scope.isUploading = false;
        });
    };
});
app.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads (your own backend API and files)
        'self',
        // Allow JSONP requests to the Deezer API domain
        'https://api.deezer.com/**'
    ]);
});