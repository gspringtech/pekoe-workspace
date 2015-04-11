/**
 * Created by alisterpillow on 22/11/2014.
 *  *
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
angular.module('pekoeWorkspaceApp.bookmarks')
    .directive('pekoeInputItem', function (TabsService) { // always remember to camelCase the name otherwise the directive won't work.
        return {
            restrict: 'E',
            templateUrl: 'views/input-item.html',
            controller: function ($element,$scope){
                // this stuff probably should be in the controller. (but aren't controllers 'bad'?)
                var bookmark = $scope.subitem;
                var inp = $element.find('input');
                // at the moment I don't know how to make this a datepicker. jqui datepicker doesn't work. and angularui bootstrap works but is awkward to use.
                //if (bookmark.param && bookmark.param == 'date') {
                //    console.log('ITSA DATE');
                //    $(inp).datepicker({dateFormat:'yy-mm-dd'});
                //} else {console.log('NOT A DATE:', bookmark.title);}
                inp.on('change',function(){ // This works - now need to add the searchstr.
                    var tab = {title:bookmark.title, type:'search'};
                    tab.href = bookmark.href + '&' + bookmark.param + '=' + this.value;
                    TabsService.add(tab);
                    $scope.$apply();

                });
                inp.on('keyup',function (e){
                        if (e.keyCode == 13) {
                            var tab = {title:bookmark.title, type:'search'};
                            tab.href = bookmark.href + '&' + bookmark.param + '=' + this.value;
                            TabsService.add(tab);
                            $scope.$apply();
                        }
                });
            },
            replace: true,

            link: function() {
            }
        };
    });
