var timer = {};
function delayTillLast(id, fn, wait) {
    if (timer[id]) {
        window.clearTimeout(timer[id]);
        delete timer[id];
    }
    return timer[id] = window.setTimeout(function () {
        fn();
        delete timer[id];
    }, wait);
}

var app = angular.module('blog', []);

app.controller('mainCtrl', function ($scope, $http, $rootScope) {

    $scope.Math = window.Math;

    $scope.numberOfPostsInPage = 5;
    $scope.postPageIndex = 1;

    $http.get('/user/checkSignIn').success(function (response) {
        if (response.success) {
            $scope.signedUser = response.user;
        } else {
            console.log(response.error);
        }
    });

    $scope.signupCheck = function (input) {
        for (var checkCase in checkCases[input.name]) {
            if (!checkCases[input.name][checkCase](input.value)) {
                delayTillLast(input.name, function () {
                    $scope.showError(input, checkCase);
                }, 500);
                return;
            }
        }
        delayTillLast(input.name, function () {}, 0);
        $scope.showSuccess(input);
        $scope.signupForm[input.name].valid = true;
    }

    $('#signin-form input').each(function () {
        this.oninput = function () {
            $scope.hideError(this);
        }
    });

    $('#signup-form input').each(function () {
        this.oninput = function () {
            $scope.hideError(this);
            var that = this;
            $scope.signupCheck(that);
        };
    });

    $scope.isSignedIn = function () {
        return !!$scope.signedUser;
    };

    $scope.signedUserIsEqualWith = function(user) {
        return $scope.isSignedIn() && $scope.signedUser._id == user._id;
    }

    $scope.loadPosts = function () {
        var startIndex = ($scope.postPageIndex - 1) * $scope.numberOfPostsInPage;
        $http.get('/post/getPostsByRange?startIndex=' + startIndex + '&count=' + $scope.numberOfPostsInPage).success(function (response) {
            if (response.success) {
                $scope.posts = response.posts;
                $scope.postCount = response.count;
            } else {
                console.log(response.error);
            }
        });
    };

    $scope.loadComments = function (post) {
        $http.get('/comment/getCommentsOfPost?postId=' + post._id).success(function (response) {
            if (response.success) {
                post.comments = response.comments;
                post.commentCount = post.comments.length;
            } else {
                console.log(response.error);
            }
        });
    }

    $scope.loadPosts();


    $scope.getNumber = function (num) {
        return new Array(num);
    }

    $scope.changePostIndex = function (index) {
        if (index != $scope.postPageIndex) {
            $scope.postPageIndex = index;
            $scope.loadPosts();
        }
    }

    $scope.momentFromNow = function (date) {
        return moment(date).fromNow();
    }

    $scope.showError = function (selector, message) {
        $(selector).parent().addClass('has-error')
        $(selector).popover({
            container: 'body',
            trigger : 'hover',  
            placement : 'bottom',
            html: 'true'
        }).attr('data-content', message).popover('show');
    }

    $scope.showSuccess = function (selector) {
        $(selector).parent().addClass('has-success');
    }

    $scope.hideError = function (selector) {
        $(selector).each(function () {
            $(this).parent().removeClass('has-error has-success')
            $(this).popover('destroy');
        });
    }

    $scope.showSignInForm = function () {
        $scope.signinUser = {};
        $scope.signinForm = {
            name: {},
            pwd: {}
        };
        $('#signin-form').modal('show');
    };

    $scope.hideSignInForm = function () {
        $scope.hideError('#signin-form input');
        $('#signin-form').modal('hide');
    };

    $scope.submitSignIn = function () {
        $http.post('/user/signIn', $scope.signinUser).success(function (response) {
            if (response.success) {
                $scope.signedUser = response.user;
                $scope.hideSignInForm();
            } else {
                if (response.error.name) $scope.showError('#signin-name', response.error.name);
                if (response.error.pwd) $scope.showError('#signin-pwd', response.error.pwd);
                console.log(response.error);
            }
        })
    };

    $scope.showSignUpForm = function () {
        $scope.signupUser = {};
        $scope.signupForm = {
            name: {},
            pwd: {},
            rpwd: {},
            email: {}
        };
        $('#signup-form').modal('show');
    };

    $scope.hideSignUpForm = function () {
        $scope.hideError('#signup-form input');
        $('#signup-form').modal('hide');
    };

    $scope.submitSignUp = function () {
        $http.post('/user/signUp', $scope.signupUser).success(function (response) {
            if (response.success) {
                $scope.signedUser = response.user;
                $scope.hideSignUpForm();
            } else {
                if (response.error.name) $scope.showError('#signup-name', response.error.name);
                console.log(response.error);
            }
        })
    };

    $scope.showUserDetail = function (user) {
        $scope.showUser = user;
        $('#detail-form').modal('show');
    };

    $scope.hideUserDetail = function () {
        $('#detail-form').modal('hide');
    };

    $scope.signOut = function () {
        $http.get('/user/signout').success(function (response) {
            if (response.success) {
                delete $scope.signedUser;
            }
        });
    };

    $scope.showNewPostForm = function () {
        $scope.newPost = {};
        $scope.newPostForm = {};
        $('#new-post-form').modal('show');
    };

    $scope.hideNewPostForm = function () {
        $('#new-post-form').modal('hide');
    };

    $scope.submitNewPost = function () {
        var postToPost = {
            title: $scope.newPost.title,
            content: $scope.newPost.content
        };
        $http.post('/post/newPost', postToPost).success(function (response) {
            if (response.success) {
                $scope.hideNewPostForm();
                $scope.loadPosts();
            } else {
                $scope.newPostForm.title = response.error.title;
                $scope.newPostForm.content = response.error.content;
                console.log(response.error);
            }
        });
    };

    $scope.toggleComment = function (post) {
        post.showCommentFlag = !post.showCommentFlag;
        post.newComment = {};
        $('#post' + post.index + '-comment-container').collapse('toggle');
        if (post.showCommentFlag) {
            $scope.loadComments(post);
        }
    };

    $scope.submitDeletePost = function (post) {
        $http.post('/post/deletePost', {postId: post._id}).success(function (response) {
            if (response.success) {
                $('#post' + post.index).animate({
                    left: '-200%'
                }).collapse('hide');
            } else {
                console.log(response.error);
            }
        });
    };

    $scope.submitNewComment = function (post, comment) {
        commentToPost = {
            postId: post._id,
            content: comment.content
        };
        $http.post('/comment/newComment', commentToPost).success(function (response) {
            if (response.success) {
                post.newComment = {};
                $scope.loadComments(post);
            } else {
                comment.error = response.error.content;
                console.log(response.error);
            }
        });
    };

    $scope.showEditPostForm = function (post) {
        post.editPost = {
            title: post.title,
            content: post.content
        }
        $('#post' + post.index + '-show-post').collapse('hide');
        $('#post' + post.index + '-edit-post').collapse('show');
    };

    $scope.hideEditPostForm = function (post) {
        $('#post' + post.index + '-show-post').collapse('show');
        $('#post' + post.index + '-edit-post').collapse('hide');
    };

    $scope.submitEditPost = function (post) {
        var postToPost = {
            _id: post._id,
            title: post.editPost.title,
            content: post.editPost.content
        };
        $http.post('/post/editPost', postToPost).success(function (response) {
            if (response.success) {
                post.title = post.editPost.title;
                post.content = post.editPost.content;
                $scope.hideEditPostForm(post);
            } else {
                console.log(response.error);
            }
        });
    };

    $scope.showEditCommentForm = function (comment) {
        comment.editComment = {
            content: comment.content
        }
        $('#comment' + comment.index + '-' + comment.postIndex + '-show-comment').collapse('hide');
        $('#comment' + comment.index + '-' + comment.postIndex + '-edit-comment').collapse('show');
    };

    $scope.hideEditComment = function (comment) {
        $('#comment' + comment.index + '-' + comment.postIndex + '-show-comment').collapse('show');
        $('#comment' + comment.index + '-' + comment.postIndex + '-edit-comment').collapse('hide');
    };

    $scope.submitEditComment = function (comment) {
        var commentToPost = {
            _id: comment._id,
            postId: comment.postId,
            content: comment.editComment.content
        };
        $http.post('/comment/editComment', commentToPost).success(function (response) {
            if (response.success) {
                comment.content = comment.editComment.content;
                $scope.hideEditComment(comment);
            } else {
                console.log(response.error);
            }
        });
    };

    $scope.submitDeleteComment = function (comment, post) {
        $http.post('/comment/deleteComment', {'commentId': comment._id}).success(function (response) {
            if (response.success) {
                $('#comment' + comment.index + '-' + comment.postIndex).animate({
                    left: '-200%'
                }).collapse('hide');
                --post.commentCount;
            } else {
                console.log(response.error);
            }
        });
    };

});