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

function OpenIssues(login,repo){
    this.login = login
    this.repo = repo
    this.watcher = ""
    
    this.items = OpenIssues.mapping[this.login + "/" + this.repo + "/" +  this.type]
    
    this.type = "open"
    
}

OpenIssues.mapping = new Hash()

OpenIssues.prototype.refresh = function(options){
    options = options || new Object()
    options.onSuccess = function(response){
            Mojo.Log.info("[Issues] === refresh -> onSuccess")
            Mojo.Log.info("[Issues] === refresh : " + response.responseText)
            
            OpenIssues.mapping[this.login + "/" + this.repo + "/" +  this.type] = response.responseJSON.issues
			this.items = OpenIssues.mapping[this.login + "/" + this.repo + "/" +  this.type]
			this.assistant.controller.modelChanged(this)
			
            Mojo.Log.info("[Commits] === refresh <- onSuccess")
        }
.bind(this)  

OpenIssues.method = "get"

    Mojo.Log.info("[Issues] ==> refresh")
    Github.request("/issues/list/#{user}/#{repo}/#{state}", {
        user: this.login,
        repo : this.repo,
        state: this.type
    }, options)
    Mojo.Log.info("[Issues] <== refresh")
}

OpenIssues.prototype.update = function(options){
    if (OpenIssues.mapping[this.login + "/" + this.repo + "/" + this.type] == undefined) {
        this.refresh(options)
    }
    else {
		if (options.onCreate != undefined) {
			options.onCreate()
		}
        this.items = OpenIssues.mapping[this.login + "/" + this.repo + "/" + this.type]
		this.assistant.controller.modelChanged(this)
		if (options.onComplete != undefined) {
			options.onComplete()
		}
    }
}
