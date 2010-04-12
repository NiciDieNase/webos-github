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
function Tags(assistant, login, repo){
    this.assistant = assistant
    this.login = login
    this.repo = repo
    this.watcher = ""
    
    this.items = []
    
    this.type = "tags"
    
}

Tags.mapping = new Hash()

Tags.prototype.refresh = function(options){
    options = options || new Object()
    options.onSuccess = function(response){
        Mojo.Log.info("[ReCommitspos] === refresh -> onSuccess")
        Mojo.Log.info("[Commits] === refresh : " + response.responseText)
        
        Tags.mapping[this.login + "/" + this.repo + "/" + this.type] = $H(response.responseJSON[this.type]).collect(function(pair){
			Mojo.Log.info(Mojo.Log.propertiesAsString(pair))
			return {
				name: pair.key,
				commit: pair.value
			}
		})

        this.items = Tags.mapping[this.login + "/" + this.repo + "/" + this.type]
		Mojo.Log.info(Mojo.Log.propertiesAsString(this.items))
        this.assistant.controller.modelChanged(this)
        
        Mojo.Log.info("[Commits] === refresh <- onSuccess")
    }
.bind(this)
    
    options.method = "get"
    
    Mojo.Log.info("[Commits] ==> refresh")
    Github.request("/repos/show/#{user}/#{repo}/#{ref}", {
        user: this.login,
        repo: this.repo,
        ref: this.type
    }, options)
    Mojo.Log.info("[Commits] <== refresh")
}

Tags.prototype.update = function(options){
    if (Tags.mapping[this.login + "/" + this.repo + "/" + this.type] == undefined) {
        this.refresh(options)
    }
    else {
        if (options.onCreate != undefined) {
            options.onCreate()
        }
        this.items = Tags.mapping[this.login + "/" + this.repo + "/" + this.type]
        this.assistant.controller.modelChanged(this)
		
        if (options.onComplete != undefined) {
            options.onComplete()
        }
    }
}
