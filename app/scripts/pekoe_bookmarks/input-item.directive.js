/**
 * Created by alisterpillow on 22/11/2014.
 */
'use strict';
angular.module('pekoeWorkspaceApp.bookmarks')
    .directive('pekoeInputItem', function (TabsService) { // always remember to camelCase the name otherwise the directive won't work.
        return {
            restrict: 'E',
            templateUrl: 'scripts/pekoe_bookmarks/input-item.html',
            controller: function ($element,$scope){
                var bookmark = $scope.subitem;
                var inp = $element.find('input');
                inp.on('change',function(){ // This works - now need to add the searchstr.
                    var tab = {title:bookmark.title, type:'html'};
                    tab.href = bookmark.href + '&' + bookmark.params + '=' + this.value;
                    TabsService.add(tab);
                    $scope.$apply();

                });
            },
            replace: true,

            link: function() {
            }
        };
    });
