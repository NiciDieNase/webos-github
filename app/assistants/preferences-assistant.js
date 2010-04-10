function PreferencesAssistant(depot, auth){
    this.depot = depot
    this.auth = auth
}

PreferencesAssistant.prototype.setup = function(){
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    
    /* --- App widgets --- */
    this.controller.setupWidget(Mojo.Menu.appMenu, {
        omitDefaultItems: true
    }, StageAssistant.appMenu);
    
    /* --- UI widgets --- */
    this.controller.setupWidget('login', usernameAttributes = {
        hintText: 'Login',
        modelProperty: 'login'
    }, this.auth);
    this.controller.setupWidget('token', apikeyAttributes = {
        hintText: 'Token',
        modelProperty: 'token'
    }, this.auth);
    
    this.controller.setupWidget('save', {
        type: Mojo.Widget.activityButton
    }, this.buttonModel = {
        buttonLabel: 'Save',
        buttonClass: 'primary',
        disabled: !((this.auth.login.length > 0) && (this.auth.token.length == 32))
    });
    this.controller.setupWidget(Mojo.Menu.viewMenu, {
        spacerHeight: 00,
        menuClass: 'no-fade'
    }, {
        visible: true,
        items: [{
            items: [{
                label: "Preferences",
                width: 320
            }]
        }]
    });
    
    
    this.saveAccount = this.saveAccount.bind(this)
    Mojo.Event.listen(this.controller.get('save'), Mojo.Event.tap, this.saveAccount)
    
};

PreferencesAssistant.prototype.activate = function(event){
};

PreferencesAssistant.prototype.deactivate = function(event){
};

PreferencesAssistant.prototype.cleanup = function(event){
    Mojo.Event.stopListening(this.controller.get('update'), Mojo.Event.tap, this.saveAccount)
};


PreferencesAssistant.prototype.saveAccount = function(){
    var r = new Ajax.Request("https://github.com/api/v2/json/user/show/#{login}".interpolate(this.auth), {
        method: "post",
        parameters: this.auth,
        onSuccess: function(){
			this.depot.add("auth",this.auth)
			Github.auth = this.auth
            Mojo.Controller.stageController.popScene()
        }.bind(this),
        onFailure: function(response){
			this.controller.get("save").mojo.deactivate()
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
        }.bind(this)
    })
}
