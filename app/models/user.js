function User(login){
    this.login = login
    this.watcher = ""
}

User.mapping = new Hash()

User.prototype.refresh = function(options){
	options = options || new Object()
	options.onSuccess = function(response){
            Mojo.Log.info("[User] === refresh -> onSuccess")
            Mojo.Log.info("[User] === refresh : " + response.responseText)
            
            User.mapping[this.login] = response.responseJSON.user
            
            this.update()
            Mojo.Log.info("[User] === refresh <- onSuccess")
        }
.bind(this)  

options.method = "get"

    Mojo.Log.info("[User] ==> refresh")
    Github.request("/user/show/#{user}", {
        user: this.login
    }, options)
    Mojo.Log.info("[User] <== refresh")
}

User.prototype.update = function(options){
    if (User.mapping[this.login] == undefined) {
		this.refresh(options)
	}
	else {
		this.item = User.mapping[this.login]
		
		this.watcher()
	}
}


User.prototype.bindWatcher = function(watcher){
    this.watcher = watcher
}

