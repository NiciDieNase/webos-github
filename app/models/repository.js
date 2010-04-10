function Repository(login, repo){
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
        
        Repository.mapping[this.login + "/" + this.repo] = Mojo.Model.format(response.responseJSON.repository,Repository.formatters)
        
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

Repository.formatters = {
    homepage: function(value, context){
        if (value.substr(0, 11) == "http://www.") {
            context.homepage_title = value.substr(11)
        }
        else {
            if (value.substr(0, 7) == "http://") {
                context.homepage_title = value.substr(7)
            }
            else {
                context.homepage_title = value
            }
        }
    },
	url: function (value,context){
		context.url_title = value.substr(18)
	},
    "private": function (value,context) {
        if (value) {
            context["private"] = "yes"
        } else {
            context["private"] = "no"
        }
    },
	fork: function (value,context) {
		if (value) {
			context.fork = "yes"
		} else {
			context.fork = "no"
		}
	}
}

