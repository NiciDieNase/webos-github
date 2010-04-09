function Users(login){
    this.login = login
    this.watcher = ""
	
	this.items = []
	
	this.type = "following"
}

Users.mapping = new Hash()

Users.prototype.refresh = function(options){
    options = options || new Object()
    options.onSuccess = function(response){
            Mojo.Log.info("[User] === refresh -> onSuccess")
            Mojo.Log.info("[User] === refresh : " + response.responseText)
            
            Users.mapping[this.login + "/" + this.type] = response.responseJSON.users.collect(function(value){
                return {
                    name: value
                }
            })
            this.update()
            Mojo.Log.info("[User] === refresh <- onSuccess")
        }
.bind(this)  

options.method = "get"

    Mojo.Log.info("[User] ==> refresh")
    Github.request("/user/show/#{user}/#{direction}", {
        user: this.login,
		direction: this.type
    }, options)
    Mojo.Log.info("[User] <== refresh")
}

Users.prototype.update = function(options){
    if (Users.mapping[this.login + "/" + this.type] == undefined) {
        this.refresh(options)
    }
    else {
        this.items = Users.mapping[this.login + "/" + this.type]
        
        this.watcher()
    }
}


Users.prototype.bindWatcher = function(watcher){
    this.watcher = watcher
}

Users.prototype.setType = function (type) {
	this.type = type
	this.update()
}

