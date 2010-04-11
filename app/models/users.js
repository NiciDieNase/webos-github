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

function Users(login){
    this.login = login
    this.watcher = ""
	
	this.items = []
	
	this.type = "following"
}

Users.mapping = new Hash()

Users.prototype.refresh = function(options){
    options = options || new Object()
    options.onSuccess = function(response){
            Mojo.Log.info("[User] === refresh -> onSuccess")
            Mojo.Log.info("[User] === refresh : " + response.responseText)
            
            Users.mapping[this.login + "/" + this.type] = response.responseJSON.users.collect(function(value){
                return {
                    name: value
                }
            })
            this.update()
            Mojo.Log.info("[User] === refresh <- onSuccess")
        }
.bind(this)  

options.method = "get"

    Mojo.Log.info("[User] ==> refresh")
    Github.request("/user/show/#{user}/#{direction}", {
        user: this.login,
		direction: this.type
    }, options)
    Mojo.Log.info("[User] <== refresh")
}

Users.prototype.update = function(options){
    if (Users.mapping[this.login + "/" + this.type] == undefined) {
        this.refresh(options)
    }
    else {
        this.items = Users.mapping[this.login + "/" + this.type]
        
        this.watcher()
    }
}


Users.prototype.bindWatcher = function(watcher){
    this.watcher = watcher
}

Users.prototype.setType = function (type) {
	this.type = type
	this.update()
}

