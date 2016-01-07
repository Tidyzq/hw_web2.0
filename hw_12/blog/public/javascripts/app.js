var app = angular.module('blog', []);

app.controller('signinCtrl', function($scope, $http, $rootScope) {
    $scope.submit = function() {
    	$http.post('http://localhost:8000/user/signin', {name: $scope.name, pwd: $scope.pwd}).success(function(response) {
    		$scope.show = response;
    	});
    };
    $scope.jump = function(url) {
    	$rootScope.content = url;
    };
});

app.controller('signupCtrl', function($scope, $http, $rootScope) {
    $scope.submit = function() {
    	$http.post('http://localhost:8000/user/signup', {name: $scope.name, pwd: $scope.pwd, rpwd: $scope.rpwd, email: $scope.email}).success(function(response) {
    		$scope.show = response;
    	});
    };
    $scope.jump = function(url) {
    	$rootScope.content = url;
    };
});