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
    .factory('authInterceptor', ['$rootScope','$q', '$location',  function ($rootScope, $q, $location) {
        return {
            // NOTE: can intercept response, responseError, request, requestError
            request: function (config) {
                if (!config.headers.tenant){
                    console.warn('No Tenant in Request Header');
                }
                //config.headers.tenant = PrefsService.getTenant();
                return config;
            },
            // what is a requestError?
//            request: function (config) {
//                config.headers = config.headers || {};
//                console.log("authInterceptor request",config.url);
//                // Don't have to do anything - the cookie is automatically included in each request (i think)
//                return config;
//            },
//            requestError: function(config) {
//                console.log("authInterceptor REQUEST ERROR");
//            },
            response: function (response) {
                console.log('authInterceptor Response',response.status);
              if (response.status === 204) {
                console.log('204 RESPONSE DATA',response);
                  var deferred = $q.defer();
                  $location.url(response.headers('location'));
                  return deferred.promise;
              }
              return response;
            },

            responseError: function (response) {
                console.log('authInterceptor responseERROR', response.status);
                var deferred = $q.defer();
                if (response.status === 401) { // user is not authorized
//                    var deferred = $q.defer();
//                    handle the case where the user is not authenticated
//                    $window.location = '/#/login';
                    $location.url('login');
//                    $location.path('/#/login'); // this causes infinite redirection
                    return deferred.promise;
                } else if (response.status === 403) { // user is not authorized

                    // handle the case where the user is not authenticated
//                    $window.location = '/#/login';
                    $location.url('login');
//                    $location.path('/#/login'); // this causes infinite redirection
                    return deferred.promise;

                    // MAYBE if there's
                } else if (response.status === 412) { // Precondition Failed  - no tenant set
//                    var tenant = response.headers('tenant');
//                    if (tenant) {
//                        TenantService.setTenant(tenant); // maybe don't need to do anything now.
//                        return deferred.promise;
//                    }
                    console.log('412 with data?',response.data);
//                    if (response.data.tenant) {
//                        PrefsService.setTenants(response.data.tenant);
//                        $location.url('tenant');
//                    }
                    return deferred.promise;
                }
                return response;
            }
        };

    }]);
