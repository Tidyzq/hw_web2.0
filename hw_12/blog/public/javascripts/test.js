var app = angular.module('myApp', []);
app.controller('signinCtrl', function($scope, $http, $rootScope) {
	$scope.content = "localhost:8000/user/signin";
	$scope.submit = function() {
		$http.post()
	}
});