function RepositoriesAssistant(depot,auth, username){
    /* this is the creator function for your scene assistant object. It will be passed all the 
     
     additional parameters (after the scene name) that were passed to pushScene. The reference
     
     to the scene controller (this.controller) has not be established yet, so any initialization
     
     that needs the scene controller should be done in the setup function below. */
	this.depot = depot
	this.auth = auth
	this.username = username
}

RepositoriesAssistant.prototype.setup = function(){
    /* this function is for setup tasks that have to happen when the scene is first created */
    
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */
    
    
	$("repositories-list").hide()
	$("load-status").show()
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: true
    })
	
    
    /* setup widgets here */
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems:true}, StageAssistant.appMenu); 
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
        items: [],
        listTitle: "Repositories"
    }
    
    // Set up the attributes & model for the List widget:
    this.controller.setupWidget('repositories-list', {
        itemTemplate: 'repositories/item-template',
        listTemplate: 'repositories/list-template'
    }, this.listModel);
	
	this.updateRepositories = this.updateRepositories.bind(this)
    
    var request = new Ajax.Request("https://github.com/api/v2/json/repos/show/" + this.username, {
        method: "post",
        evalJSON: "false",
        onSuccess: this.updateRepositories,
		onFailure: StageAssistant.connectionError,
        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
    })
	
	
    
//    var request = new Ajax.Request("https://github.com/api/v2/json/repos/watched/" + this.username, {
//        method: "post",
//        evalJSON: "false",
//        onSuccess: this.updateWatchedRepos.bind(this),
//        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
//    })
    
    /* add event handlers to listen to events from widgets */
	this.openRepo = this.openRepo.bind(this)
	Mojo.Event.listen(this.controller.get("repositories-list"), Mojo.Event.listTap, this.openRepo)
};

RepositoriesAssistant.prototype.activate = function(event, auth){
};

RepositoriesAssistant.prototype.deactivate = function(event){
};

RepositoriesAssistant.prototype.cleanup = function(event){
	Mojo.Event.stopListening(this.controller.get("repositories-list"), Mojo.Event.listTap, this.openRepo)
};

RepositoriesAssistant.prototype.handleCommand = function(event){
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            // another built-in menu item, but we've enabled it (see below in this method)
            // so now we have to handle it:
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "userinfo",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "social",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username)
                break;
        }
    }
}

RepositoriesAssistant.prototype.openRepo = function (event) {
	Mojo.Controller.stageController.pushScene("repodetail",this.depot,this.auth,event.item.owner,event.item.name)
}

RepositoriesAssistant.prototype.updateRepositories = function (response) {
	this.listModel.items = response.responseJSON.repositories
	$("load-status").hide()
	$("load-spinner").mojo.stop()
	$("repositories-list").show()
	this.controller.modelChanged(this.listModel)
}
