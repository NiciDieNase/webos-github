function RepoListAssistant(depot, auth, username){
    /* this is the creator function for your scene assistant object. It will be passed all the 
     
     additional parameters (after the scene name) that were passed to pushScene. The reference
     
     to the scene controller (this.controller) has not be established yet, so any initialization
     
     that needs the scene controller should be done in the setup function below. */
    this.depot = depot
    this.auth = auth
    this.username = username
}

RepoListAssistant.prototype.setup = function(){
	this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
	
	/* --- Bindings --- */
    this.updateRepositories = this.updateRepositories.bind(this)
    this.openRepo = this.openRepo.bind(this)
    
	
    /* --- Status widgets --- */
    $("content").hide()
    $("load-status").show()
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: true
    })
    
    
	/* --- Event Listener --- */
    Mojo.Event.listen($("content"), Mojo.Event.listTap, this.openRepo)
    
    
    /* --- App Widgets */
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
                label: "Repositories",
                width: 200
            }, {
                icon: "forward",
                command: 'fwd',
                label: "Forward"
            }]
        }]
    });
    
    
    /* --- UI widget --- */ 
    this.controller.setupWidget('content', {
        itemTemplate: 'repo-list/item-template',
        listTemplate: 'repo-list/list-template'
    }, this.listModel = {
        items: [],
        listTitle: "Repositories"
    });
    
	
    /* --- Load ---*/
    var request = new Ajax.Request("https://github.com/api/v2/json/repos/show/" + this.username, {
        method: "post",
        evalJSON: "false",
        onSuccess: this.updateRepositories,
        onFailure: StageAssistant.connectionError,
        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
    })
};

RepoListAssistant.prototype.activate = function(event, auth){
};

RepoListAssistant.prototype.deactivate = function(event){
};

RepoListAssistant.prototype.cleanup = function(event){
    Mojo.Event.stopListening($("repositories-list"), Mojo.Event.listTap, this.openRepo)
};

RepoListAssistant.prototype.handleCommand = function(event){
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "user-details",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "user-list",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username)
                break;
        }
    }
}

RepoListAssistant.prototype.openRepo = function(event){
    Mojo.Controller.stageController.pushScene("repo-details", this.depot, this.auth, event.item.owner, event.item.name)
}

RepoListAssistant.prototype.updateRepositories = function(response){
    this.listModel.items = response.responseJSON.repositories
    $("load-spinner").mojo.stop()
    this.controller.modelChanged(this.listModel)
    $("load-status").hide()
    $("content").show()
}
