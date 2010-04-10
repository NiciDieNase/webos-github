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

function Repository(login, repo){
    this.login = login
    this.repo = repo
    this.watcher = ""
}

Repository.mapping = new Hash()

Repository.prototype.refresh = function(options){
    options = options || new Object()
    options.onSuccess = function(response){
        Mojo.Log.info("[Repository] === refresh -> onSuccess")
        Mojo.Log.info("[Repository] === refresh : " + response.responseText)
        
        Repository.mapping[this.login + "/" + this.repo] = Mojo.Model.format(response.responseJSON.repository,Repository.formatters)
        
        this.update()
        Mojo.Log.info("[Repository] === refresh <- onSuccess")
    }
.bind(this)
    
    options.method = "get"
    
    Mojo.Log.info("[Repository] ==> refresh")
    Github.request("/repos/show/#{user}/#{repo}", {
        user: this.login,
        repo: this.repo
    }, options)
    Mojo.Log.info("[Repository] <== refresh")
}

Repository.prototype.update = function(options){
    if (Repository.mapping[this.login + "/" + this.repo] == undefined) {
        this.refresh(options)
    }
    else {
        this.item = Repository.mapping[this.login + "/" + this.repo]
        
        this.watcher()
    }
}


Repository.prototype.bindWatcher = function(watcher){
    this.watcher = watcher
}

Repository.formatters = {
    homepage: function(value, context){
        if (value.substr(0, 11) == "http://www.") {
            context.homepage_title = value.substr(11)
        }
        else {
            if (value.substr(0, 7) == "http://") {
                context.homepage_title = value.substr(7)
            }
            else {
                context.homepage_title = value
            }
        }
    },
	url: function (value,context){
		context.url_title = value.substr(18)
	},
    "private": function (value,context) {
        if (value) {
            context["private"] = "yes"
        } else {
            context["private"] = "no"
        }
    },
	fork: function (value,context) {
		if (value) {
			context.fork = "yes"
		} else {
			context.fork = "no"
		}
	}
}

