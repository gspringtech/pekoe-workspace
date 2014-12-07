'use strict';
/**
 * Created by alisterpillow on 8/11/2014.
 */
angular.module('pekoeWorkspaceApp.form')
    .service('FormService', ['$rootScope', function () { // $rootScope
        var f = angular.element('<pekoe-fieldset></pekoe-fieldset>');
        f.append('<legend>TXO</legend>'); /// NOT what I want to do
        // however, this bit works as expected... it's called by the directive pekoe-form
        var service = {
            getTree : function () {return f;}
        };
        return service;
    }]);
/*
There are two main options as i see it:
1) Insert the xml into the dom after annotating elements with pekoe-directive-attributes.
 --- disadvantage is I can't see how to get it back again.

2) As previously done:
 - flesh out the xml using the schema
 - use the template to identify the desired form pekoe-nodes
 - follow the 'enhance tree' process to generate a pekoe-node-directive structure
 - compile it.

 2 makes most sense. Just not sure how to attach XML nodes to respective pekoe-nodes form elements
 Will need to create directives for each pekoe-field element. At least that part will make sense.

 */


/*
Think about this:
 http://www.bennadel.com/blog/2603-directive-controller-and-link-timing-in-angularjs.htm

 When AngularJS compiles the DOM, it walks the DOM tree in a depth-first,
 top-down manner. As it walks down the DOM, it instantiates the directive controllers.
 Then, when it gets to the bottom of a local DOM tree branch, it starts linking the
 directives in a bottom-up manner as it walks back up the branch. This doesn't mean that
 all directive controllers are run before all directive linking; it simply means that in a
 local DOM branch, the directive controllers are instantiated before they are linked.

 As you can see, as AngularJS walks the DOM tree,
 it instantiates the directive controllers on the way down; then,
 it links the directives on the way back up.


app.directive(
    "bnOuter",
    function() {

        function Controller( $scope ) {

            console.log( "Outer - Controller" );

        }


        function link( $scope, element, attributes, controller ) {

            console.log( "Outer - Link" );

        }


        // Return directive configuration.
        return({
            controller: Controller,
            link: link
        });

    }
);

*/