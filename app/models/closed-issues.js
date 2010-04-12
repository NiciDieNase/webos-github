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

function ClosedIssues(assistant,login,repo){
	this.assistant = assistant
    this.login = login
    this.repo = repo
    
    this.items = ClosedIssues.mapping[this.login + "/" + this.repo + "/" +  this.type]
    
    this.type = "closed"
    
}

ClosedIssues.mapping = new Hash()

ClosedIssues.prototype.refresh = function(options){
    options = options || new Object()
    options.onSuccess = function(response){
            Mojo.Log.info("[Issues] === refresh -> onSuccess")
            Mojo.Log.info("[Issues] === refresh : " + response.responseText)
            
            ClosedIssues.mapping[this.login + "/" + this.repo + "/" +  this.type] = response.responseJSON.issues
            this.items = ClosedIssues.mapping[this.login + "/" + this.repo + "/" +  this.type]
            this.assistant.controller.modelChanged(this)
            
            Mojo.Log.info("[Commits] === refresh <- onSuccess")
        }
.bind(this)  

ClosedIssues.method = "get"

    Mojo.Log.info("[Issues] ==> refresh")
    Github.request("/issues/list/#{user}/#{repo}/#{state}", {
        user: this.login,
        repo : this.repo,
        state: this.type
    }, options)
    Mojo.Log.info("[Issues] <== refresh")
}

ClosedIssues.prototype.update = function(options){
    if (ClosedIssues.mapping[this.login + "/" + this.repo + "/" + this.type] == undefined) {
        this.refresh(options)
    }
    else {
        if (options.onCreate != undefined) {
            options.onCreate()
        }
        this.items = ClosedIssues.mapping[this.login + "/" + this.repo + "/" + this.type]
        this.assistant.controller.modelChanged(this)
        if (options.onComplete != undefined) {
            options.onComplete()
        }
    }
}
