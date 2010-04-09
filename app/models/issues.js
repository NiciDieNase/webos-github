function Issues(login,repo){
    this.login = login
    this.repo = repo
    this.watcher = ""
    
    this.items = []
    
    this.type = "open"
    
}

Issues.mapping = new Hash()

Issues.prototype.refresh = function(options){
    options = options || new Object()
    options.onSuccess = function(response){
            Mojo.Log.info("[Issues] === refresh -> onSuccess")
            Mojo.Log.info("[Issues] === refresh : " + response.responseText)
            
            Issues.mapping[this.login + "/" + this.repo + "/" +  this.type] = response.responseJSON.issues
			
            this.update()
            Mojo.Log.info("[Commits] === refresh <- onSuccess")
        }
.bind(this)  

options.method = "get"

    Mojo.Log.info("[Issues] ==> refresh")
    Github.request("/issues/list/#{user}/#{repo}/#{state}", {
        user: this.login,
        repo : this.repo,
        state: this.type
    }, options)
    Mojo.Log.info("[Issues] <== refresh")
}

Issues.prototype.update = function(options){
    if (Issues.mapping[this.login + "/" + this.repo + "/" + this.type] == undefined) {
        this.refresh(options)
    }
    else {
        this.items = Issues.mapping[this.login + "/" + this.repo + "/" + this.type]
        
        this.watcher()
    }
}


Issues.prototype.bindWatcher = function(watcher){
    this.watcher = watcher
}

Issues.prototype.setType = function(type){
	this.type = type
	this.update()
}
