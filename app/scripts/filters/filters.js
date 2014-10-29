'use strict';
// I made this!
angular.module('pekoeWorkspaceApp')
  .filter('xmlAttr', function () {
    return function (input, attrName) {
//        console.log('input is',input);
      return angular.element(input).attr(attrName);
    };
  })
    .filter('xmlChild',function () {
        return function (input, el) { // will select 'el' or return all children
            if (el) {
                return angular.element(input).find(el);
            }
            return angular.element(input).children();
        };
    });

angular.module('pekoeWorkspaceApp')
    .filter('trustedUrl',['$sce', function ($sce){
        return function (val){
            if (val === '/') {
                console.log('going to set url to /list');
                return $sce.trustAsResourceUrl('/list');
            }
            return $sce.trustAsResourceUrl('/exist/restxq/' + val);
        };
    }]);

// but probably better to try this ...
// http://www.bennadel.com/blog/2450-using-ngcontroller-with-ngrepeat-in-angularjs.htm