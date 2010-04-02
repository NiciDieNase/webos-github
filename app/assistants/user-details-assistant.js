function UserDetailsAssistant(username){
    Mojo.Log.info("[UserDetailsAssistant] ==> Construct")
    this.username = username
    Mojo.Log.info("[UserDetailsAssistant] <=== Construct")
}

UserDetailsAssistant.prototype.setup = function(){
    Mojo.Log.info("[UserDetailsAssistant] ==> setup")
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    this.refreshUserinfo = this.refreshUserinfo.bind(this)
    
    /* --- Main widgets --- */
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: false
    })
    
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
	
	this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, {
        visible: true,
        items: [{
			visible:false
        },{
            label: $L('Refresh'),
            icon: 'refresh',
            command: 'do-refresh'
        }]
    });
    
    Mojo.Log.info("[UserDetailsAssistant] <== setup")
};

UserDetailsAssistant.prototype.activate = function(event){
    Mojo.Log.info("[UserDetailsAssistant] ==> activate")
    this.refreshUserinfo()
    Mojo.Log.info("[UserDetailsAssistant] <== activate")
};

UserDetailsAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[UserDetailsAssistant] <=> deactivate")
};

UserDetailsAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[UserDetailsAssistant] <=> cleanup")
};


UserDetailsAssistant.prototype.refreshUserinfo = function(){
    Mojo.Log.info("[UserDetailsAssistant] ==> refreshUserinfo")
    
    /* --- Load --- */
    Github.request("/user/show/#{user}", {user:this.username},{
        onSuccess: function(response){
            $("content").update(Mojo.View.render({
                object: response.responseJSON.user,
                template: (response.responseJSON.user.login === Github.auth.login) ? "user-details/private-details" : "user-details/public-details",
                formatters: {
                    created_at: function(value, model){
                        model.created_at = Mojo.Format.formatDate(new Date(value), {
                            date: 'medium'
                        })
                    },
                }
            }))
            
        }.bind(this),
        onFailure: StageAssistant.connectionError,
		onComplete: function (x) {
            $("load-status").hide()
            $("load-spinner").mojo.stop()
            $("content").show()
		},
		onCreate: function (x) {
            $("content").hide()
			$("load-spinner").mojo.start()
            $("load-status").show()
		},
        method: (Github.auth.login == this.username) ? "post" : "get"
    })
    Mojo.Log.info("[UserDetailsAssistant] <== refreshUserinfo")
}


UserDetailsAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[UserDetailsAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "user-list",
                    transition: Mojo.Transition.crossFade
                }, this.username)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "repo-list",
                    transition: Mojo.Transition.crossFade
                }, this.username)
                break;
            case 'do-refresh':
                event.stopPropagation()
                this.refreshUserinfo()
                break;
        }
    }
    Mojo.Log.info("[UserDetailsAssistant] <== handleCommand")
}
