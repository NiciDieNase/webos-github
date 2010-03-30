function RepodetailAssistant(depot, auth, username, repo){
    /* this is the creator function for your scene assistant object. It will be passed all the 
     additional parameters (after the scene name) that were passed to pushScene. The reference
     to the scene controller (this.controller) has not be established yet, so any initialization
     that needs the scene controller should be done in the setup function below. */
    this.depot = depot
    this.auth = auth
    this.username = username
    this.repo = repo
}

RepodetailAssistant.prototype.setup = function(){
    /* this function is for setup tasks that have to happen when the scene is first created */
    
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */
    
    /* setup widgets here */
    this.feedMenuModel = {
        visible: true,
        items: [{
            items: [{
                icon: "back",
                command: 'back',
                label: $L("Back")
            }, {
                label: $L("Repodetail") + ": " + this.repo,
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
    
    var request = new Ajax.Request("https://github.com/api/v2/json/repos/show/" + escape(this.username) + "/" + escape(this.repo), {
        method: "post",
        evalJSON: "false",
        onSuccess: this.updateRepodetail.bind(this),
        onFailure: StageAssistant.connectionError,
        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
    })
};

RepodetailAssistant.prototype.activate = function(event){
    /* put in event handlers here that should only be in effect when this scene is active. For
     example, key handlers that are observing the document */
};

RepodetailAssistant.prototype.deactivate = function(event){
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
     this scene is popped or another scene is pushed on top */
};

RepodetailAssistant.prototype.cleanup = function(event){
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
};

RepodetailAssistant.prototype.updateRepodetail = function(response){    
	var content = Mojo.View.render({
        object: response.responseJSON.repository,
        template: 'repodetail/details'
    })
    this.controller.get("repodetail-details").update(content)
}


RepodetailAssistant.prototype.handleCommand = function(event){

    //    this.controllesr = Mojo.Controller.stageController.activeScene();
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            // another built-in menu item, but we've enabled it (see below in this method)
            // so now we have to handle it:
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "issues",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username, this.repo)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "issues",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username, this.repo)
                break;
        }
    }
}
