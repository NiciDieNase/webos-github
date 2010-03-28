function RepositoriesAssistant(depot,auth){
    /* this is the creator function for your scene assistant object. It will be passed all the 
     
     additional parameters (after the scene name) that were passed to pushScene. The reference
     
     to the scene controller (this.controller) has not be established yet, so any initialization
     
     that needs the scene controller should be done in the setup function below. */
	this.depot = depot
	this.auth = auth
}

RepositoriesAssistant.prototype.setup = function(){
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
                label: "Repositories",
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
	
	
	this.listModel = {
        items: [{
            key: 'info',
            value: 'loading...'
        }],
        listTitle: "Repositories"
    }
    
    // Set up the attributes & model for the List widget:
    this.controller.setupWidget('repositories-list', {
        itemTemplate: 'repositories/item-template',
        listTemplate: 'repositories/list-template'
    }, this.listModel);
    
    var request = new Ajax.Request("https://github.com/api/v2/json/repos/show/" + this.auth["username"], {
        method: "post",
        evalJSON: "false",
        onSuccess: this.updateRepositories.bind(this),
        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
    })
    
    /* add event handlers to listen to events from widgets */
};

RepositoriesAssistant.prototype.activate = function(event, auth){
    /* put in event handlers here that should only be in effect when this scene is active. For
     example, key handlers that are observing the document */
};

RepositoriesAssistant.prototype.deactivate = function(event){
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
     this scene is popped or another scene is pushed on top */
};

RepositoriesAssistant.prototype.cleanup = function(event){
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
};

RepositoriesAssistant.prototype.handleCommand = function(event){

//    this.controllesr = Mojo.Controller.stageController.activeScene();
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            // another built-in menu item, but we've enabled it (see below in this method)
            // so now we have to handle it:
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "userinfo",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "social",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth)
                break;
        }
    }
}

RepositoriesAssistant.prototype.updateRepositories = function (response) {
	this.listModel.items = response.responseJSON.repositories
	this.controller.modelChanged(this.listModel)
}