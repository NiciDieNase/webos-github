function StageAssistant(){
    Mojo.Log.info("[StageAssistant] ==> Construct")
    var options = {
        name: "de.kingcrunch.github",
        version: 1,
        //displayName: "de.kingcrunch.github",
        //estimatedSize: 200000, 
        replace: false // open an existing depot
    };
    this.depot = new Mojo.Depot(options);
    
    this.handleCommand = this.handleCommand.bind(this)
    Mojo.Log.info("[StageAssistant] <== Construct")
}


StageAssistant.prototype.setup = function(){
    Mojo.Log.info("[StageAssistant] ==> setup")
    this.depot.get("auth", this.loadAuthorization.bind(this))
    Mojo.Log.info("[StageAssistant] <== setup")
};


StageAssistant.prototype.loadAuthorization = function(auth){
    Mojo.Log.info("[StageAssistant] ==> loadAuthorization")
    if (auth == undefined) {
        Mojo.Log.info("[StageAssistant] === loadAuthorization: Auth undefined, push 'auth'")
        this.controller.pushScene("auth", this.depot)
    }
    else {
        Mojo.Log.info("[StageAssistant] === loadAuthorization: Auth defined, push 'user-details'")
        this.auth = auth
		Github.authorize(auth.username,auth.apikey)
        this.controller.pushScene("user-details", this.depot, auth, auth["username"])
    }
    Mojo.Log.info("[StageAssistant] <== loadAuthorization")
}

StageAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[StageAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
        Mojo.Log.info("[StageController] = handleCommand: '" + event.command + "' received")
        switch (event.command) {
            case 'cmd-updateToken':
                event.stopPropagation()
                this.controller.pushScene("auth", this.depot, this.auth)
                break;
            case Mojo.Menu.helpItem.command:
                this.controller.pushAppSupportInfoScene()
                break;
            default:
                Mojo.Log.info("[StageAssistant] = handleCommand: '" + event.command + "' not handled here")
                break;
                
        }
    }
    Mojo.Log.info("[StageAssistant] <== loadAuthorization")
}

StageAssistant.connectionError = function(response){
    Mojo.Log.info("[StageAssistant] ==> connectionError")
    if ((response.responseJSON == undefined) || (response.responseJSON.error == undefined)) {
        Mojo.Log.error("[StageAssistant] === connectionError: Error caused by Connection: " + response.status +" - '" +response.statusText + "' not handled correctly")
        Mojo.Controller.errorDialog(response.status + ": " + response.statusText)
    }
    else {
        Mojo.Log.warn("[StageAssistant] === connectionError: Error caused by Application: "+response.responseJSON.error[0].error)
        Mojo.Controller.errorDialog(response.responseJSON.error[0].error)
    }
    Mojo.Log.info("[StageAssistant] <== connectionError")
}

StageAssistant.appMenu = {
    visible: true,
    items: [Mojo.Menu.editItem, {
        label: $L('Update Token'),
        command: 'cmd-updateToken'
    }, {
        label: Mojo.Menu.prefsItem.label,
        command: Mojo.Menu.prefsItem.command,
        disabled: true
    }, {
        label: Mojo.Menu.helpItem.label,
        command: Mojo.Menu.helpItem.command
    }]
}
