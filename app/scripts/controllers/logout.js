'use strict';

angular.module('pekoeWorkspaceApp')
    .controller('LogoutCtrl', function ($scope, $http) {
        // hooray! that's it. session:invalidate()
        $http.get('/exist/rest/db/pekoe/logout.xql');
    });
