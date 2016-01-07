var app = angular.module('blog', []);

app.controller('mainCtrl', function($scope, $http, $rootScope) {
    $rootScope.htmlContent = '/home';
    $scope.jump = function(url) {
        $rootScope.htmlContent = url;
    };
    $scope.signOut = function() {
        $http.get('/user/signout').success(function(response) {
            if (response.success) {
                delete $rootScope.user;
                $scope.jump('/user/signin');
            } else {
                $scope.show = response.error;
            }
        });
    };
    $scope.getUser = function(userId) {
        $http.get('/user/getUser?userId=' + userId).success(function(response) {
            return response;
        });
    };
});

app.controller('homeCtrl', function($scope, $http, $rootScope) {
    $http.get('/post/getAllPosts').success(function(response) {
        $scope.posts = response;
    });
    $scope.newPost = function() {
        if ($rootScope.user) {
            $scope.jump('/post/newPost');
        } else {
            $scope.jump('/user/signin');
        }
    }
});

app.controller('signinCtrl', function($scope, $http, $rootScope) {
    $scope.submit = function() {
    	$http.post('/user/signin', {name: $scope.name, pwd: $scope.pwd}).success(function(response) {
            if (response.success) {
                $scope.jump('/user/detail');
                $rootScope.user = response.user;
                $rootScope.showUser = $rootScope.user;
            } else {
                $scope.show = response.error;
            }
    	});
    };
});

app.controller('signupCtrl', function($scope, $http, $rootScope) {
    $scope.submit = function() {
    	$http.post('/user/signup', {name: $scope.name, pwd: $scope.pwd, rpwd: $scope.rpwd, email: $scope.email}).success(function(response) {
    		if (response.success) {
                $scope.jump('/user/signin');
            } else {
                $scope.show = response.error;
            }
    	});
    };
});

app.controller('detailCtrl', function($scope, $http, $rootScope) {});

app.controller('newPostCtrl', function($scope, $http, $rootScope) {
    $scope.submit = function() {
        $http.post('/post/newPost', {title: $scope.title, content: $scope.content}).success(function(response) {
            if (response.success) {
                $scope.jump('/home');
            } else {
                $scope.show = response.error;
            }
        });
    };
});