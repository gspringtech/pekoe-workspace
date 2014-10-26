'use strict';
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

angular.module('pekoeWorkspaceApp')
    .controller('AuthCtrl',['$scope', '$http','$modal','AuthService','authService' ,function ($scope, $http, $modal, AuthService,authService) {
        $scope.user = {username: '', password: ''};
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

/*
 NOTE: FRIDAY 3rd - See page 172 ng-book. "Note that if the response results in a redirect, the XMLHttpRequest will follow
 it ,and the error callback will not be called."
 HOW DO I STOP THIS?

 It appears that the redirect behaviour cannot be stopped. SO must send the correct URL in the first case - simply appending j_sec

 */