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
