function Comments(login,repo, number){
    this.login = login
    this.repo = repo
	this.number = number
    this.watcher = ""
    
    this.items = []
}

Comments.mapping = new Hash()

Comments.prototype.refresh = function(options){
    options = options || new Object()
    options.onSuccess = function(response){
            Mojo.Log.info("[Comments] === refresh -> onSuccess")
            Mojo.Log.info("[Comments] === refresh : " + response.responseText)
            
            Comments.mapping[this.login + "/" + this.repo + "/" +  this.type] = response.responseJSON.comments
            
            this.update()
            Mojo.Log.info("[Comments] === refresh <- onSuccess")
        }
.bind(this)  

options.method = "get"

    Mojo.Log.info("[Comments] ==> refresh")
    Github.request("/issues/comments/#{user}/#{repo}/#{number}", {
        user: this.login,
        repo : this.repo,
        number: this.number
    }, options)
    Mojo.Log.info("[Comments] <== refresh")
}

Comments.prototype.update = function(options){
    if (Comments.mapping[this.login + "/" + this.repo + "/" + this.type] == undefined) {
        this.refresh(options)
    }
    else {
        this.items = Comments.mapping[this.login + "/" + this.repo + "/" + this.type]
        
        this.watcher()
    }
}

Comments.prototype.bindWatcher = function(watcher){
    this.watcher = watcher
}

Comments.prototype.setType = function(type){
    this.type = type
    this.update()
}
