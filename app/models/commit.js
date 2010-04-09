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
        
        Commit.mapping[this.login + "/" + this.repo + "/" + this.number] = response.responseJSON.commit
        
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

