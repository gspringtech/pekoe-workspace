'use strict';
/**
 * Created by alisterpillow on 17/11/2014.

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

 * Original code here from http://icelab.com.au/articles/levelling-up-with-angularjs-building-a-reusable-click-to-edit-directive/
 */

angular.module('pekoeWorkspaceApp')
    .directive('contenteditable', function (){
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        function read() {
          ngModel.$setViewValue(element.html());
        }

        ngModel.$render = function () {
          element.html(ngModel.$vieValue || '');
        };

        element.bind('blur change',function() {
          scope.$apply(read);
        });
      }
    };
  });
