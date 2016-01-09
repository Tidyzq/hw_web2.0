var app = angular.module('blog', []);

app.controller('mainCtrl', function($scope, $http, $rootScope) {

    $http.get('/user/checkSignIn').success(function(response) {
        if (response.success) {
            $scope.signedUser = response.user;
        } else {
            console.log(response.error);
        }
    });

    $scope.loadPosts = function() {    
        $http.get('/post/getAllPosts').success(function(response) {
            if (response.success) {
                $scope.posts = response.posts;
            } else {
                console.log(response.error);
            }
        })
    };

    $scope.loadComments = function(post) {
        $http.get('/comment/getCommentsOfPost?postId=' + post._id).success(function(response) {
            if (response.success) {
                post.comments = response.comments;
            } else {
                console.log(response.error);
            }
        });
    }

    $scope.loadPosts();

    $scope.momentFromNow = function(date) {
        return moment(date).fromNow();
    }

    $scope.showSignInForm = function() {
        $scope.signinUser = {};
        $scope.showSignInFormFlag = true;
    };

    $scope.hideSignInForm = function() {
        $scope.showSignInFormFlag = false;
    };

    $scope.submitSignIn = function() {
        $http.post('/user/signIn', $scope.signinUser).success(function(response) {
            if (response.success) {
                $scope.signedUser = response.user;
                $scope.hideSignInForm();
            } else {
                console.log(response.error);
            }
        })
    };

    $scope.showSignUpForm = function() {
        $scope.signupUser = {};
        $scope.showSignUpFormFlag = true;
    };

    $scope.hideSignUpForm = function() {
        $scope.showSignUpFormFlag = false;
    };

    $scope.submitSignUp = function() {
        $http.post('/user/signUp', $scope.signupUser).success(function(response) {
            if (response.success) {
                $scope.signedUser = response.user;
                $scope.hideSignUpForm();
            } else {
                console.log(response.error);
            }
        })
    };

    $scope.showUserDetail = function(user) {
        $scope.showUser = user;
        $scope.showUserDetailFlag = true;
    };

    $scope.hideUserDetail = function() {
        $scope.showUserDetailFlag = false;
    };

    $scope.signOut = function() {
        $http.get('/user/signout').success(function(response) {
            if (response.success) {
                delete $scope.signedUser;
            }
        });
    };

    $scope.showNewPostForm = function() {
        $scope.newPost = {};
        $scope.showNewPostFormFlag = true;
    };

    $scope.hideNewPostForm = function() {
        $scope.showNewPostFormFlag = false;
    };

    $scope.submitNewPost = function() {
        $http.post('/post/newPost', $scope.newPost).success(function(response) {
            if (response.success) {
                $scope.hideNewPostForm();
                $scope.loadPosts();
            } else {
                console.log(response.error);
            }
        });
    };

    $scope.toggleComment = function(post) {
        post.showCommentFlag = !post.showCommentFlag;
        if (post.showCommentFlag) {
            $scope.loadComments(post);
        }
    };

    $scope.deletePost = function (postId) {
        $http.post('/post/deletePost', {postId: postId}).success(function(response) {
            if (response.success) {
                $scope.loadPosts();
            } else {
                console.log(response.error);
            }
        })
    };

    $scope.submitNewComment = function(post, comment) {
        commentToPost = {
            postId: post._id,
            content: comment.content
        };
        $http.post('/comment/newComment', commentToPost).success(function(response) {
            if (response.success) {
                post.newComment = {};
                $scope.loadComments(post);
            } else {
                console.log(response.error);
            }
        });
    };

    $scope.showEditPost = function(post) {
        $scope.editPost = post;
        $scope.showEditPostFlag = true;
        $scope.hideNewCommentForm();
    };

    $scope.hideEditPost = function() {
        $scope.showEditPostFlag = false;
    };

    $scope.submitEditPost = function() {
        var post = {
            _id: $scope.editPost._id,
            title: $scope.editPost.title,
            content: $scope.editPost.content
        };
        $http.post('/post/editPost', $scope.editPost).success(function(response) {
            if (response.success) {
                $scope.hideEditPost();
            } else {
                console.log(response.error);
            }
        });
    };

    $scope.showEditCommentForm = function(comment) {
        comment.showEditCommentFormFlag = true;
        comment.editComment = comment;
    }

    $scope.hideEditComment = function(comment) {
        comment.showEditCommentFormFlag = false;
    }

    $scope.submitEditComment = function(comment) {
        var commentToPost = {
            _id: comment._id,
            postId: comment.editComment.postId,
            content: comment.editComment.content
        };
        $http.post('/comment/editComment', commentToPost).success(function(response) {
            if (response.success) {
                comment = comment.editComment;
                $scope.hideEditComment(comment);
            } else {
                console.log(response.error);
            }
        });
    }

});
