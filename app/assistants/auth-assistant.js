function AuthAssistant(depot, auth){
    Mojo.Log.info("[AuthAssistant] ==> Construct")
    this.depot = depot
    if (auth == undefined) {
        this.model = {
            "login": "",
            "token": "",
            disabled: false
        };
    }
    else {
        this.model = auth
    }
    Mojo.Log.info("[AuthAssistant] <== Construct")
}

AuthAssistant.prototype.setup = function(){
    Mojo.Log.info("[AuthAssistant] ==> setup")
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
        hintText: 'Login',
        modelProperty: 'login'
    }, this.model);
    this.controller.setupWidget('token', apikeyAttributes = {
        hintText: 'Token',
        modelProperty: 'token'
    }, this.model);
    
    this.controller.setupWidget('update', {
        type: Mojo.Widget.activityButton
    }, this.buttonModel = {
        buttonLabel: 'Save',
        buttonClass: 'primary',
        disabled: !((this.model.login.length > 0) && (this.model.token.length == 32))
    });
    this.controller.setupWidget('cancel', {
        type: Mojo.Widget.defaultButton
    }, this.cancelButtonModel = {
        buttonLabel: 'Cancel',
        buttonClass: 'primary',
		disabled: (this.model.username == "")
    });
    Mojo.Log.info("[AuthAssistant] <== setup")
};

AuthAssistant.prototype.propertyChanged = function(event){
    Mojo.Log.info("[AuthAssistant] ==> propertyChanged")
    this.buttonModel.disabled = !((event.model.login.length > 0) && (event.model.token.length == 32))
    this.controller.modelChanged(this.buttonModel)
    Mojo.Log.info("[AuthAssistant] <== propertyChanged")
}

AuthAssistant.prototype.activate = function(event){
    Mojo.Log.info("[AuthAssistant] <=> activate")
};

AuthAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[AuthAssistant] <=> deactivate")
}

AuthAssistant.prototype.verifyAuthorization = function(){
    Mojo.Log.info("[AuthAssistant] ==> verifyAuthorization")
	
	Github.authorize(this.model.login,this.model.token)
    Github.request("/user/show/#{user}",{user:this.model.login}, {
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
    })
	
    Mojo.Log.info("[AuthAssistant] <== verifyAuthorization")
}

AuthAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[AuthAssistant] ==> cleanup")
    Mojo.Event.stopListening($("update"), Mojo.Event.tap, this.updateAuthorization)
    Mojo.Event.stopListening($('cancel'), Mojo.Event.tap, this.cancelAction)
    Mojo.Event.stopListening($("login"), Mojo.Event.propertyChange, this.propertyChanged)
    Mojo.Event.stopListening($('token'), Mojo.Event.propertyChange, this.propertyChanged)
    Mojo.Log.info("[AuthAssistant] <== ckeanup")
};

AuthAssistant.prototype.updateAuthorization = function(){
    Mojo.Log.info("[AuthAssistant] ==> updateAuthorization")
    this.depot.add("auth", this.model, this.proceed.bind(this));
    Mojo.Log.info("[AuthAssistant] <== updateAuthorization")
}

AuthAssistant.prototype.proceed = function(){
    Mojo.Log.info("[AuthAssistant] ==> proceed")
    Mojo.Controller.stageController.auth = this.model
    Mojo.Controller.stageController.popScenesTo()
    Mojo.Controller.stageController.pushScene("newsfeed", this.model["username"])
    Mojo.Log.info("[AuthAssistant] <== proceed")
}

AuthAssistant.prototype.cancelAction = function () {
    Mojo.Log.info("[AuthAssistant] ==> cancelAction")
	Mojo.Controller.stageController.popScene()
    Mojo.Log.info("[AuthAssistant] <== cancelAction")
}
