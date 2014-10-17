/**
 * Created by alisterpillow on 17/10/2014.
 */
customDirectives = angular.module('customDirectives', []);
customDirectives.directive('customPopover', function(){
    return {
        restrict: 'A',
        template: '<span>{{label}}</span>',
        link: function (scope, el, attrs) {
            scope.label = attrs.popoverLabel;

            $(el).popover({
                trigger: 'click',
                html: true,
                content: attrs.popoverHtml,
                placement: attrs.popoverPlacement
            });
    }
};
});

customDirectives.directive('customCollapse', function () {
    return {
        require: '?ngModel',
        scope:{
            ngModel: '='
        },
        restrict: 'A',
        templateUrl: 'directives/templates/bookmark-items.html',
        link: function(scope, el, attrs) {
            scope.panelBaseId = attrs.collapsePanelBodyId;
            scope.panelId = attrs.collapsePanelId;

            $(document).ready(function(){
                console.log('customCollapse ngModel',scope.ngModel);
                angular.forEach(scope.ngModel, function(value, key){
                    console.log('customCollapse value',value);
                    if (value.collapsed)
                    {
                        $("#" + scope.panelBaseId + "-" + key).collapse('show');
                    }
                });
            });

            scope.toggleCollapsedStates = function(ind){
                angular.forEach(scope.ngModel, function(value, key){
                    if (key == ind)
                    {
                        scope.ngModel[key].collapsed = !scope.ngModel[key].collapsed;
                        $("#" + scope.panelBaseId + "-" + ind).collapse('toggle');
                    }
                    else
                        scope.ngModel[key].collapsed = false;
                });
            }
        }
    };
});