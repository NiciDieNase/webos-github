function UserDetailsAssistant(depot, auth, username){
    /* this is the creator function for your scene assistant object. It will be passed all the 
     additional parameters (after the scene name) that were passed to pushScene. The reference
     to the scene controller (this.controller) has not be established yet, so any initialization
     that needs the scene controller should be done in the setup function below. */
    this.depot = depot
    this.auth = auth
    this.username = username
}

UserDetailsAssistant.prototype.setup = function(){
	this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
	
    /* --- Bindings --- */
    this.updateUserinfo = this.updateUserinfo.bind(this)
    
    /* --- Loader-Status --- */
    $("content").hide()
    $("load-status").show()
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: true
    })
    
    /* --- Main widgets --- */
    // App Menu
    this.controller.setupWidget(Mojo.Menu.appMenu, {
        omitDefaultItems: true
    }, StageAssistant.appMenu);
    
    // Head Menu
    this.controller.setupWidget(Mojo.Menu.viewMenu, {
        spacerHeight: 00,
        menuClass: 'no-fade'
    }, {
        visible: true,
        items: [{
            items: [{
                icon: "back",
                command: 'back',
                label: $L("Back")
            }, {
                label: $L("User Details"),
                width: 200
            }, {
                icon: "forward",
                command: 'fwd',
                label: $L("Forward")
            }]
        }]
    });
    
    /* --- Load --- */
    new Ajax.Request("https://github.com/api/v2/json/user/show/" + escape(this.username), {
        evalJSON: "false",
        onSuccess: this.updateUserinfo,
        onFailure: StageAssistant.connectionError,
        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey']),
        method: (this.auth.username === this.username) ? "post" : "get"
    })
};

UserDetailsAssistant.prototype.activate = function(event){
};

UserDetailsAssistant.prototype.deactivate = function(event){
};

UserDetailsAssistant.prototype.cleanup = function(event){
};


UserDetailsAssistant.prototype.updateUserinfo = function(response){
    $("load-spinner").mojo.stop()
    $("content").update(Mojo.View.render({
        object: response.responseJSON.user,
        template: (response.responseJSON.user.login === this.auth["username"]) ? "user-details/private-details" : "user-details/public-details",
        formatters: {
            created_at: function(value, model){
                model.created_at = Mojo.Format.formatDate(new Date(value), {
                    date: 'medium'
                })
            },
        }
    }))
	
    $("load-status").hide()
    $("content").show()
}


UserDetailsAssistant.prototype.handleCommand = function(event){
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "user-list",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "repo-list",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username)
                break;
        }
    }
}
