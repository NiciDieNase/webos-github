function Refs(login,repo){
    this.login = login
    this.repo = repo
    this.watcher = ""
    
    this.items = []
	
	this.type = "branches"
    
}

Refs.mapping = new Hash()

Refs.prototype.refresh = function(options){
    options = options || new Object()
    options.onSuccess = function(response){
            Mojo.Log.info("[ReCommitspos] === refresh -> onSuccess")
            Mojo.Log.info("[Commits] === refresh : " + response.responseText)
            
            Refs.mapping[this.login + "/" + this.repo + "/" +  this.type] = $H(response.responseJSON[this.type]).keys().collect(function(value){
                return {
                    name: value
                }
            })
            this.update()
            Mojo.Log.info("[Commits] === refresh <- onSuccess")
        }
.bind(this)  

options.method = "get"

    Mojo.Log.info("[Commits] ==> refresh")
    Github.request("/repos/show/#{user}/#{repo}/#{ref}", {
        user: this.login,
        repo : this.repo,
        ref: this.type
    }, options)
    Mojo.Log.info("[Commits] <== refresh")
}

Refs.prototype.update = function(options){
    if (Refs.mapping[this.login + "/" + this.repo + "/" + this.type] == undefined) {
        this.refresh(options)
    }
    else {
        this.items = Refs.mapping[this.login + "/" + this.repo + "/" +  this.type]
        
        this.watcher()
    }
}


Refs.prototype.bindWatcher = function(watcher){
    this.watcher = watcher
}

Refs.prototype.setType = function (type) {
    this.type = type
    this.update()
}
