/*
 * de.kingcrunch.github
 *
 * Copyright 2009 Sebastian "KingCrunch" Krebs <sebastian.krebs@kingcrunch.de>
 *
 * This file is part of "de.kingcrunch.gut".
 * "de.kingcrunch.github" is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * "crunch" is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License
 * along with "de.kingcrunch.github". If not, see <http://www.gnu.org/licenses/>.
 */
var Commit = Class.create(Model, {
    formatters: {
        id: function(value, context){
            context.id = value.substr(0, 8)
        },
        tree: function(value, context){
            context.tree = value.substr(0, 8)
        },
        url: function(value, context){
            context.url_title = value.substr(18)
        },
        committed_date: function(value, context){
            var Ausdruck = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})-(\d{2}):(\d{2})/;
            var result = Ausdruck.exec(value)
            var dateObj = new Date(result[1], parseInt(result[2]) - 1, result[3], parseInt(result[4]) + parseInt(result[7]), result[5], result[6])
            
            dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset())
            
            context.committed_date = Mojo.Format.formatDate(dateObj, {
                date: "short",
                time: "short"
            })
        },
        authored_date: function(value, context){
            var Ausdruck = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})-(\d{2}):(\d{2})/;
            var result = Ausdruck.exec(value)
            var dateObj = new Date(result[1], parseInt(result[2]) - 1, result[3], parseInt(result[4]) + parseInt(result[7]), result[5], result[6])
            
            dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset())
            context.authored_date = Mojo.Format.formatDate(dateObj, {
                date: "short",
                time: "short"
            })
        }
    },
    
    
    initialize: function($super, controller, login, repo, sha){
        $super(controller, {
            uriTemplate: "/commits/show/#{login}/#{repo}/#{sha}",
            responseKey: "commit",
            uriSpecs: {
                login: login,
                repo: repo,
                sha: sha
            },
            itemKey: "item"
        })
    }
})
