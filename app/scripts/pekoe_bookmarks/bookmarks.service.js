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

angular.module('pekoeWorkspaceApp.bookmarks')
    .factory('BookmarksService', ['$http', '$rootScope', function ($http, $rootScope) {
        // Load and manage User bookmarks.
        // will provide
        // get
        // add
        // delete
        // move
        // TODO Bookmarks need a Class and Icon (Form, List, Report etc)

        var myBookmarks = {
            groups: [
                {
                    title: 'Default',
                    items:[
                        {
                            title: 'Welcome',
                            type: 'report',
                            href : '/exist/restxq/pekoe/welcome'},
                        {
                            title: 'Files',
                            type: 'folder',
                            href : '/exist/pekoe-app/files.xql'}]}],
            dirty: false
        };

        // this is more reliable than serialising xml as json, or using x2js or similar.
        // ... as is the converter from Json back to XML below
        function convertBookmarksFromXML(x) { // x is an Angular Object containing a Document

            var groups = x.find('group');
            if (groups.length === 0) {
                return myBookmarks;
            }
            var newBookmarks = {groups:[],dirty: false};
            x.find('group').each(function(){
                var g = $(this);
                var group = {title: g.children('title').text(), items:[] };
                group.type = $(g).attr('type') || '';
                newBookmarks.groups.push(group);
                g.find('item').each(function () {
                    var i = $(this);
                    group.items.push({
                        title:  i.find('title').text(),
                        href:   i.find('href').text(),
                        type:   i.find('type').text(),
                        active: true //i.find('active').text() === 'true'
                    });
                });
            });
            return newBookmarks;
        }

        function newEl(od,n,t) {
            var el = od.createElement(n);
            el.textContent = t;
            return el;
        }

        function convertBookmarksToXML(){
            var od = (new DOMParser()).parseFromString('<pref for="bookmarks"></pref>', 'text/xml');
            var doc = od.documentElement;
            myBookmarks.groups.forEach(function(e) {
                if (e.type === 'locked') {
                    return;
                }
                var g = od.createElement('group');
                var t = od.createElement('title');
                t.textContent = e.title;
                g.appendChild(t);
                e.items.forEach(function (el) {
                    var item = od.createElement('item');
                    item.appendChild(newEl(od,'title',el.title));
                    item.appendChild(newEl(od,'href',el.href));
                    item.appendChild(newEl(od,'type',el.type));
                    g.appendChild(item);
                });
                doc.appendChild(g);
            });
            return od;
        }

        function saveBookmarks () {
            var bookmarks = convertBookmarksToXML();
            //console.log('bookmarks converted',bookmarks);
            //$http.post('/exist/restxq/pekoe/user/bookmarks', bookmarks.documentElement, {headers: {"Content-Type":"text/xml"}}).then(function () {
            //        myBookmarks.dirty = false;
            //    }, function (resp) {
            //        console.warn('Problem saving bookmarks:', resp);
            //    });
            $.ajax({
                url: '/exist/restxq/pekoe/user/bookmarks',
                data:bookmarks,
                type: 'POST',
                processData: false,
                contentType: 'text/xml',
                headers: {'tenant':$http.defaults.headers.common.tenant},
                success: function () {
                    myBookmarks.dirty = false;
                }
            });
        }

        $rootScope.$on('tenant.update', function () { // Broadcast from auth.service
            getBookmarks();
        });

        // Get bookmarks as XML. Convert with X2JS
        //
        function getBookmarks() {
            var config = {headers: {
                'Accept': 'application/xml'
            }};
            return $http.get('/exist/restxq/pekoe/user/bookmarks', config).then(setBookmarks, reportError); // default header is "application/json"
        }



        function setBookmarks(resp) {
            if (!resp) {
                console.warn('BookmarksService setBookmarks NO RESP');
                return;
            }
            var newBookmarks = convertBookmarksFromXML(resp.xml);

            myBookmarks = (newBookmarks) ? newBookmarks : myBookmarks;
            console.log(newBookmarks);


            $rootScope.$broadcast('bookmarks.update');
        }

        function reportError(resp) {
            console.warn('BookmarksService ERROR:', resp);
        }

        function openGroup() {
            var current = myBookmarks.groups[0];
            angular.forEach(myBookmarks.groups, function (group) {
                if (group.open) {
                    current = group;
                    return false; // probably unnecessary as this is such a small array.
                }
            });
            return current;
        }

        var tabInItems = function (tab, items) {
            var inItems = false;
            for (var i in items) {
                if (items[i].href === tab.href) {
                    inItems = true;
                    break;
                }
            }
            return inItems;
        };

        function addTabToCurrentGroup(tab) {
            // TODO make this turn on Edit Mode
            console.log('BookmarksService add tab',tab);
            if (!tab.title || tab.title === '') {
                console.warn('No title for tab',tab);
                return;
            } // must have a title
            var grp = openGroup();

            if (tabInItems(tab,grp.items)) {
                console.warn('Tab already in group');
                return;
            }
            try {
                var bm = {title: tab.title, href: tab.href, type: tab.type};
                if (tab.params) {
                    bm.params = tab.params;
                }
                //var bm = angular.copy(tab); // includes too much - like the frameWindow I've added.
                grp.items.push(bm);
                console.log('add to grp', grp);
            } catch (e) {console.warn('add error',e);}
            myBookmarks.dirty = true;
        }

        // A good reason for using the new ES6 Generators and proxy to construct an JSON object from XML
        // wrap XML in functions to make it appear as JSON

            /*
             var od = pkn.ownerDocument;
             var nn = od.createElement(pkn.nodeName);
             if (pkn.ph) {
             nn.ph = pkn.ph; // link the placeholder info
             if (pkn.hasAttributes()) {
             // only interested in attributes that are also pekoeNodes
             var atts = pkn.attributes;
             for (var i = 0; i< atts.length; i++  ) {
             var a = atts.item(i);
             if ((a.ph) && (a.ph !== null)) {
             var attr = document.createAttribute(a.nodeName);
             attr.nodeValue = "";
             attr.ph = a.ph;
             nn.setAttributeNode(attr);
             }
             }
             }
             }
             // there is no appendSibling method in the DOM
             var sib = pkn.nextSibling;
             var parentN = pkn.parentNode;
             if (sib != null) {
             parentN.insertBefore(nn,sib);
             } else {
             parentN.appendChild(nn);
             }

             */
            // for each group, add a group with a title

            /*
        <group>
            <title>Admin</title>
            <item>
            <href>/exist/pekoe-app/files.xql?collection=/templates</href>
            <active>true</active>
            <type>html</type>
            <title>Templates</title>
            </item>
            <item>
            <href>/exist/pekoe-app/schema.xqm?path=/files/BGAEDU/school-booking-schema.xml</href>
            <active>true</active>
            <type>html</type>
            <title>School Booking Schema</title>
            </item>
            <open>false</open>
            </group>
            */


        // Public API here
        return {
            saveBookmarks : function () {
                saveBookmarks();
            },
            addToCurrentGroup: function (tab) {
                addTabToCurrentGroup(tab);
            },
            bookmarks: function () {
                return myBookmarks;
            },
            loadBookmarks: function () {
                return getBookmarks();
            },
            update: function () {
                getBookmarks();
            }

        };
    }]);
