function IssuesAssistant(depot, auth, user, repo){
    /* this is the creator function for your scene assistant object. It will be passed all the 
     additional parameters (after the scene name) that were passed to pushScene. The reference
     to the scene controller (this.controller) has not be established yet, so any initialization
     that needs the scene controller should be done in the setup function below. */
    this.depot = depot
    this.auth = auth
    this.user = user
    this.repo = repo
}

IssuesAssistant.prototype.setup = function(){
	this.handleCommand = this.handleCommand.bind(this)
    /* this function is for setup tasks that have to happen when the scene is first created */
    
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */
    
    
	$("issues-list").hide()
	$("load-status").show()
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: true
    })
    
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
                label: "Back"
            }, {
                label: "Issues",
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
        listTitle: "Issues"
    }
    
    // Set up the attributes & model for the List widget:
    this.controller.setupWidget('issues-list', {
        itemTemplate: 'issues/item-template',
        listTemplate: 'issues/list-template'
    }, this.listModel);
    
    /* add event handlers to listen to events from widgets */
//    this.controller.get("issues-debug").update(this.user + "/" + this.repo)
    var request = new Ajax.Request("https://github.com/api/v2/json/issues/list/" + this.user + "/" + this.repo + "/open", {
        method: "post",
        evalJSON: "false",
        onSuccess: this.updateIssues.bind(this),
        onFailure: this.failedUpdate.bind(this),
        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
    })
    
    this.openIssue = this.openIssue.bind(this)
    Mojo.Event.listen(this.controller.get("issues-list"), Mojo.Event.listTap, this.openIssue)
};

IssuesAssistant.prototype.updateIssues = function(response){
    this.listModel.items = response.responseJSON.issues
    $("load-status").hide()
	$("load-spinner").mojo.stop()
    this.controller.modelChanged(this.listModel)
	$("issues-list").show()
}

IssuesAssistant.prototype.failedUpdate = function(response){
    this.controller.get("issues-debug").update(dump(response.responseJSON))
}

IssuesAssistant.prototype.openIssue = function(event){
    Mojo.Controller.stageController.pushScene("issuedetail", this.depot, this.auth, this.user, this.repo, event.item.number)
}

IssuesAssistant.prototype.activate = function(event){
    /* put in event handlers here that should only be in effect when this scene is active. For
     example, key handlers that are observing the document */
};

IssuesAssistant.prototype.deactivate = function(event){
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
     this scene is popped or another scene is pushed on top */
};

IssuesAssistant.prototype.cleanup = function(event){
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
    Mojo.Event.stopListening(this.controller.get("issues-list"), Mojo.Event.listTap, this.openIssue)
};

IssuesAssistant.prototype.handleCommand = function(event){

    //    this.controllesr = Mojo.Controller.stageController.activeScene();
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            // another built-in menu item, but we've enabled it (see below in this method)
            // so now we have to handle it:
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "repodetail",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.user, this.repo)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "repodetail",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.user, this.repo)
                break;
                break;
        }
    }
}

