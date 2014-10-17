'use strict';
/*
 Auth discussion.
 Send jUsername and j_password to /exist/j_security_check
 and the user will be validated against exist standard security.
 A cookie will be returned - containing a JSESSIONID
 Include this cookie for each following request.

 This doesn't require SSL - but makes much more sense to use it as the passwords are sent in the clear.
 I'd prefer TOKEN based auth, but don't know how to achieve that.

 So the above gets you logged in. How to terminate the session? It's not enough to "lose" the sessionid.

 The process is supposed to work like this:
 - make a request to a protected resource
 - server says 302 "Found" with a redirect to j_security_check PLUS a JSESSIONID cookie
 - send jUsername and j_password AND the cookie to j_security_check (/exist/j_security_check)
 - if successful, server will send back a 302 to the original protected URL
 - BUT my auth handler doesn't do that.

 CURL process:
 send request for resource. 401 Unauthorized
 The problem is that it returns
 JSESSIONID=uuid; Path=/exist instead of Path=/exist/original/request

 Send request for resource - get 401 Unauthorized (jsessionid is invalid)
 Respond by submitting login form to j_security_check - response is 302 Found Location = /exist
 302 handled by XHR and so /exist -> 302 /exist/ -> 302 /exist/apps/dashboard/ -> 302 /exist/apps/dashboard/index.html -> 200 OK

 But I don't want that! I want to interrupt the redirect.

 LOGOUT might be as simple as deleting the session cookie.

 */

angular.module('pekoeWorkspaceApp')
    .controller('AuthCtrl', function ($scope, $http, $location, authService) {
        // TODO remove $scope
        $scope.user = {username: '', password: ''};
        $scope.message = '';
        $scope.submit = function () {
            $http
                .post('/exist/j_security_check',
                    'j_username=' + $scope.user.username + '&j_password=' + $scope.user.password,
                {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'} })
                .success(function (){ // (data, status, headers, config) {
                    authService.loginConfirmed();
                });
        };
    });

/*
 NOTE: FRIDAY 3rd - See page 172 ng-book. "Note that if the response results in a redirect, the XMLHttpRequest will follow
 it ,and the error callback will not be called."
 HOW DO I STOP THIS?

 It appears that the redirect behaviour cannot be stopped. SO must send the correct URL in the first case - simply appending j_sec

 */