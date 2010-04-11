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

function Commits(login,repo,ref){
    this.login = login
	this.repo = repo
	this.ref = ref
    this.watcher = ""
    
    this.items = []
    
}

Commits.mapping = new Hash()

Commits.prototype.refresh = function(options){
    options = options || new Object()
    options.onSuccess = function(response){
            Mojo.Log.info("[ReCommitspos] === refresh -> onSuccess")
            Mojo.Log.info("[Commits] === refresh : " + response.responseText)
            
            Commits.mapping[this.login + "/" + this.repo + "/" + this.ref] = response.responseJSON.commits
            this.update()
            Mojo.Log.info("[Commits] === refresh <- onSuccess")
        }
.bind(this)  

options.method = "get"

    Mojo.Log.info("[Commits] ==> refresh")
    Github.request("/commits/list/#{user}/#{repo}/#{ref}", {
        user: this.login,
        repo : this.repo,
		ref: this.ref
    }, options)
    Mojo.Log.info("[Commits] <== refresh")
}

Commits.prototype.update = function(options){
    if (Commits.mapping[this.login + "/" + this.repo + "/" + this.ref] == undefined) {
        this.refresh(options)
    }
    else {
        this.items = Commits.mapping[this.login + "/" + this.repo + "/" + this.ref]
        
        this.watcher()
    }
}


Commits.prototype.bindWatcher = function(watcher){
    this.watcher = watcher
}

Commits.prototype.setType = function (type) {
    this.type = type
    this.update()
}
