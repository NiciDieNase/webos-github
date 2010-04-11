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

function User(login){
    this.login = login
    this.watcher = ""
}

User.mapping = new Hash()

User.prototype.refresh = function(options){
	options = options || new Object()
	options.onSuccess = function(response){
            Mojo.Log.info("[User] === refresh -> onSuccess")
            Mojo.Log.info("[User] === refresh : " + response.responseText)
            
            User.mapping[this.login] = Mojo.Model.format(response.responseJSON.user,User.formatters)
            
            this.update()
            Mojo.Log.info("[User] === refresh <- onSuccess")
        }
.bind(this)  

options.method = "get"

    Mojo.Log.info("[User] ==> refresh")
    Github.request("/user/show/#{user}", {
        user: this.login
    }, options)
    Mojo.Log.info("[User] <== refresh")
}

User.prototype.update = function(options){
    if (User.mapping[this.login] == undefined) {
		this.refresh(options)
	}
	else {
		this.item = User.mapping[this.login]
		
		this.watcher()
	}
}


User.prototype.bindWatcher = function(watcher){
    this.watcher = watcher
}

User.formatters = {
	created_at: function (value, context) {
		context.created_at = Mojo.Format.formatDate(new Date(value),{date:'medium',time:"short"})
	},
    blog: function (value, context) {
        if (value.substr(0,11) == "http://www.") {
            context.blog_title = value.substr(11)
        } else {
            if (value.substr(0,7) == "http://") {
                context.blog_title = value.substr(7)
            } else {
                context.blog_title = value
            }
        }
    }
}
