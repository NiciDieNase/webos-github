Github.auth = function auth (login,token) {
	Github.auth.login = login
	Github.auth.token = token
}

Github.request = function (uriTemplate,params,options) {
	var uri = "https://github.com/api/v2/json/" + new Template(uriTemplate).evaluate(params)
	
    new Ajax.Request(uri, options)
	
}
