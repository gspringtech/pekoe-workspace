/**
 * Created by alisterpillow on 17/10/2014.
 * Thanks to http://subliminalsources.com/81/angularjs-ui-component-directives/
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
        controller: function ($attrs) {
            this.atts = $attrs.getOwnPropertyNames;
        },
        controllerAs : 'group',
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

customDirectives.directive('customTabs', function () {
   return {
       restrict: 'A',
       require: '?ngModel',
       scope: { ngModel: '='},

       templateUrl: 'views/tabContent.html',
       link: function (scope, el, attrs) {
           scope.contentBaseId = attrs.tabsBaseId;
       }

   };
});

customDirectives.directive('customModals', function ($http) {
    return {
        restrict: 'A',
        require: '?ngModel',
        transclude: true,
        scope:{
            ngModel: '='
        },
        template: '<div id="{{modalId}}" class="modal fade">\
  <div class="modal-dialog">\
    <div class="modal-content">\
      <div class="modal-footer">\
        {{modalContents}}\
        <button type="button" class="btn btn-primary" data-dismiss="modal">Ok</button>\
      </div>\
    </div>\
  </div>\
</div>',
        link: function(scope, el, attrs){
            scope.modalId = attrs.modalId;

            $http.jsonp(attrs.modalSrc); // returns a function call to ...


            getContents = function(data){
                scope.modalContents = data.contents; // contents = "<div id={{modalId}} class=modal fade> etc
            };

            /*
            This script takes advantage of the $.json behaviour: when a json containing a function is loaded,
            the script is evaluated. The source (modal-example.js) contains a call to the getContents function above
            getContents({contents: " string "})
            where the contents
             */
        }
    }});