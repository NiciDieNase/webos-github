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
function Github(){

}

Github.authorize = function(login, token){
    Mojo.Log.info("[Github] ==> authorize")
    Github.auth = {
        login: login,
        token: token
    }
    
    
    
    Mojo.Log.info("[Github] <== authorize")
}

Github.request = function(uriTemplate, params, options){
    Mojo.Log.info("[Github] ==> request")
    var uri = uriTemplate.interpolate(params)
    Mojo.Log.info("[Github] === request: Called: " + uri)
    
    // Try here, if uri is called sometimes before
    
    options.postBody = (options.postBody == undefined) ? $H(Github.auth).toQueryString() : $(options.postBody).merge($H(Github.auth)).toQueryString()
    if (options.method == undefined) {
        options.method = "get"
    }
    
    options.onSuccess = function(target, response){
        target(response)
    }
.bind(this, options.onSuccess)
    if (options.onFailure == undefined) {
        options.onFailure = StageAssistant.connectionError
    }
    
    
    if (options.onCreate != undefined) {
        options.onCreate = function(target, response){
            target(response)
        }
.bind(this, options.onCreate)
    }
    
    if (options.onComplete != undefined) {
        options.onComplete = function(target, response){
            target(response)
        }
.bind(this, options.onComplete)
        
    }
    
    options.evalJSON = "false"
    
    Mojo.Log.info("[Github] === request: Request Body " + options.postBody)
    new Ajax.Request("https://github.com/api/v2/json" + uri, options)
    Mojo.Log.info("[Github] <== request")
}

Github.privateFeed = function(options){
    if (options.method == undefined) {
        options.method = "get"
    }
    
    options.onSuccess = function(target, response){
        response.responseXML = new DOMParser().parseFromString(response.responseText, "text/xml");
        response.responseATOM = {
			feed: rss2object(response.responseXML.childNodes[0])
		}
        target(response)
    }
.bind(undefined, options.onSuccess)
    if (options.onFailure == undefined) {
        options.onFailure = StageAssistant.connectionError
    }
    
    options.evalJSON = "false"
    
    Mojo.Log.info("https://github.com/#{login}.private.atom?token=#{token}".interpolate(Github.auth))
    new Ajax.Request("https://github.com/#{login}.private.atom?token=#{token}".interpolate(Github.auth), options)
}

Github.activitiesFeed = function(params, options){
    if (options.method == undefined) {
        options.method = "get"
    }
    
    options.onSuccess = function(target, response){
        response.responseXML = new DOMParser().parseFromString(response.responseText, "text/xml");
        response.responseATOM = {
            feed: rss2object(response.responseXML.childNodes[0])
        }
        target(response)
    }
.bind(undefined, options.onSuccess)
    if (options.onFailure == undefined) {
        options.onFailure = StageAssistant.connectionError
    }
    
    if (options.onCreate != undefined) {
        options.onCreate = function(target, response){
            target(response)
        }
.bind(undefined, options.onCreate)
    }
    
    if (options.onComplete != undefined) {
        options.onComplete = function(target, response){
            target(response)
        }
.bind(undefined, options.onComplete)
    }
    options.evalJSON = "false"
    
    Mojo.Log.info("http://github.com/#{user}.atom".interpolate(params))
    new Ajax.Request("http://github.com/#{user}.atom".interpolate(params), options)
}
