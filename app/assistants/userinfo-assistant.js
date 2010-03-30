function UserinfoAssistant(depot, auth, username){
    /* this is the creator function for your scene assistant object. It will be passed all the 
     additional parameters (after the scene name) that were passed to pushScene. The reference
     to the scene controller (this.controller) has not be established yet, so any initialization
     that needs the scene controller should be done in the setup function below. */
    this.depot = depot
    this.auth = auth
    this.username = username
}

UserinfoAssistant.prototype.setup = function(){
    /* this function is for setup tasks that have to happen when the scene is first created */
    this.updateUserinfo = this.updateUserinfo.bind(this)
    
    
	$("content").hide()
	$("load-status").show()
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: true
    })
	
	
    var conAttr = {
        evalJSON: "false",
        onSuccess: this.updateUserinfo,
        onFailure: StageAssistant.connectionError,
    
    }
    
    
    if (this.auth["username"] == this.username) {
        conAttr.method = "post"
        conAttr.postBody = "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
    }
    else {
        conAttr.method = "get"
    }
    var request = new Ajax.Request("https://github.com/api/v2/json/user/show/" + escape(this.username), conAttr)
    
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */
    
    /* setup widgets here */
    this.controller.setupWidget(Mojo.Menu.appMenu, {
        omitDefaultItems: true
    }, StageAssistant.appMenu);
    
    this.feedMenuModel = {
        visible: true,
        items: [{
            items: [{
                icon: "back",
                command: 'back',
                label: $L("Back")
            }, {
                label: $L("Userinfo"),
                width: 200
            }, {
                icon: "forward",
                command: 'fwd',
                label: $L("Forward")
            }]
        }]
    };
    this.controller.setupWidget(Mojo.Menu.viewMenu, {
        spacerHeight: 00,
        menuClass: 'no-fade'
    }, this.feedMenuModel);
    
    /* add event handlers to listen to events from widgets */

    /* add event handlers to listen to events from widgets */
};

UserinfoAssistant.prototype.activate = function(event){
    /* put in event handlers here that should only be in effect when this scene is active. For
     example, key handlers that are observing the document */
};

UserinfoAssistant.prototype.deactivate = function(event){
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
     this scene is popped or another scene is pushed on top */
};

UserinfoAssistant.prototype.cleanup = function(event){
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
};


UserinfoAssistant.prototype.updateUserinfo = function(response){
    //	this.controller.get("debug").update(dump(response.responseJSON))
    //    this.controller.get("username").update(response.responseJSON.user.name)
    var tmpl = (response.responseJSON.user.login === this.auth["username"]) ? "userinfo/private-details" : "userinfo/public-details"
    var content = Mojo.View.render({
        object: response.responseJSON.user,
        template: tmpl,
        formatters: {
            created_at: function(value, model){
                model.created_at = Mojo.Format.formatDate(new Date(value), {
                    date: 'medium'
                })
            },
        }
    })
	$("load-status").hide()
	$("load-spinner").mojo.stop()
    $("content").update(content)
	$("content").show()
}


UserinfoAssistant.prototype.handleCommand = function(event){

    //    this.controller = Mojo.Controller.stageController.activeScene();
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            // another built-in menu item, but we've enabled it (see below in this method)
            // so now we have to handle it:
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "social",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "repositories",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username)
                break;
        }
    }
}
