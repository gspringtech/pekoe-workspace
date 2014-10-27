'use strict';

angular.module('pekoeWorkspaceApp.auth')
    .controller('LogoutCtrl', function ($scope, $http) {
        // hooray! that's it. session:invalidate()
        // TODO might want to broadcast a logout event or something so that services can clean up
        $http.get('/exist/rest/db/pekoe/logout.xql');
    });
