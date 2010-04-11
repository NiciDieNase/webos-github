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

function Comments(login,repo, number){
    this.login = login
    this.repo = repo
	this.number = number
    this.watcher = ""
    
    this.items = []
}

Comments.mapping = new Hash()

Comments.prototype.refresh = function(options){
    options = options || new Object()
    options.onSuccess = function(response){
            Mojo.Log.info("[Comments] === refresh -> onSuccess")
            Mojo.Log.info("[Comments] === refresh : " + response.responseText)
            
            Comments.mapping[this.login + "/" + this.repo + "/" +  this.type] = response.responseJSON.comments
            
            this.update()
            Mojo.Log.info("[Comments] === refresh <- onSuccess")
        }
.bind(this)  

options.method = "get"

    Mojo.Log.info("[Comments] ==> refresh")
    Github.request("/issues/comments/#{user}/#{repo}/#{number}", {
        user: this.login,
        repo : this.repo,
        number: this.number
    }, options)
    Mojo.Log.info("[Comments] <== refresh")
}

Comments.prototype.update = function(options){
    if (Comments.mapping[this.login + "/" + this.repo + "/" + this.type] == undefined) {
        this.refresh(options)
    }
    else {
        this.items = Comments.mapping[this.login + "/" + this.repo + "/" + this.type]
        
        this.watcher()
    }
}

Comments.prototype.bindWatcher = function(watcher){
    this.watcher = watcher
}

Comments.prototype.setType = function(type){
    this.type = type
    this.update()
}
