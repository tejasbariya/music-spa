var app = angular.module('MusicApp');

// Initial auth redirection logic
app.run(function($rootScope, $location, $window) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        const publicRoutes = ['/login', '/register'];
        const isPublic = next.$$route && publicRoutes.includes(next.$$route.originalPath);
        const isLoggedIn = !!$window.localStorage.getItem('token');

        if (!isPublic && !isLoggedIn) {
            $location.path('/login');
        } else if (isPublic && isLoggedIn) {
            $location.path('/');
        }
    });
});

app.controller("loginController", function($scope, $http, $location, $window) {
    $scope.msg = "";
    $scope.loading = false;

    $scope.register = function() {
        $scope.msg = "";
        $scope.loading = true;

        let payload = {
            username: $scope.username,
            email: $scope.email,
            password: $scope.password
        };

        $http.post('/api/auth/register', payload)
            .then(function(response) {
                $scope.msg = "Registration successful! You can now login.";
                $scope.loading = false;
                setTimeout(() => { 
                    $scope.$apply(() => { $location.path('/login'); });
                }, 1500);
            })
            .catch(function(error) {
                $scope.msg = error.data?.message || "Registration failed.";
                $scope.loading = false;
            });
    };
    
    $scope.login = function() {
        $scope.msg = "";
        $scope.loading = true;

        let payload = {
            email: $scope.email,
            password: $scope.password
        };

        $http.post('/api/auth/login', payload)
            .then(function(response) {
                // Save token and user details
                $window.localStorage.setItem('token', response.data.token);
                $window.localStorage.setItem('user', JSON.stringify(response.data.user));
                
                $scope.loading = false;
                $location.path('/');
            })
            .catch(function(error) {
                $scope.msg = error.data?.message || "Invalid email or password.";
                $scope.loading = false;
            });
    };
});