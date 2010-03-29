function SocialAssistant(depot, auth, username){
    /* this is the creator function for your scene assistant object. It will be passed all the 
     
     additional parameters (after the scene name) that were passed to pushScene. The reference
     
     to the scene controller (this.controller) has not be established yet, so any initialization
     
     that needs the scene controller should be done in the setup function below. */
    this.depot = depot
    this.auth = auth
	this.username = username
}

SocialAssistant.prototype.setup = function(){
    /* this function is for setup tasks that have to happen when the scene is first created */
    
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */
    
    /* setup widgets here */
    this.feedMenuModel = {
        visible: true,
        items: [{
            items: [{
                icon: "back",
                command: 'back',
                label: "Back"
            }, {
                label: "Social",
                width: 200
            }, {
                icon: "forward",
                command: 'fwd',
                label: "Forward"
            }]
        }]
    };
    this.controller.setupWidget(Mojo.Menu.viewMenu, {
        spacerHeight: 00,
        menuClass: 'no-fade'
    }, this.feedMenuModel);
    
    
    
    
    this.followersModel = {
        items: [{
            key: 'info',
            value: 'loading...'
        }],
        listTitle: "Followers"
    }
    
    // Set up the attributes & model for the List widget:
    this.controller.setupWidget('followers-list', {
        itemTemplate: 'social/item-template',
        listTemplate: 'social/list-template'
    }, this.followersModel);
    
	
    this.followingModel = {
        items: [{
            key: 'info',
            value: 'loading...'
        }],
        listTitle: "Following"
    }
    
    // Set up the attributes & model for the List widget:
    this.controller.setupWidget('following-list', {
        itemTemplate: 'social/item-template',
        listTemplate: 'social/list-template'
    }, this.followingModel);
    
    /* add event handlers to listen to events from widgets */
	
	
    
    var request = new Ajax.Request("https://github.com/api/v2/json/user/show/" + this.username + "/followers", {
        method: "post",
        evalJSON: "false",
        onSuccess: this.updateFollowers.bind(this),
        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
    })
    
    var request = new Ajax.Request("https://github.com/api/v2/json/user/show/" + this.username + "/following", {
        method: "post",
        evalJSON: "false",
        onSuccess: this.updateFollowing.bind(this),
        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
    })
};

SocialAssistant.prototype.activate = function(event){
    /* put in event handlers here that should only be in effect when this scene is active. For
     example, key handlers that are observing the document */
};

SocialAssistant.prototype.deactivate = function(event){
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
     this scene is popped or another scene is pushed on top */
};

SocialAssistant.prototype.cleanup = function(event){
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
};

SocialAssistant.prototype.handleCommand = function(event){
    //    this.controller = Mojo.Controller.stageController.activeScene();
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            // another built-in menu item, but we've enabled it (see below in this method)
            // so now we have to handle it:
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "repositories",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "userinfo",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username)
                break;
        }
    }
}

SocialAssistant.prototype.updateFollowers = function (response) {
	this.followersModel.items = []
	for (var i=0; i < response.responseJSON.users.length; i++) {
		this.followersModel.items.push({name:response.responseJSON.users[i]})
	}
	this.controller.modelChanged(this.followersModel)
}

SocialAssistant.prototype.updateFollowing = function (response) {
	this.followingModel.items = []
	for (var i=0; i < response.responseJSON.users.length; i++) {
		this.followingModel.items.push({name:response.responseJSON.users[i]})
	}
	this.controller.modelChanged(this.followingModel)
}
