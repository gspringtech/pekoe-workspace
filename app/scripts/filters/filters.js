'use strict';
/*
* Pekoe Workspace provides a wrapper for the Pekoe Job Manager
* Copyright (C) 2009,2010,2011-2014 Geordie Springfield Pty Ltd (Australia)
* Author: Alister Pillow alisterhp@me.com

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
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
    })
    .filter('tabUrl',['$sce', function ($sce){
        return function (tab){
//            var path = (tab.collection) ? '?collection=' + tab.collection : '';
//            var trustedURL = tab.href;
//            var h = $('div.tab-content').innerHeight();
            return $sce.trustAsResourceUrl(tab.href);
        };
    }])
    .filter('hrefpath', function (){
        return function (input){
            return (input.indexOf('exist/') === -1) ? input : input.substring(input.indexOf('exist/') + 5 );
        };
    })
    .filter('formUrl',['$sce', function ($sce){
        return function (tab){
//            var path = (tab.collection) ? '?collection=' + tab.collection : '';
//            var trustedURL = tab.href;
            return $sce.trustAsResourceUrl('/pekoe-form/index.html?job=' + tab.href);
        };
    }]);



// but probably better to try this ...
// http://www.bennadel.com/blog/2450-using-ngcontroller-with-ngrepeat-in-angularjs.htm
