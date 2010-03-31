function AuthAssistant(depot, auth){
    /* this is the creator function for your scene assistant object. It will be passed all the 
     additional parameters (after the scene name) that were passed to pushScene. The reference
     to the scene controller (this.controller) has not be established yet, so any initialization
     that needs the scene controller should be done in the setup function below. */
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
	this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
	
	/* --- Bindings --- */
    this.updateAuthorization = this.updateAuthorization.bind(this)
    this.verifyAuthorization = this.verifyAuthorization.bind(this)
    this.propertyChanged = this.propertyChanged.bind(this)
	
	
	/* --- Status widgets --- */
	
	
	/* --- Event Listeners --- */
    Mojo.Event.listen($('update'), Mojo.Event.tap, this.verifyAuthorization)
    Mojo.Event.listen($('cancel'), Mojo.Event.tap, this.cancelAction)
    Mojo.Event.listen($("login"), Mojo.Event.propertyChange, this.propertyChanged)
    Mojo.Event.listen($('token'), Mojo.Event.propertyChange, this.propertyChanged)

	
    /* --- App widgets --- */
    this.controller.setupWidget(Mojo.Menu.appMenu, {
        omitDefaultItems: true
    }, StageAssistant.appMenu);
	
    

    /* --- UI widgets --- */
    this.controller.setupWidget('login', usernameAttributes = {
        hintText: 'Username',
        modelProperty: 'username'
    }, this.model);
    this.controller.setupWidget('token', apikeyAttributes = {
        hintText: 'API Key',
        modelProperty: 'apikey'
    }, this.model);
    
    this.controller.setupWidget('update', {
        type: Mojo.Widget.activityButton
    }, this.buttonModel = {
        buttonLabel: 'Save',
        buttonClass: 'primary',
        disabled: !((this.model.username.length > 0) && (this.model.apikey.length == 32))
    });
    this.controller.setupWidget('cancel', {
        type: Mojo.Widget.defaultButton
    }, this.cancelButtonModel = {
        buttonLabel: 'Cancel',
        buttonClass: 'primary',
		disabled: (this.model.username == "")
    });
};

AuthAssistant.prototype.propertyChanged = function(event){
    this.buttonModel.disabled = !((event.model.username.length > 0) && (event.model.apikey.length == 32))
    this.controller.modelChanged(this.buttonModel)
}

AuthAssistant.prototype.activate = function(event){
};

AuthAssistant.prototype.deactivate = function(event){
}

AuthAssistant.prototype.verifyAuthorization = function(){
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
    Mojo.Event.stopListening($("update"), Mojo.Event.tap, this.updateAuthorization)
    Mojo.Event.stopListening($('cancel'), Mojo.Event.tap, this.cancelAction)
    Mojo.Event.stopListening($("login"), Mojo.Event.propertyChange, this.propertyChanged)
    Mojo.Event.stopListening($('token'), Mojo.Event.propertyChange, this.propertyChanged)
};

AuthAssistant.prototype.updateAuthorization = function(){
    this.depot.add("auth", this.model, this.proceed.bind(this));
}

AuthAssistant.prototype.proceed = function(){
    Mojo.Controller.stageController.auth = this.model
    Mojo.Controller.stageController.popScenesTo()
    Mojo.Controller.stageController.pushScene("user-details", this.depot, this.model, this.model["username"])
}

AuthAssistant.prototype.cancelAction = function () {
	Mojo.Controller.stageController.popScene()
}
