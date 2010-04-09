function Repos(login){
    this.login = login
    this.watcher = ""
    
    this.items = []
    
    this.type = "show"
}

Repos.mapping = new Hash()

Repos.prototype.refresh = function(options){
    options = options || new Object()
    options.onSuccess = function(response){
            Mojo.Log.info("[Repos] === refresh -> onSuccess")
            Mojo.Log.info("[Repos] === refresh : " + response.responseText)
            
            Repos.mapping[this.login + "/" + this.type] = response.responseJSON.repositories
            this.update()
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

Repos.prototype.update = function(options){
    if (Repos.mapping[this.login + "/" + this.type] == undefined) {
        this.refresh(options)
    }
    else {
        this.items = Repos.mapping[this.login + "/" + this.type]
        
        this.watcher()
    }
}


Repos.prototype.bindWatcher = function(watcher){
    this.watcher = watcher
}

Repos.prototype.setType = function (type) {
    this.type = type
    this.update()
}

