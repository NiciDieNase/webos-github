function UserListAssistant(username){
    Mojo.Log.info("[UserListAssistant] ==> Construct")
    this.username = username
    
    this.direction = "following"
    Mojo.Log.info("[UserListAssistant] <== Construct")
}

UserListAssistant.prototype.setup = function(){
    Mojo.Log.info("[UserListAssistant] ==> setup")
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    this.openUserinfo = this.openUserinfo.bind(this)
    this.refreshUsers = this.refreshUsers.bind(this)
    
    /* --- Loader-Status --- */
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: false
    })
    
    
    /* --- Event Listeners --- */
    Mojo.Event.listen($("content"), Mojo.Event.listTap, this.openUserinfo)
    
    
    /* --- App widgets --- */
    this.controller.setupWidget(Mojo.Menu.appMenu, {
        omitDefaultItems: true
    }, StageAssistant.appMenu);
    
    this.controller.setupWidget(Mojo.Menu.viewMenu, {
        spacerHeight: 00,
        menuClass: 'no-fade'
    }, {
        visible: true,
        items: [{
            items: [{
                icon: "back",
                command: 'back',
                label: "Back"
            }, {
                label: "Users",
                width: 200
            }, {
                icon: "forward",
                command: 'fwd',
                label: "Forward"
            }]
        }]
    });
    
    this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, {
        visible: true,
        items: [{
            visible: false
        }, {
            items: [{
                label: $L('Following'),
                command: 'cmd-showFollowing',
            }, {
                label: $L('Followers'),
                command: 'cmd-showFollowers',
            }],
            toggleCmd: "cmd-showFollowing"
        }, {
            label: $L('Refresh'),
            icon: 'refresh',
            command: 'do-refresh'
        }]
    });
    
    
    /* --- UI widgets --- */
    this.controller.setupWidget('content', {
        itemTemplate: 'user-list/item-template',
        listTemplate: 'user-list/list-template'
    }, this.listModel = {
        listTitle: "User List",
        items: undefined
    })
    
    
    Mojo.Log.info("[UserListAssistant] <== setup")
};

UserListAssistant.prototype.activate = function(event){
    Mojo.Log.info("[UserListAssistant] ==> activate")
	if (this.listModel.items == undefined)
    this.refreshUsers(this.direction)
    Mojo.Log.info("[UserListAssistant] <== activate")
};

UserListAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[UserListAssistant] <=> deactive")
};

UserListAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[UserListAssistant] ==> cleanup")
    Mojo.Event.stopListening(this.controller.get("content"), Mojo.Event.listTap, this.openUserinfo)
    Mojo.Log.info("[UserListAssistant] <== cleanup")
};

UserListAssistant.prototype.refreshUsers = function(direction){
    Mojo.Log.info("[UserListAssistant] ==> refreshUsers")
    this.direction = direction
    
    
    /* --- Load --- */
    Github.request("/user/show/#{user}/#{direction}", {
        user: this.username,
        direction: direction
    }, {
        onSuccess: function(params, response){
			Mojo.Log.info("[UserListAssistant] === refreshUsers -> onSuccess")
            this.listModel.items = response.responseJSON.users.collect(function(value){
                return {
                    name: value
                }
            })
            this.listModel.listTitle = ((params.direction == "following") ? "#{user} follows" : "Following #{user}").interpolate(params)
            this.controller.modelChanged(this.listModel)
            Mojo.Log.info("[UserListAssistant] === refreshUsers <- onSuccess")
        }.bind(this, {
            user: this.username,
			direction: direction
			
        }),
        onComplete: function(x){
            Mojo.Log.info("[UserListAssistant] === refreshUsers -> onComplete")
            $("load-spinner").mojo.stop()
            $("load-status").hide()
            $("content").show()
            Mojo.Log.info("[UserListAssistant] === refreshUsers <- onComplete")
        },
        onCreate: function(x){
            Mojo.Log.info("[UserListAssistant] === refreshUsers -> onCreate")
            $("content").hide()
            $("load-spinner").mojo.start()
            $("load-status").show()
            Mojo.Log.info("[UserListAssistant] === refreshUsers <- onCreate")
        },
    })
    
    
    Mojo.Log.info("[UserListAssistant] <== refreshUsers")
}

UserListAssistant.prototype.openUserinfo = function(event){
    Mojo.Log.info("[UserListAssistant] ==> openUserinfo")
    Mojo.Controller.stageController.pushScene("user-details", event.item.name)
    Mojo.Log.info("[UserListAssistant] <== openUserinfo")
}

UserListAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[UserListAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "activities-list",
                    transition: Mojo.Transition.crossFade
                }, this.username)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "user-details",
                    transition: Mojo.Transition.crossFade
                }, this.username)
                break;
            case 'do-refresh':
                event.stopPropagation()
                this.refreshUsers(this.direction)
                break;
            case "cmd-showFollowers":
                event.stopPropagation()
                this.refreshUsers("followers")
                break;
            case "cmd-showFollowing":
                event.stopPropagation()
                this.refreshUsers("following")
                break;
        }
    }
    Mojo.Log.info("[UserListAssistant] <== handleCommand")
}
