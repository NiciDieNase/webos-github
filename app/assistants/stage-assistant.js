function StageAssistant(){
    var options = {
        name: "de.kingcrunch.github",
        version: 1, 	
        //displayName: "de.kingcrunch.github",
        //estimatedSize: 200000, 
        replace: false // open an existing depot
    };
    this.depot = new Mojo.Depot(options);
    
    this.handleCommand = this.handleCommand.bind(this)
}


StageAssistant.prototype.setup = function(){
    this.depot.get("auth", this.loadAuthorization.bind(this))
};


StageAssistant.prototype.loadAuthorization = function(auth){
    if (auth == undefined) {
        this.controller.pushScene("auth", this.depot)
    }
    else {
		this.auth = auth
        this.controller.pushScene("user-details", this.depot, auth, auth["username"])
    }
}

StageAssistant.prototype.handleCommand = function(event){
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'cmd-updateToken':
                event.stopPropagation()
                this.controller.pushScene("auth", this.depot, this.auth)
                break;
            case Mojo.Menu.helpItem.command:
                this.controller.pushAppSupportInfoScene()
                break;
        }
    }
}

StageAssistant.connectionError = function(response){
    if ((response.responseJSON == undefined) || (response.responseJSON.error == undefined)) {
        Mojo.Controller.errorDialog(response.status + ": " + response.statusText)
    }
    else {
        Mojo.Controller.errorDialog(response.responseJSON.error[0].error)
    }
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
