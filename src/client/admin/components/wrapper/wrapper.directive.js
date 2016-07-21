(function () {
    'use strict';

    function wrapperController($scope, $rootScope, $location, $timeout, HTTPService, adminAppModel, $mdToast, $mdDialog){

        var ctrl = this;

        // Temporary
        // ctrl.showStyleFinder = true;

        ctrl.hideAllTemplates = function() {
            ctrl.showHome = false;
            ctrl.showAdmin = false;
            ctrl.showStyleFinder = false;
            ctrl.showQuoteBuilder = false;
            ctrl.showClientDashboard = false;
            ctrl.showArchitectDashboard = false;
            ctrl.showSelectArchitect = false;
        };

        ctrl.modals = {
            signup: {
                controller: signupCtrl,
                template: 'admin/wrapper/templates/signupModal.html'
            },
            login: {
                controller: loginCtrl,
                template: 'admin/wrapper/templates/loginModal.html'
            },
            forgot: {
                controller: forgotCtrl,
                template: 'admin/wrapper/templates/forgotModal.html'
            },
            reset: {
                controller: resetCtrl,
                template: 'admin/wrapper/templates/resetModal.html'
            },
            users: {
                controller: usersCtrl,
                template: 'admin/wrapper/templates/usersModal.html'
            },
            accept: {
                controller: acceptCtrl,
                template: 'admin/wrapper/templates/acceptModal.html'
            }
        };


        $scope.parseUrl = function() {
            var url = $location.absUrl();

            if(url.indexOf('admin') > -1){

                if(adminAppModel.userData && adminAppModel.userData.isAdmin){
                    ctrl.hideAllTemplates();
                    ctrl.showAdmin = true;
                }
                return;

            }else if(url.indexOf('user/accept') > -1) {

                ctrl.showModal('accept', true);
                ctrl.hideLogin = true;
                return;

            }if(url.indexOf('/forgot') > -1){

                ctrl.showModal('reset', true);
                ctrl.hideLogin = true;
                return;

            }
        };

        $scope.$on('showStyleFinder', function() {
            ctrl.hideAllTemplates();
            ctrl.showStyleFinder = true;
        });

        $scope.$on('showSelectArchitect', function() {
            ctrl.hideAllTemplates();
            ctrl.showSelectArchitect = true;
        });

        $scope.$on('showQuoteBuilder', function() {
            ctrl.hideAllTemplates();
            ctrl.showQuoteBuilder = true;
        });

        $scope.$on('showClientDashboard', function() {
            ctrl.hideAllTemplates();
            ctrl.showClientDashboard = true;
        });

        $scope.$on('getUserData', function() {
            ctrl.getUserData();
        });

        $scope.$on('showSignUpModal', function() {
            ctrl.showModal('signup', false);
        });

        $scope.$on('showLoginModal', function() {
            ctrl.showModal('login', false);
        });

        $scope.$on('showForgotModal', function() {
            ctrl.showModal('forgot', false);
        });

        $scope.$on('showResetModal', function() {
            ctrl.showModal('reset', false);
        });

        ctrl.showManageUsers = function(event) {
            ctrl.showModal('users', false);
        };

        $scope.$on('hideModal', function() {
            $mdDialog.hide();

            ctrl.showBackdrop = false;
        });

        ctrl.getUserData = function() {
            HTTPService.get(adminAppModel.APIUrl + '/user', function(success, response){
                if(success){
                    if(response.data && response.data.data && response.data.data.username){
                        ctrl.onUserDataReceived(response.data.data);
                    }else{
                        ctrl.hideAllTemplates();
                        ctrl.showHome = true;
                        ctrl.userData = undefined;
                        adminAppModel.userData = undefined;
                    }
                    $scope.parseUrl();
                    // else{
                    //     if(!ctrl.hideLogin){
                    //         ctrl.showModal('login', true);
                    //     }
                    // }
                }else{
                    console.log('=========== failed ', response);
                }
            });
        };

        var getUserTimeout;
        ctrl.getUserDataWhenReady = function() {
            if(adminAppModel){
                ctrl.getUserData();
                $timeout.cancel(getUserTimeout);
            }else{
                getUserTimeout = $timeout(function() {
                    ctrl.getUserDataWhenReady
                }, 200);
            }
        };
        ctrl.getUserDataWhenReady();
            
        

        ctrl.onUserDataReceived = function(data) {

            if(data && data.isArchitect){
                ctrl.hideAllTemplates();
                ctrl.showArchitectDashboard = true;
            }else if(data && !data.styleFinderComplete){
                ctrl.hideAllTemplates();
                ctrl.showStyleFinder = true;
            }else{
                ctrl.hideAllTemplates();
                ctrl.showClientDashboard = true;
            }

            adminAppModel.userData = data;
            ctrl.userData = data;
            $rootScope.$broadcast('userDataReceived', data);
        };

        ctrl.showModal = function(modalName, showBackdrop) {

            // if(showBackdrop){
            //     ctrl.showBackdrop = true;
            // }else{
            //     ctrl.showBackdrop = false;
            // }

            $mdDialog.show({
                controller: ctrl.modals[modalName].controller,
                templateUrl: ctrl.modals[modalName].template,
                parent: angular.element(document.body),
                targetEvent: event,
                locals: {}
            });
        };

        ctrl.logout = function() {
            HTTPService.get(adminAppModel.APIUrl + '/user/logout', function(success, response){
                if(success){
                    console.log('============ successful! ', response);
                    ctrl.getUserData();
                    // ctrl.onUserDataReceived(response.data.data);
                    // ctrl.hideAllTemplates();
                    // ctrl.showHome = true;

                }else{
                    console.log('=========== failed ', response);
                }
            });
        };

        ctrl.showToaster = function(msg) {
            $mdToast.show(
              $mdToast.simple()
                .content(msg)
                .position('top right')
                .hideDelay(3000)
            );
        };

        $scope.parseUrl();

    }

    wrapperController.$inject = ['$scope', '$rootScope', '$location', '$timeout', 'HTTPService', 'adminAppModel', '$mdToast', '$mdDialog'];



    function signupCtrl($scope, $rootScope, $timeout, $mdDialog, $mdToast, HTTPService, adminAppModel) {

        $scope.close = function() {
            $rootScope.$broadcast('hideModal');
        };

        $scope.submitSignupForm = function(data) {
            if(data.password !== data.confirmPassword){
                return $scope.showToaster('Please make sure the passwords match');
            }

            var username = data.email;
            var password = data.password;
                        
            var url = adminAppModel.APIUrl + '/user/signup';
            HTTPService.post(url, data, function(success, data){
                if(success){

                    var user = {
                        username: username,
                        password: password
                    };

                    HTTPService.post(adminAppModel.APIUrl + '/user/login', user, function(success, response){
                        if(success){
                            $rootScope.$broadcast('getUserData');
                            $scope.showToaster('Thank you - Welcome to Hearth!');
                            $rootScope.$broadcast('hideModal');
                        }else{
                            $scope.loginFailure = true;
                        }
                    });

                }else{
                    $scope.showToaster('Sorry, there was a problem - please check your internet connection and try again.');
                }
            });
        };

        $scope.showLoginModal = function() {
            $rootScope.$broadcast('showLoginModal');
            $scope.close();
        };

        $scope.showToaster = function(msg) {
            $mdToast.show(
              $mdToast.simple()
                .content(msg)
                .position('top right')
                .hideDelay(3000)
            );
        };

    }

    signupCtrl.$inject = ['$scope', '$rootScope', '$timeout', '$mdDialog', '$mdToast', 'HTTPService', 'adminAppModel'];



    function loginCtrl($scope, $rootScope, $timeout, $mdDialog, $mdToast, HTTPService, adminAppModel) {

        // setTimeout(function(){
        //     var backdropEl = document.getElementsByTagName('md-backdrop')[0];
        //     var backdrop = angular.element( backdropEl );
        //     backdrop.css({ 'background-color': '#ccc', 'opacity': '1', 'transition': 'none' });
        // });

        $scope.close = function(showLogin) {
            $rootScope.$broadcast('hideModal');
        };

        $scope.login = function(user) {
            HTTPService.post(adminAppModel.APIUrl + '/user/login', user, function(success, response){
                if(success){
                    $rootScope.$broadcast('getUserData');
                    $scope.showToaster('Success logging in');
                    $scope.loginFailure = false;
                    $rootScope.$broadcast('hideModal');
                }else{
                    $scope.loginFailure = true;
                }
            });
        };

        $scope.showForgot = function() {
            $rootScope.$broadcast('hideModal');
            $rootScope.$broadcast('showForgotModal');
        };

        $scope.showToaster = function(msg) {
            $mdToast.show(
              $mdToast.simple()
                .content(msg)
                .position('top right')
                .hideDelay(3000)
            );
        };

    }

    loginCtrl.$inject = ['$scope', '$rootScope', '$timeout', '$mdDialog', '$mdToast', 'HTTPService', 'adminAppModel'];




    function forgotCtrl($scope, $rootScope, $timeout, $mdDialog, $mdToast, HTTPService, adminAppModel) {

        // setTimeout(function(){
        //     var backdropEl = document.getElementsByTagName('md-backdrop')[0];
        //     var backdrop = angular.element( backdropEl );
        //     backdrop.css({ 'background-color': '#ccc', 'opacity': '1', 'transition': 'none' });
        // });

        $scope.close = function(showLogin) {
            $rootScope.$broadcast('hideModal');
            if(showLogin){
                $rootScope.$broadcast('showLoginModal');
            }
        };

        $scope.submitForgotForm = function(data) {
           var url = adminAppModel.APIUrl + '/user/forgot/';
            HTTPService.post(url, data, function(success){
                if(success){
                    $scope.showForgotForm = false;
                    $scope.showToaster('Thank you - we\'re sending you an email with further instructions');
                    $scope.disableForgotForm = true;
                }else{
                    $scope.showToaster('Sorry, we don\'t recognize that email address');
                }
            });
        };

        $scope.showToaster = function(msg) {
            $mdToast.show(
              $mdToast.simple()
                .content(msg)
                .position('top right')
                .hideDelay(3000)
            );
        };

    }

    forgotCtrl.$inject = ['$scope', '$rootScope', '$timeout', '$mdDialog', '$mdToast', 'HTTPService', 'adminAppModel'];




    function resetCtrl($scope, $rootScope, $timeout, $location, $mdDialog, $mdToast, HTTPService, adminAppModel) {

        // setTimeout(function(){
        //     var backdropEl = document.getElementsByTagName('md-backdrop')[0];
        //     var backdrop = angular.element( backdropEl );
        //     backdrop.css({ 'background-color': '#ccc', 'opacity': '1', 'transition': 'none' });
        // });

        $scope.close = function() {
            $rootScope.$broadcast('hideModal');
            $rootScope.$broadcast('showLoginModal');
        };

        $scope.checkResetToken = function() {
            var url = $location.absUrl();
            var data = {
                resetToken: url.substring(url.lastIndexOf('/') + 1, url.length)
            };
            
            HTTPService.post(adminAppModel.APIUrl + '/user/reset/checktoken/', data, function(success, resetObj){
                if(success){
                    $scope.resetData = resetObj.data.data;
                    console.log('resetData = ', resetObj);
                }else{
                    $scope.showToaster('Sorry, we don\'t recognize your Password Reset Token');
                }
            });
        };
        $scope.checkResetToken();

        $scope.submitResetForm = function(data) {
           if(data.password !== data.confirmPassword){
                return $scope.showToaster('Please make sure the passwords match');
            }
            
            data.email = $scope.resetData.email;
            
            var url = adminAppModel.APIUrl + '/user/reset/';
            HTTPService.post(url, data, function(success, data){
                if(success){
                    $scope.showToaster('Password successfully reset!');
                    $scope.close();
                }else{
                    console.log('Error resetting password', data);
                }
            });
        };

        $scope.showToaster = function(msg) {
            $mdToast.show(
              $mdToast.simple()
                .content(msg)
                .position('top right')
                .hideDelay(3000)
            );
        };

    }

    resetCtrl.$inject = ['$scope', '$rootScope', '$timeout', '$location', '$mdDialog', '$mdToast', 'HTTPService', 'adminAppModel'];




    function usersCtrl($scope, $rootScope, $timeout, $location, $mdDialog, $mdToast, HTTPService, adminAppModel) {

        $scope.newUser = {};
        $scope.newUser.admin = false;

        $scope.close = function() {
            $rootScope.$broadcast('hideModal');
        };

        $scope.getUserList = function() {
            var url = adminAppModel.APIUrl + '/user/list';
            HTTPService.get(url, function(success, data){
                if(success){
                    console.log('User List = ', data.data.data);
                    $scope.users = data.data.data;
                }else{
                    console.error(data);
                }
                
            });
        };
        $scope.getUserList();

        $scope.inviteUser = function(newUser) {
            var url = adminAppModel.APIUrl + '/user/invite';
            HTTPService.post(url, newUser, function(success, data){
                if(success){
                    if(data.userAlreadyExists) {
                        $scope.userAlreadyExists = true;
                    }else{
                        $scope.showToaster('Success! Invitation email sent.');
                        $scope.userAlreadyExists = false;
                        $scope.showNewUserForm = false;
                        $scope.newUser = '';
                    }
                }else{  
                    console.error('Error inviting user: ', data);
                }
            });
        };

        $scope.deleteUser = function(event, userId) {
            event.stopPropagation();

            var msg = 'Are you sure you want to delete this user? This can\'t be undone.';
            if( !window.confirm(msg) ){ return; } 

            var url = adminAppModel.APIUrl + '/user/delete';
            HTTPService.post(url, {userId: userId}, function(success, data){
                if(success){
                    $scope.showToaster('Success! User Deleted.');
                    $scope.getUserList();
                }else{
                    console.error('Failure deleting user: ', data);
                }
                
            });
        };

        $scope.showToaster = function(msg) {
            $mdToast.show(
              $mdToast.simple()
                .content(msg)
                .position('top right')
                .hideDelay(3000)
            );
        };

    }

    usersCtrl.$inject = ['$scope', '$rootScope', '$timeout', '$location', '$mdDialog', '$mdToast', 'HTTPService', 'adminAppModel'];




    function acceptCtrl($scope, $rootScope, $timeout, $location, $mdDialog, $mdToast, HTTPService, adminAppModel) {


        $scope.close = function() {
            $rootScope.$broadcast('hideModal');
        };

        $scope.submitAcceptForm = function(data) {
            if(data.password !== data.confirmPassword){
                return $scope.showToaster('Please make sure the passwords match');
            }
                        
            var url = adminAppModel.APIUrl + '/user/accept';
            HTTPService.post(url, data, function(success, data){
                if(success){
                    $scope.showToaster('Welcome to DI-Dash!');
                    $rootScope.$broadcast('hideModal');
                    window.location.href = '/';
                }else{
                    console.log('Error accepting invitation', data);
                }
            });
        };

        $scope.showToaster = function(msg) {
            $mdToast.show(
              $mdToast.simple()
                .content(msg)
                .position('top right')
                .hideDelay(3000)
            );
        };

    }

    acceptCtrl.$inject = ['$scope', '$rootScope', '$timeout', '$location', '$mdDialog', '$mdToast', 'HTTPService', 'adminAppModel'];




    function wrapperDirective() {
        return {
            restrict: 'E',
            templateUrl: 'admin/wrapper/wrapper.html',
            scope: {
            },
            controller: wrapperController,
            controllerAs: 'wrapperCtrl',
            bindToController: true
        };
    }

    angular.module('admin.components.wrapper')
        .directive('wrapper', wrapperDirective);
})();
