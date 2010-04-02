function Github(){

}

Github.authorize = function(login, token){
    Mojo.Log.info("[Github] ==> authorize")
    Github.auth = {
        login: login,
        token: token
    }
    
    Ajax.Responders.register(function(x, y, z){
        Mojo.Log.logProperties(x, "x", true)
        Mojo.Log.logProperties(y, "y", true)
        Mojo.Log.logProperties(z, "z", true)
    })
    Mojo.Log.info("[Github] <== authorize")
}

Github.request = function(uriTemplate, params, options){
    Mojo.Log.info("[Github] ==> request")
    var uri = uriTemplate.interpolate(params)
    Mojo.Log.info("[Github] === request: Called: " + uri)
	
	// Try here, if uri is called sometimes before
	
    options.postBody = (options.postBody == undefined) ? $H(Github.auth).toQueryString() : $(options.postBody).merge($H(Github.auth)).toQueryString()
    if (options.method == undefined) {
        options.method = "post"
    }
    
    options.onSuccess = function(target, response){
        target(response)
    }
.bind(undefined, options.onSuccess)
    if (options.onFailure == undefined) {
        options.onFailure = StageAssistant.connectionError
    }
    options.onCreate = function(target, response){
        target(response)
    }
.bind(undefined, options.onCreate)
    
    options.onComplete = function(target, response){
        target(response)
    }
.bind(undefined, options.onComplete)
    options.evalJSON = "false"
    
    Mojo.Log.info("[Github] === request: Request Body " + options.postBody)
    new Ajax.Request("https://github.com/api/v2/json" + uri, options)
    Mojo.Log.info("[Github] <== request")
}

