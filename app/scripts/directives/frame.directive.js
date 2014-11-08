/**
 * Created by alisterpillow on 4/11/2014.
 */
'use strict';
angular.module('pekoeWorkspaceApp')
    .directive('pekoeFrame', function ($rootScope) { // always remember to camelCase the name otherwise the directive won't work.
        return {
            restrict: 'E',
            template: '<iframe ng-src="{{tab | tabUrl}}" class="pekoeFrame"></iframe>',
            controller: function ($element,$scope){
//                console.log('frame contrller element',$element,'$scope',$scope);
                $element.get(0).onload = function (e){
                    console.log('FRAME IS LOADED',e);
                    $scope.frameLoaded = true;
                    var fr = e.target.contentWindow;
                    if (fr.location.pathname === '/exist/restxq/login') {
                        $scope.$emit('event:auth-loginRequired');
                        // after the login, the src of this page will be returned. Is that of any use?
                        // it would be terribly clever if this frame-controller could cause
                        // the call to be run through the frame content - but I don't think that will happen
                        // also, at this point, there are two Tabs being created for the same content.
                        // WHY?
                    } else {
                        // don't change the title unless the href is different
                        var fullpath = fr.document.location.pathname + fr.document.location.search;
                        if ($scope.tab.href !== fullpath) {
                            $scope.tab.title = fr.document.title;
                            $scope.tab.href = fullpath;
                            $scope.$apply();
                        }

//                        console.log('Want to update href from',$scope.tab.href, 'to',fr.document.location.pathname + fr.document.location.search);

                    }
                };
            },
            replace: true,

            link: function(scope) {
//                console.log('frame directive scope',scope);

                $rootScope.$on('tabs.add',function (){
                    if (scope.tab.active) {
                        console.log('ADD TAB',scope.tab.title);
                    }
                });

                $rootScope.$on('tabs.refresh',function (){ // refresh is broadcast by the tabs.ctrl when the tab select function is called
                    if (scope.frameLoaded && scope.tab.active) {
                        console.log('REFRESH TAB',scope.tab.title);
                        var frame = angular.element('.tab-pane.active iframe');
                        if (frame.length && frame.get && frame.get(0)) {
                            console.log('reload it');
                            frame.get(0).contentWindow.location.reload();
                        }

                    }
                });
                $rootScope.$on('tabs.reload',function (){
                    if (scope.tab.active) {
                        console.log('RELOAD TAB',scope.tab.title);
//                        console.log('ACTIVE THING IS ', angular.element('.tab-pane.active iframe'));
                        angular.element('.tab-pane.active iframe').get(0).contentWindow.location = scope.tab.href;
                    }
                });
//                console.log('scope.tab is',scope.tab);
                // commented... is the lodash version using _.debounce to reduce the number of calls.
                // might be worth using if resize is a problem for many tabs.

//          angular.element($window).on('resize', $window._.debounce(function() {
//              scope.$broadcast('resize::resize');
//          },500));


            }
        };
    });