function Github(){

}

Github.authorize = function(login, token){
    Mojo.Log.info("[Github] ==> authorize")
    Github.auth = {
        login: login,
        token: token
    }
    
    
    
    Mojo.Log.info("[Github] <== authorize")
}

Github.request = function(uriTemplate, params, options){
	Mojo.Log.info("[Github] ==> request")
	var uri = uriTemplate.interpolate(params)
	Mojo.Log.info("[Github] === request: Called: " + uri)
	
	// Try here, if uri is called sometimes before
	
	options.postBody = (options.postBody == undefined) ? $H(Github.auth).toQueryString() : $(options.postBody).merge($H(Github.auth)).toQueryString()
	if (options.method == undefined) {
		options.method = "get"
	}
	
	options.onSuccess = function(target, response){
		target(response)
	}
.bind(this, options.onSuccess)
	if (options.onFailure == undefined) {
		options.onFailure = StageAssistant.connectionError
	}
	
	
	if (options.onCreate != undefined) {
	options.onCreate = function(target, response){
		target(response)
	}
.bind(this, options.onCreate)
}
	
	if (options.onComplete != undefined) {
	options.onComplete = function(target, response){
		target(response)
	}
.bind(this, options.onComplete)
	
}

    options.evalJSON = "false"
    
    Mojo.Log.info("[Github] === request: Request Body " + options.postBody)
    new Ajax.Request("https://github.com/api/v2/json" + uri, options)
    Mojo.Log.info("[Github] <== request")
}

Github.privateFeed = function(options){
	if (options.method == undefined) {
		options.method = "get"
	}
	
	options.onSuccess = function(target, response){
		response.responseXML = new DOMParser().parseFromString(response.responseText, "text/xml");
		response.responseATOM = xml2array(response.responseXML)
		target(response)
	}
.bind(undefined, options.onSuccess)
	if (options.onFailure == undefined) {
		options.onFailure = StageAssistant.connectionError
	}
	
	if (options.onCreate != undefined) {
	options.onCreate = function(target, response){
		target(response)
	}
.bind(undefined, options.onCreate)
}
	
	if (options.onComplete != undefined) {
	options.onComplete = function(target, response){
		target(response)
	}
.bind(undefined, options.onComplete)
}
    options.evalJSON = "false"

    Mojo.Log.info("https://github.com/#{login}.private.atom?token=#{token}".interpolate(Github.auth))
    new Ajax.Request("https://github.com/#{login}.private.atom?token=#{token}".interpolate(Github.auth), options)
}

Github.activitiesFeed = function(params,options){
    if (options.method == undefined) {
        options.method = "get"
    }
    
    options.onSuccess = function(target, response){
        response.responseXML = new DOMParser().parseFromString(response.responseText, "text/xml");
        response.responseATOM = xml2array(response.responseXML)
        target(response)
    }
.bind(undefined, options.onSuccess)
    if (options.onFailure == undefined) {
        options.onFailure = StageAssistant.connectionError
    }
    
    if (options.onCreate != undefined) {
    options.onCreate = function(target, response){
        target(response)
    }
.bind(undefined, options.onCreate)
}
    
    if (options.onComplete != undefined) {
    options.onComplete = function(target, response){
        target(response)
    }
.bind(undefined, options.onComplete)
}
    options.evalJSON = "false"

    Mojo.Log.info("http://github.com/#{user}.atom".interpolate(params))
    new Ajax.Request("http://github.com/#{user}.atom".interpolate(params), options)
}
