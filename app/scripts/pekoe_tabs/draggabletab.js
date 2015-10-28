/**
 * Created by alisterpillow on 25/10/2014.
 *
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
'use strict';

/**
 * @ngdoc directive
 * @name pekoeWorkspaceApp.directive:draggableTab
 * @description
 * # draggableTab
 */
angular.module('pekoeWorkspaceApp')
  .directive('draggableTab', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
          attrs.$set('draggable',true);
          element.on('dragstart', function (ev){
              //$rootScope.$broadcast('event:tab-drag-start');
              ev.originalEvent.dataTransfer.setData('application/json',angular.toJson(scope.tab));

          });
      }
    };
  });

// TODO Show the user if a Bookmark already exists
angular.module('pekoeWorkspaceApp')
    .directive('droppable', function () {
        return {
            restrict: 'A',
            link: function postLink(scope, element) {


                element.on('dragover', function (ev){
                    ev.preventDefault();
                  // want some kind of memoization here and a '.has(tab)' method on the group or bookmarks
                  // the memoized function will work out the result of the '.has(tab)', and set the class on the element
                  // to either bg-success or bg-warning
                  // on drop, the bg-warning will indicate 'no further action'
                  // probably could put the tab object on the scope.
                    //console.log(scope.group); YES
                    //var transferredData = ev.originalEvent.dataTransfer.getData('application/json');
                    //var data = JSON.parse(transferredData);
                    //if (scope.group.has())
                    element.parent().addClass('bg-success'); // this is a generated 'div.panel-body'
                })
                .on('dragleave',function(ev){
                    ev.preventDefault();
                    element.parent().removeClass('bg-success');
                })
                .on('drop', function (ev){
                        //console.log('got drop');
                    ev.preventDefault();
                    element.parent().removeClass('bg-success');
                    var transferredData = ev.originalEvent.dataTransfer.getData('application/json');
                    var data = JSON.parse(transferredData);
                    scope.bgc.add(data); // THIS IS THE BOOKMARKS ITEM CONTROL
                });
            }
        };
    });

