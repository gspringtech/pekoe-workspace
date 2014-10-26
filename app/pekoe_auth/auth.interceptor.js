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

 So INSTEAD, when the login form returns success, I redirect back to '/'

 See http://docs.stormpath.com/guides/multi-tenant/
 for this discussion on multi-tenancy
 So if an application needs this identifier with every request, how do you ensure it is transmitted
 to the application in the easiest possible way for your end users?
 The three most common ways are to use one or more of the following:

 Subdomain Name
 Tenant Selection After Login
 Login Form Field

 More than one of these may be supported if you wish to give your customers convenience options. We’ll cover each one next.

 See also
 http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/

 */
/*
Promise API. .get returns a promise.
var example = function () {
    $http.get('/api/server-config')
        .then(function(configResponse) { return $http.get('/api/' + configResponse.data.USER_END_POINT);
    })
        .then(function(userResponse) {
        return $http.get('/api/' + userResponse.data.id + '/items');
    })
        .then(function(itemResponse) { // Display items here
    }, function(error) {
        // Common error handling
    });
};

This is basically what I'm trying to do.

I ask for something (eg bookmarks)
but you tell me to login first, and I do,
but you tell me to set a tenant first,
so I set a tenant,
then ask for the bookmarks
and finally return to the caller.

*/
angular.module('pekoeWorkspaceApp')
    .factory('authInterceptor', ['$rootScope','$q',  function ($rootScope, $q) {
        return {
            // NOTE: can intercept response, responseError, request, requestError

            response: function (response) {
                console.log('INTERCEPTING', response.config.url);
                if (response.status === 204) { // required to login .
                    console.log('204 RESPONSE DATA', response.data);
//                    var deferred = $q.defer();
                    // TODO replace location
//                    $location.url(response.headers('location'));
//                    return deferred.promise;
                }
                return response || $q.when(response);
            },

            responseError: function (response) {
                console.log('Intercept responseERROR', response.status);
                // http-auth-interceptor will handle 401 and 403
                if (response.status === 412) { // Precondition Failed  - no tenant set
//                    var tenant = response.headers('tenant');
//                    if (tenant) {
//                        TenantService.setTenant(tenant); // maybe don't need to do anything now.
//                        return deferred.promise;
//                    }

                    console.log('not handle responseError 412 with data?',response.data);
//                    if (response.data.tenant) {
//                        PrefsService.setTenants(response.data.tenant);
//                        $location.url('tenant');
//                    }

                }
                return $q.reject(response);
            }
        };

    }]);
