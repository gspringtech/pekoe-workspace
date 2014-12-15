'use strict';
// THIS MAY BE OBSOLETE
/*
 Auth discussion.
 Send jUsername and j_password to /exist/j_security_check
 and the user will be validated against exist standard security.
 A cookie will be returned - containing a JSESSIONID
 Include this cookie for each following request.

 This doesn't require SSL - but makes much more sense to use it as the passwords are sent in the clear.

 Logout is a call to /exist/rest/logout.xql which simply calls session:invalidate()

 TODO decide what to do after logout.
 Currently, the goodbye page shows a Login-again link which does href='/login'.
 It doesn't hide any existing content.
 */

angular.module('pekoeWorkspaceApp.auth')
    .controller('AuthCtrl',['$scope', '$http','$modal','AuthService','authService' ,function ($scope, $http, $modal, AuthService,authService) {
        $scope.user = {username: '', password: ''};
        //console.log('AuthCtrl');
        $scope.message = '';
        angular.element('#myModal').modal('hide');
        $scope.submit = function () {
            $http
                .post('/exist/j_security_check',
                    'j_username=' + $scope.user.username + '&j_password=' + $scope.user.password,
                {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'} })
                .success(function (){ // (data, status, headers, config) {
                    authService.loginConfirmed();
                });
        };
    }]);
