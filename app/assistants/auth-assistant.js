function AuthAssistant(depot, auth){
    /* this is the creator function for your scene assistant object. It will be passed all the 
     additional parameters (after the scene name) that were passed to pushScene. The reference
     to the scene controller (this.controller) has not be established yet, so any initialization
     that needs the scene controller should be done in the setup function below. */
    this.updateAuthorization = this.updateAuthorization.bind(this)
    this.verifyAuthorization = this.verifyAuthorization.bind(this)
    this.propertyChanged = this.propertyChanged.bind(this)
	
    this.depot = depot
    if (auth == undefined) {
        this.model = {
            "username": "",
            "apikey": "",
            disabled: false
        };
    }
    else {
        this.model = auth
    }
	
	
}

AuthAssistant.prototype.setup = function(){
    /* this function is for setup tasks that have to happen when the scene is first created */
    
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */
    
    /* setup widgets here */
    var usernameAttributes = {
        hintText: 'Username',
        modelProperty: 'username'
    };
    
    this.controller.setupWidget('auth-username', usernameAttributes, this.model);
    
    var apikeyAttributes = {
        hintText: 'API Key',
        modelProperty: 'apikey'
    };
    
    this.controller.setupWidget('auth-apikey', apikeyAttributes, this.model);
    
    this.buttonModel = {
        buttonLabel: 'Save',
        buttonClass: 'primary',
        disabled: !((this.model.username.length > 0) && (this.model.apikey.length == 32))
    }
    
    this.controller.setupWidget('update', {
        type: Mojo.Widget.activityButton
    }, this.buttonModel);
    
    /* add event handlers to listen to events from widgets */
    Mojo.Event.listen(this.controller.get('update'), Mojo.Event.tap, this.verifyAuthorization)
    
    Mojo.Event.listen(this.controller.get("auth-username"), Mojo.Event.propertyChange, this.propertyChanged)
    Mojo.Event.listen(this.controller.get('auth-apikey'), Mojo.Event.propertyChange, this.propertyChanged)
};

AuthAssistant.prototype.propertyChanged = function(event){
    this.controller.get("auth-debug").update(dump(event.model) + "=>" + event.model.username.length + "+" + event.model.apikey.length)
    this.buttonModel.disabled = !((event.model.username.length > 0) && (event.model.apikey.length == 32))
    this.controller.modelChanged(this.buttonModel)
}

AuthAssistant.prototype.activate = function(event){
    /* put in event handlers here that should only be in effect when this scene is active. For
     example, key handlers that are observing the document */
};

AuthAssistant.prototype.deactivate = function(event){
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
    
     this scene is popped or another scene is pushed on top */
    
}

AuthAssistant.prototype.verifyAuthorization = function(){
    // Test: valid auths?
    var request = new Ajax.Request("https://github.com/api/v2/json/user/show/" + escape(this.model["username"]), {
        method: "post",
        evalJSON: "false",
        onSuccess: this.updateAuthorization,
        onFailure: function(response){
            if ((response.responseJSON == undefined) || (response.responseJSON.error == undefined)) {
				if (response.status == 401) {
					Mojo.Controller.errorDialog("Username or API-Token invalid")
				}
				else {
					Mojo.Controller.errorDialog(response.status + ": " + response.statusText)
				}
            }
            else {
                Mojo.Controller.errorDialog(response.responseJSON.error[0].error)
            }
        },
        postBody: "login=" + escape(this.model['username']) + "&token=" + escape(this.model['apikey'])
    })
}

AuthAssistant.prototype.cleanup = function(event){
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
    Mojo.Event.stopListening(this.controller.get("update"), Mojo.Event.tap, this.updateAuthorization)
    Mojo.Event.stopListening(this.controller.get("auth-username"), Mojo.Event.propertyChange, this.propertyChanged)
    Mojo.Event.stopListening(this.controller.get('auth-apikey'), Mojo.Event.propertyChange, this.propertyChanged)
};

AuthAssistant.prototype.updateAuthorization = function(){
    this.depot.add("auth", this.model, this.proceed.bind(this));
}

AuthAssistant.prototype.proceed = function(){
    Mojo.Controller.stageController.auth = this.model
    Mojo.Controller.stageController.popScenesTo()
    Mojo.Controller.stageController.pushScene("userinfo", this.depot, this.model, this.model["username"])
}
