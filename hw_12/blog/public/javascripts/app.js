var app = angular.module('blog', ['ngAnimate']);

app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last == true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
});

app.directive('inputWithHoverMessage', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            scope.$on('showError', function (event, error) {
                var name = attr.name;
                if (error[name]) {
                    $(element).parent().addClass('has-error').removeClass('has-success');
                    $(element).popover({
                        container: 'body',
                        trigger : 'hover',  
                        placement : 'bottom',
                        html: 'true'
                    }).attr('data-content', error[name]).popover('show');
                }
            });

            scope.$on('showSuccess', function (event, name) {
                if (attr.name == name) {
                    $(element).parent().removeClass('has-error').addClass('has-success');
                }
            });

            scope.$on('hideAll', function (event, name) {
                if (!name || attr.name == name) {
                    $(element).parent().removeClass('has-error has-success')
                    $(element).popover('destroy');
                }
            });
        }
    }
});

app.service('User', ['$http', '$rootScope', function ($http, $rootScope) {

    this.currentUser = {signedIn: false};
    var that = this;
    this.signUp = function (name, pwd, rpwd, email) {
        var userToPost = {
            name: name,
            pwd: pwd,
            rpwd: rpwd,
            email: email
        };
        return $http.post('user/signUp', userToPost).then(function (response) {
            if (response.data.success) {
                that.currentUser = response.data.user;
                that.currentUser.signedIn = true;
                $rootScope.$broadcast('userChanged');
                return Promise.resolve();
            } else {
                return Promise.reject(response.data.error);
            }
        });
    };

    this.signIn = function (name, pwd) {
        var userToPost = {
            name: name,
            pwd: pwd
        };
        return $http.post('user/signIn', userToPost).then(function (response) {
            if (response.data.success) {
                that.currentUser = response.data.user;
                that.currentUser.signedIn = true;
                $rootScope.$broadcast('userChanged');
                return Promise.resolve();
            } else {
                return Promise.reject(response.data.error);
            }
        })
    };

    this.signOut = function () {
        return $http.get('user/signOut').then(function (response) {
            if (response.data.success) {
                that.currentUser = {signedIn: false};
                $rootScope.$broadcast('userChanged');
                return Promise.resolve();
            } else {
                return Promise.reject(response.data.error);
            }
        });
    };

    this.checkSignIn = function () {
        return $http.get('/user/checkSignIn').then(function (response) {
            if (response.data.success) {
                that.currentUser = response.data.user;
                that.currentUser.signedIn = true;
                $rootScope.$broadcast('userChanged');
                return Promise.resolve();
            } else {
                return Promise.reject(response.data.error);
            }
        });
    };

    this.checkSignIn();
}]);

app.service('Post', ['$rootScope', '$http', 'User', 'Navigator', 'Search', function ($rootScope, $http, User, Navigator, Search) {

    var that = this;

    this.posts = [];
    this.postCount = 0;

    this.newPost = function (title, content) {
        var postToPost = {
            title: title,
            content: content
        };
        return User.currentUser.signedIn ? $http.post('post/newPost', postToPost).then(function (response) {
            return response.data.success ? that.loadPosts() : Promise.reject(response.data.error);
        }) : Promise.reject("You haven't sign in yet");
    };

    this.editPost = function (id, title, content) {
        var postToPost = {
            _id: id,
            title: title,
            content: content
        };
        return User.currentUser.signedIn ? $http.post('post/editPost', postToPost).then(function (response) {
            return response.data.success ? Promise.resolve() : Promise.reject(response.data.error);
        }) : Promise.reject("You haven't sign in yet");
    };

    this.deletePost = function (id) {
        var postToPost = {
            postId: id
        };
        return User.currentUser.signedIn ? $http.post('post/deletePost', postToPost).then(function (response) {
            return response.data.success ? Promise.resolve() : Promise.reject(response.data.error);
        }) : Promise.reject("You haven't sign in yet");
    };

    this.hidePost = function (id) {
        var postToPost = {
            postId: id
        };
        return User.currentUser.isAdmin ? $http.post('post/hidePost', postToPost).then(function (response) {
            return response.data.success ? that.loadPosts() : Promise.reject(response.data.error);
        }) : Promise.reject("You haven't sign in yet");
    };

    this.unhidePost = function (id) {
        var postToPost = {
            postId: id
        };
        return User.currentUser.isAdmin ? $http.post('post/unhidePost', postToPost).then(function (response) {
            return response.data.success ? that.loadPosts() : Promise.reject(response.data.error);
        }) : Promise.reject("You haven't sign in yet");
    };

    this.loadPost = function (id) {
        return $http.get('/post/getPost?postId=' + id).then(function (response) {
            return response.data.success ? Promise.resolve(response.data.post) : Promise.reject(response.data.error);
        });
    };

    this.loadPosts = function () {
        return $http.get('/post/getPostsByRange?startIndex=' + (Navigator.pageIndex - 1) * Navigator.numbersInPage + '&count=' + Navigator.numbersInPage + '&filter=' + Search.filter).then(function (response) {
            if (response.data.success) {
                that.posts = response.data.posts;
                $rootScope.$broadcast('postsChange');
                if (that.postCount != response.data.count) {
                    that.postCount = response.data.count;
                    $rootScope.$broadcast('postCountChange', response.data.count);
                }
                return Promise.resolve({posts: response.data.posts, count: response.data.count});
            } else {
                return Promise.reject(response.data.error);
            }
        });
    };

    $rootScope.$on('pageIndexChanged', function (event) {
        that.loadPosts();
    });

    $rootScope.$on('userChanged', function (event) {
        that.loadPosts();
    });

    $rootScope.$on('filterChanged', function (event) {
        that.loadPosts();
    });

    this.loadPosts();
}]);

app.service('Comment', ['$rootScope', '$http', 'User', function ($rootScope, $http, User) {

    var that = this;

    this.comments = {};

    this.newComment = function (postId, reply, content) {
        var commentToPost = {
            postId: postId,
            reply: reply,
            content: content
        };
        return User.currentUser.signedIn ? $http.post('comment/newComment', commentToPost).then(function (response) {
            return response.data.success ? that.loadComments(postId) : Promise.reject(response.data.error);
        }) : Promise.reject("You haven't sign in yet");
    };

    this.editComment = function (id, content) {
        var commentToPost = {
            _id: id,
            content: content
        };
        return User.currentUser.signedIn ? $http.post('comment/editComment', commentToPost).then(function (response) {
            return response.data.success ? Promise.resolve() : Promise.reject(response.data.error);
        }) : Promise.reject("You haven't sign in yet");
    };

    this.deleteComment = function (id) {
        var commentToPost = {
            commentId: id
        };
        return User.currentUser.signedIn ? $http.post('comment/deleteComment', commentToPost).then(function (response) {
            return response.data.success ? Promise.resolve() : Promise.reject(response.data.error);
        }) : Promise.reject("You haven't sign in yet");
    };

    this.hideComment = function (id, postId) {
        var commentToPost = {
            commentId: id
        };
        return User.currentUser.signedIn ? $http.post('comment/hideComment', commentToPost).then(function (response) {
            return response.data.success ? that.loadComments(postId) : Promise.reject(response.data.error);
        }) : Promise.reject("You haven't sign in yet");
    };

    this.unhideComment = function (id, postId) {
        var commentToPost = {
            commentId: id
        };
        return User.currentUser.signedIn ? $http.post('comment/unhideComment', commentToPost).then(function (response) {
            return response.data.success ? that.loadComments(postId) : Promise.reject(response.data.error);
        }) : Promise.reject("You haven't sign in yet");
    };

    this.loadComments = function (postId) {
        return $http.get('/comment/getCommentsOfPost?postId=' + postId).then(function (response) {
            if (response.data.success) {
                that.comments[postId] = response.data.comments;
                $rootScope.$broadcast('commentChanged', postId);
                return Promise.resolve(response.data.comments);
            } else {
                return Promise.reject(response.data.error);
            }
        });
    };
}]);

app.service('Search', ['$rootScope', function ($rootScope) {

    var that = this;

    this.filter = "";

    this.search = function (filter) {
        this.filter = encodeURI(filter).replace('+', '%2b').replace(/%20/g, '+');
        $rootScope.$broadcast('filterChanged');
    };
}]);

app.service('Navigator', ['$rootScope', '$http', function ($rootScope, $http) {

    var that = this;
    this.numbersInPage = 5;
    this.pageIndex = 1;
    this.maxPage = 1;

    $rootScope.$on('postCountChange', function (event, count) {
        that.maxPage = Math.ceil(count / that.numbersInPage);
        if (that.pageIndex > that.maxPage) that.prePage();
    });

    this.jumpToPage = function (index) {
        if (index >= 1 && index <= that.maxPage) {
            that.pageIndex = index;
            $rootScope.$broadcast('pageIndexChanged');
        }
        return that.pageIndex;
    };

    this.nextPage = function () {
        return that.jumpToPage(that.pageIndex + 1);
    };

    this.prePage = function () {
        return that.jumpToPage(that.pageIndex - 1);
    };
}]);

app.controller('signInCtrl', ['$scope', '$element', 'User', function ($scope, $element, User) {

    $scope.$on('showSignInForm', function (event) {
        $scope.showSignInForm();
    });

    $($element).find('[input-with-hover-message]').each(function () {
        this.oninput = function () {
            $scope.$broadcast('hideAll', this.name);
        }
    });

    $scope.showSignInForm = function () {
        $scope.name = "";
        $scope.pwd = "";
        $($element).modal('show');
    };

    $scope.hideSignInForm = function () {
        $scope.$broadcast('hideAll');
        $($element).modal('hide');
    };

    $scope.isAllValid = function () {
        return $scope.name && $scope.pwd;
    };

    $scope.submitSignIn = function () {
        User.signIn($scope.name, $scope.pwd).then(function () {
            $scope.hideSignInForm();
        }).catch(function (error) {
            console.log(error);
            $scope.$broadcast('showError', error);
        });
    };
}]);

app.controller('signUpCtrl', ['$scope', '$element', 'User', function ($scope, $element, User) {

    $scope.$on('showSignUpForm', function (event) {
        $scope.showSignUpForm();
    });

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
    };

    $($element).find('[input-with-hover-message]').each(function () {
        var that = this;
        this.oninput = function () {
            $scope.$broadcast('hideAll', that.name);
            for (var checkCase in checkCases[that.name]) {
                if (!checkCases[that.name][checkCase](that.value)) {
                    delayTillLast(that.name, function () {
                        $scope.valid[that.name] = false;
                        var error = {}; error[that.name] = checkCase;
                        $scope.$broadcast('showError', error);
                    }, 500);
                    return;
                }
            }
            delayTillLast(that.name, function () {}, 0);
            $scope.$broadcast('showSuccess', that.name);
            $scope.valid[that.name] = true;
        }
    });

    $scope.valid = {};

    $scope.showSignUpForm = function () {
        $scope.name = "";
        $scope.pwd = "";
        $scope.rpwd = "";
        $scope.email = "";
        $scope.valid = {};
        $($element).modal('show');
    };

    $scope.hideSignUpForm = function () {
        $scope.$broadcast('hideAll');
        $($element).modal('hide');
    };

    $scope.isAllValid = function () {
        return $scope.valid.name && $scope.valid.pwd && $scope.valid.rpwd && $scope.valid.email;
    };

    $scope.submitSignUp = function () {
        User.signUp($scope.name, $scope.pwd, $scope.rpwd, $scope.email).then(function () {
            $scope.hideSignUpForm();
        }).catch(function (error) {
            console.log(error);
            $scope.$broadcast('showError', error);
        });
    };
}]);

app.controller('detailCtrl', ['$scope', '$element', function ($scope, $element) {

    $scope.$on('showUserDetail', function (event, user) {
        $scope.showUserDetail(user);
    });

    $scope.showUserDetail = function (user) {
        $scope.name = user.name;
        $scope.email = user.email;
        $($element).modal('show');
    };

    $scope.hideUserDetail = function () {
        $($element).modal('hide');
    };
}]);

app.controller('newPostCtrl', ['$scope', '$element', 'Post', function ($scope, $element, Post) {

    $scope.$on('showNewPostForm', function (event) {
        $scope.showNewPostForm();
    });

    $scope.showNewPostForm = function () {
        $scope.title = "";
        $scope.content = "";
        $($element).modal('show');
    };

    $scope.hideNewPostForm = function () {
        $($element).modal('hide');
    };

    $scope.isAllValid = function () {
        return $scope.title && $scope.content;
    }

    $scope.submitNewPost = function () {
        Post.newPost($scope.title, $scope.content).then(function () {
            $scope.hideNewPostForm();
        }).catch(function (error) {
            $scope.$broadcast('showError', error);
            console.log(error);
        })
    };
}]);

app.controller('postViewCtrl', ['$scope', '$element', 'User', 'Post', function ($scope, $element, User, Post) {

    $scope.$on('commentCountChange', function (event, count) {
        $scope.post.commentCount = count;
    });

    $scope.signedUserIsEqual = function () {
        return User.currentUser._id == $scope.post.author._id;
    };

    $scope.showEditPostForm = function () {
        $scope.$broadcast('showEditPostForm');
    };

    $scope.hideEditPostForm = function () {
        $scope.$broadcast('hideEditPostForm');
    };

    $scope.submitDeletePost = function () {
        Post.deletePost($scope.post._id).then(function () {
            $($element).animate({left: '-200%', height: '0'}, function () {
                Post.loadPosts();
            });
        });
    };

    $scope.submitHidePost = function () {
        Post.hidePost($scope.post._id).then(function () {
            // replace post by /post/getPost
        }).catch(function (error) {
            console.log(error);
        });
    };

    $scope.submitUnhidePost = function () {
        Post.unhidePost($scope.post._id).then(function () {
            // replace post by /post/getPost
        }).catch(function (error) {
            console.log(error);
        });
    };
}]);

app.controller('showPostCtrl', function ($rootScope, $scope, $element, Post) {

    $scope.$on('showEditPostForm', function (event) {
        $($element).collapse('hide');
    });

    $scope.$on('hideEditPostForm', function (event) {
        $($element).collapse('show');
    });

    $scope.showFullContent = function () {
        if ($scope.post.shorten) {
            Post.loadPost($scope.post._id).then(function (post) {
                $scope.post.content = post.content;
                $scope.post.shorten = false;
            });
        }
    }

    $scope.showUserDetail = function (user) {
        $rootScope.$broadcast('showUserDetail', user);
    };

    $scope.momentConvert = function (date) {
        if (moment(date).endOf('day') > moment()) return moment(date).fromNow();
        else return moment(date).calendar();
    };

    $scope.toggleCommentView = function (post) {
        $scope.$broadcast('toggleCommentView');
    };
});

app.controller('replyViewCtrl', function ($scope, $element, Comment) {

    $scope.toggleFlag = false;

    $scope.replyUserComment = function (user) {
        $scope.$broadcast('replyUserChanged', user);
    };

    $scope.$on('toggleCommentView', function (event) {
        $scope.toggleFlag = !$scope.toggleFlag;
        if ($scope.toggleFlag) {
            Comment.loadComments($scope.post._id).then(function (comments) {
                $scope.comments = comments;
                if (comments.length) {
                    $scope.unWatch = $scope.$on('ngRepeatFinished', function (event) {
                        $($element).collapse('show');
                    });
                } else {
                    $($element).collapse('show');
                }
            }).catch(function (error) {
                console.log(error);
            })
        } else {
            if ($scope.unWatch) $scope.unWatch();
            $($element).collapse('hide');
        }
    });

    $scope.$on('commentChanged', function (event, postId) {
        if (postId == $scope.post._id) {
            $scope.comments = Comment.comments[postId];
            $scope.$emit('commentCountChange', $scope.comments.length);
        }
    });
});

app.controller('newCommentCtrl', function ($scope, $element, Comment) {

    $scope.$on('replyUserChanged', function (event, user) {
        $scope.replyUser = user;
    });

    $scope.cancelReply = function () {
        delete $scope.replyUser;
    };

    $scope.isAllValid = function () {
        return $scope.content;
    };

    $scope.submitNewComment = function () {
        Comment.newComment($scope.post._id, $scope.replyUser ? $scope.replyUser._id : undefined, $scope.content).then(function (comment) {
            $scope.content = "";
        }).catch(function (error) {
            console.log(error);
        });
    };
});

app.controller('commentViewCtrl', function ($scope, $element, User, Post) {

    $scope.signedUserIsEqual = function () {
        return User.currentUser._id == $scope.comment.author._id;
    };

    $scope.showEditCommentForm = function () {
        $scope.$broadcast('showEditCommentForm');
    };

    $scope.hideEditCommentForm = function () {
        $scope.$broadcast('hideEditCommentForm');
    };
});

app.controller('showCommentCtrl', function ($scope, $element, Comment) {
    
    $scope.$on('showEditCommentForm', function (event) {
        $($element).collapse('hide');
    });
    $scope.$on('hideEditCommentForm', function (event) {
        $($element).collapse('show');
    });

    $scope.momentConvert = function (date) {
        return moment(date).calendar();
    };

    $scope.submitDeleteComment = function () {
        Comment.deleteComment($scope.comment._id).then(function () {
            $($element).animate({left: '-200%', height: '0'}, function () {
                Comment.loadComments($scope.comment.postId);
            });
        }).catch(function (error) {
            console.log(error);
        });
    };

    $scope.submitHideComment = function () {
        Comment.hideComment($scope.comment._id, $scope.comment.postId).then(function () {
            // to replace comment by /comment/getComment
        }).catch(function (error) {
            console.log(error);
        });
    };

    $scope.submitUnhideComment = function () {
        Comment.unhideComment($scope.comment._id, $scope.comment.postId).then(function () {
            // to replace comment by /comment/getComment
        }).catch(function (error) {
            console.log(error);
        });
    };

});

app.controller('editCommentCtrl', function ($scope, $element, Comment) {

    $scope.$on('showEditCommentForm', function (event) {
        $scope.content = $scope.comment.content;
        $($element).collapse('show');
    });
    $scope.$on('hideEditCommentForm', function (event) {
        $($element).collapse('hide');
    });

    $scope.isAllValid = function () {
        return $scope.content;
    };

    $scope.submitEditComment = function () {
        Comment.editComment($scope.comment._id, $scope.content).then(function () {
            $scope.comment.content = $scope.content;
            $scope.hideEditCommentForm();
        }).catch(function (error) {
            console.log(error);
        });
    };
});

app.controller('editPostCtrl', function ($scope, $element, Post) {

    $scope.$on('showEditPostForm', function (event) {
        $scope.title = $scope.post.title;
        $scope.content = $scope.post.content;
        $($element).collapse('show');
    });

    $scope.$on('hideEditPostForm', function (event) {
        $($element).collapse('hide');
    });

    $scope.isAllValid = function () {
        return $scope.title && $scope.content;
    };

    $scope.submitEditPost = function () {
        Post.editPost($scope.post._id, $scope.title, $scope.content).then(function () {
            $scope.post.title = $scope.title;
            $scope.post.content = $scope.content;
            $scope.hideEditPostForm();
        }).catch(function (error) {
            console.log(error);
        })
    };
});

app.controller('hoverCtrl', function ($rootScope, $scope, $element, User) {

    $scope.currentUser = User.currentUser;

    $scope.$on('userChanged', function (event) {
        $scope.currentUser = User.currentUser;
    });

    $scope.showNewPostForm = function () {
        $scope.$broadcast('showNewPostForm');
    };

});

app.controller('headerCtrl', function ($rootScope, $scope, $element, User) {

    $scope.currentUser = User.currentUser;

    $scope.$on('userChanged', function (event) {
        $scope.currentUser = User.currentUser;
    });

    $scope.showSignInForm = function () {
        $rootScope.$broadcast('showSignInForm');
    };

    $scope.showSignUpForm = function () {
        $rootScope.$broadcast('showSignUpForm');
    };

    $scope.showUserDetail = function (user) {
        $rootScope.$broadcast('showUserDetail', user);
    };

    $scope.signOut = function () {
        User.signOut();
    };
});

app.controller('searchCtrl', function ($rootScope, $scope, $element, Search) {

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
    };

    $scope.$watch(function () { return $scope.filter; }, function (newValue, oldValue) {
        if (newValue != oldValue) {
            delayTillLast('search', function () {
                Search.search(newValue);
            }, 500);
        }
    });

    $($element).click(function () {
        $(this).removeClass('search-unvisit');
    });
});

app.controller('navCtrl', function ($scope, $element, Navigator) {
    $scope.pageIndex = Navigator.pageIndex;
    $scope.maxPage = Navigator.maxPage;

    $scope.$watch(function () {
        return Navigator.maxPage;
    }, function (newValue, oldValue) {
        if (newValue != oldValue) {
            $scope.maxPage = newValue;
        }
    });

    $scope.$on('pageIndexChanged', function (event) {
        $scope.pageIndex = Navigator.pageIndex;
    });

    $scope.getNumber = function (num) {
        return new Array(num);
    };

    $scope.jumpToPage = function (index) {
        Navigator.jumpToPage(index);
    };

    $scope.nextPage = function () {
        Navigator.nextPage();
    };

    $scope.prePage = function () {
        Navigator.prePage();
    };
});

app.controller('mainCtrl', function ($scope, $http, $rootScope, User, Post) {

    $scope.$on('postsChange', function (event) {
        $scope.posts = Post.posts;
    });

    $scope.$on('userChanged', function (event) {
        $scope.currentUser = User.currentUser;
    });

    $scope.currentUser = User.currentUser;
    $scope.posts = Post.posts;

    $scope.signedUserIsAdmin = function () {
        return User.currentUser.isAdmin;
    };

});