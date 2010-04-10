function Issue(login,repo, number){
    this.login = login
    this.repo = repo
	this.number = number
	this.number
    this.watcher = ""
}

Issue.mapping = new Hash()

Issue.prototype.refresh = function(options){
    options = options || new Object()
    options.onSuccess = function(response){
        Mojo.Log.info("[Issue] === refresh -> onSuccess")
        Mojo.Log.info("[Issue] === refresh : " + response.responseText)
        
        Issue.mapping[this.login + "/" + this.repo + "/" + this.number] = Mojo.Model.format(response.responseJSON.issue, Issue.formatters)
        
        this.update()
        Mojo.Log.info("[Issue] === refresh <- onSuccess")
    }
.bind(this)
    
    options.method = "get"
    
    Mojo.Log.info("[Issue] ==> refresh")
    Github.request("/issues/show/#{user}/#{repo}/#{number}", {
        user: this.login,
        repo: this.repo,
		number: this.number
    }, options)
    Mojo.Log.info("[Issue] <== refresh")
}

Issue.prototype.update = function(options){
    if (Issue.mapping[this.login + "/" + this.repo + "/" + this.number] == undefined) {
        this.refresh(options)
    }
    else {
        this.item = Issue.mapping[this.login + "/" + this.repo + "/" + this.number]
        
        this.watcher()
    }
}


Issue.prototype.bindWatcher = function(watcher){
    this.watcher = watcher
}

Issue.formatters = {
    created_at: function (value,context) {
        context.created_at = Mojo.Format.formatDate(new Date(value),{date:"medium",time:"short"})
    },
    updated_at:function (value,context) {
        context.updated_at = Mojo.Format.formatDate(new Date(value),{date:"medium",time:"short"})
    }
}
