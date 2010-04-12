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
function WatchedRepositories(assistant, login){
    this.assistant = assistant
    this.login = login
    this.watcher = ""
    
    this.items = []
    
    this.type = "watched"
}

WatchedRepositories.mapping = new Hash()

WatchedRepositories.prototype.refresh = function(options){
    options = options || new Object()
    options.onSuccess = function(response){
        Mojo.Log.info("[Repos] === refresh -> onSuccess")
        Mojo.Log.info("[Repos] === refresh : " + response.responseText)
        
        WatchedRepositories.mapping[this.login + "/" + this.type] = response.responseJSON.repositories
        this.items = WatchedRepositories.mapping[this.login + "/" + this.type]
        this.assistant.controller.modelChanged(this)
        Mojo.Log.info("[Repos] === refresh <- onSuccess")
    }
.bind(this)
    
    options.method = "get"
    
    Mojo.Log.info("[v] ==> refresh")
    Github.request("/repos/#{direction}/#{user}", {
        user: this.login,
        direction: this.type
    }, options)
    Mojo.Log.info("[Repos] <== refresh")
}

WatchedRepositories.prototype.update = function(options){
    if (WatchedRepositories.mapping[this.login + "/" + this.type] == undefined) {
        this.refresh(options)
    }
    else {
        if (options.onCreate != undefined) {
            options.onCreate()
        }
        this.items = WatchedRepositories.mapping[this.login + "/" + this.type]
        this.assistant.controller.modelChanged(this)
        
        if (options.onComplete != undefined) {
            options.onComplete()
        }
    }
}
