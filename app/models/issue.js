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

function Issue(login,repo, number){
    this.login = login
    this.repo = repo
	this.number = number
	this.number
    this.watcher = ""
}

Issue.mapping = new Hash()

Issue.prototype.refresh = function(options){
    options = options || new Object()
    options.onSuccess = function(response){
        Mojo.Log.info("[Issue] === refresh -> onSuccess")
        Mojo.Log.info("[Issue] === refresh : " + response.responseText)
        
        Issue.mapping[this.login + "/" + this.repo + "/" + this.number] = Mojo.Model.format(response.responseJSON.issue, Issue.formatters)
        
        this.update()
        Mojo.Log.info("[Issue] === refresh <- onSuccess")
    }
.bind(this)
    
    options.method = "get"
    
    Mojo.Log.info("[Issue] ==> refresh")
    Github.request("/issues/show/#{user}/#{repo}/#{number}", {
        user: this.login,
        repo: this.repo,
		number: this.number
    }, options)
    Mojo.Log.info("[Issue] <== refresh")
}

Issue.prototype.update = function(options){
    if (Issue.mapping[this.login + "/" + this.repo + "/" + this.number] == undefined) {
        this.refresh(options)
    }
    else {
        this.item = Issue.mapping[this.login + "/" + this.repo + "/" + this.number]
        
        this.watcher()
    }
}


Issue.prototype.bindWatcher = function(watcher){
    this.watcher = watcher
}

Issue.formatters = {
    created_at: function (value,context) {
        context.created_at = Mojo.Format.formatDate(new Date(value),{date:"medium",time:"short"})
    },
    updated_at:function (value,context) {
        context.updated_at = Mojo.Format.formatDate(new Date(value),{date:"medium",time:"short"})
    }
}
