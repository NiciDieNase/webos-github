function UserListAssistant(depot, auth, username){
    /* this is the creator function for your scene assistant object. It will be passed all the 
     
     additional parameters (after the scene name) that were passed to pushScene. The reference
     
     to the scene controller (this.controller) has not be established yet, so any initialization
     
     that needs the scene controller should be done in the setup function below. */
    this.depot = depot
    this.auth = auth
    this.username = username
    
    this.direction = "following"
}

UserListAssistant.prototype.setup = function(){
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    this.openUserinfo = this.openUserinfo.bind(this)
    this.refreshUsers = this.refreshUsers.bind(this)
    
    /* --- Loader-Status --- */
	$("load-spinner").hide()
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
        listTitle: "Following",
        items: []
    })
};

UserListAssistant.prototype.activate = function(event){
    this.refreshUsers(this.direction)
};

UserListAssistant.prototype.deactivate = function(event){
};

UserListAssistant.prototype.cleanup = function(event){
    Mojo.Event.stopListening(this.controller.get("content"), Mojo.Event.listTap, this.openUserinfo)
};

UserListAssistant.prototype.refreshUsers = function(direction){
    this.direction = direction
    /* --- Load --- */
    new Ajax.Request("https://github.com/api/v2/json/user/show/" + this.username + "/" + direction, {
        method: "post",
        evalJSON: "false",
        onSuccess: function(response){
        
            this.listModel.items = response.responseJSON.users.collect(function(value){
                return {
                    name: value
                }
            })
            
            this.controller.modelChanged(this.listModel)
        }.bind(this),
        onComplete: function(x){
            $("load-spinner").mojo.stop()
            $("load-status").hide()
            $("content").show()
        },
        onCreate: function(x){
            $("content").hide()
            $("load-status").show()
        },
        onFailure: StageAssistant.connectionError,
        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
    })
}

UserListAssistant.prototype.openUserinfo = function(event){
    Mojo.Controller.stageController.pushScene("user-details", this.depot, this.auth, event.item.name)
    
}

UserListAssistant.prototype.handleCommand = function(event){
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "repo-list",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "user-details",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username)
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
}
