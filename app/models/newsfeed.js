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
var Newsfeed = Class.create({
	loaded:false,


    initialize: function(assistant, login){
        this.assistant = assistant
        this.login = login
		this.loaded = false
    },
    
    refresh: function(options){
        Mojo.Log.info("[Newsfeed] ==> refresh")
        options = options || new Object()
        options.onSuccess = function(response){
            Mojo.Log.info("[Newsfeed] === refresh -> onSuccess")
            this.entry = response.responseATOM.feed.entry
            this.entry = this.entry.collect(function(item){
                return Mojo.Model.format(item, this.formatters)
            }, this)
            Mojo.Log.info(Mojo.Log.propertiesAsString(response.responseATOM.feed.entry[0]))
            
			this.loaded = true
            this.assistant.controller.modelChanged(this)
        }
.bind(this)
        
        options.method = "get"
        
        Github.privateFeed(options)
    },
    
    update: function(options){
		if (!this.loaded) {
			this.refresh(options)
		}
    },
    
    formatters: {
        updated: function(value, context){
            context.updated = Mojo.Format.formatDate(iso2date(value), {
                date: "long",
                time: "short"
            })
        },
        published: function(value, context){
            context.published = Mojo.Format.formatDate(iso2date(value), {
                date: "long",
                time: "short"
            })
        }
    }
})
