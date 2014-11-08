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
              ev.originalEvent.dataTransfer.setData('application/json',angular.toJson(scope.tab));
          });
      }
    };
  });

angular.module('pekoeWorkspaceApp')
    .directive('droppable', function () {
        return {
            restrict: 'A',
            link: function postLink(scope, element) {
                element.on('dragover', function (ev){
                    ev.preventDefault();
                });
                element.on('drop', function (ev){
                    ev.preventDefault();

                    var data = JSON.parse(ev.originalEvent.dataTransfer.getData('application/json'));
                    // Now just need to get this into the array of bookmarks at this point

                    console.log('got data',data,'for scope',scope); // LI got the drop

//                    console.log('scope.parent',scope.$parent);
//                    console.log('scope.parent prent',scope.$parent.$parent);
//                    scope.$parent.group.items.push({title:'test data',href:'/one/two'});
                    // this is the simplistic approach. The item will be added without checking for identity

                    scope.bgc.add(data); // THIS IS THE BOOKMARKS ITEM CONTROL
//                    scope.bc.add(data); // this is THIS.ADD on Bookmarks Control
//                    scope.group.items.push(data);
                });
            }
        };
    });

