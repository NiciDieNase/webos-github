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

function Commit(login,repo, number){
    this.login = login
    this.repo = repo
    this.number = number
    this.watcher = ""
}

Commit.mapping = new Hash()

Commit.prototype.refresh = function(options){
    options = options || new Object()
    options.onSuccess = function(response){
        Mojo.Log.info("[Commit] === refresh -> onSuccess")
        Mojo.Log.info("[Commit] === refresh : " + response.responseText)
        
        Commit.mapping[this.login + "/" + this.repo + "/" + this.number] = Mojo.Model.format(response.responseJSON.commit,Commit.formatters)
        
        this.update()
        Mojo.Log.info("[Commit] === refresh <- onSuccess")
    }
.bind(this)
    
    options.method = "get"
    
    Mojo.Log.info("[Commit] ==> refresh")
    Github.request("/commits/show/#{user}/#{repo}/#{sha}", {
        user: this.login,
        repo: this.repo,
        sha: this.number
    }, options)
    Mojo.Log.info("[Commit] <== refresh")
}

Commit.prototype.update = function(options){
    if (Commit.mapping[this.login + "/" + this.repo + "/" + this.number] == undefined) {
        this.refresh(options)
    }
    else {
        this.item = Commit.mapping[this.login + "/" + this.repo + "/" + this.number]
        
        this.watcher()
    }
}


Commit.prototype.bindWatcher = function(watcher){
    this.watcher = watcher
}

Commit.formatters = {
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
}
