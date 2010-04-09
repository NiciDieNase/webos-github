function Repository(login,repo){
    this.login = login
	this.repo = repo
    this.watcher = ""
}

Repository.mapping = new Hash()

Repository.prototype.refresh = function(options){
    options = options || new Object()
    options.onSuccess = function(response){
        Mojo.Log.info("[Repository] === refresh -> onSuccess")
        Mojo.Log.info("[Repository] === refresh : " + response.responseText)
        
        Repository.mapping[this.login + "/" + this.repo] = response.responseJSON.repository
        
        this.update()
        Mojo.Log.info("[Repository] === refresh <- onSuccess")
    }
.bind(this)
    
    options.method = "get"
    
    Mojo.Log.info("[Repository] ==> refresh")
    Github.request("/repos/show/#{user}/#{repo}", {
        user: this.login,
		repo: this.repo
    }, options)
    Mojo.Log.info("[Repository] <== refresh")
}

Repository.prototype.update = function(options){
    if (Repository.mapping[this.login + "/" + this.repo] == undefined) {
        this.refresh(options)
    }
    else {
        this.item = Repository.mapping[this.login + "/" + this.repo]
        
        this.watcher()
    }
}


Repository.prototype.bindWatcher = function(watcher){
    this.watcher = watcher
}

