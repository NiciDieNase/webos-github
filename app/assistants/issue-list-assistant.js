function IssueListAssistant(depot, auth, user, repo){
    this.depot = depot
    this.auth = auth
    this.user = user
    this.repo = repo
}

IssueListAssistant.prototype.setup = function(){
	this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
	
	/* --- Bindings --- */
	this.handleCommand = this.handleCommand.bind(this)
	this.updateIssues = this.updateIssues.bind(this)
    this.openIssue = this.openIssue.bind(this)
    
    
	/* --- Status widgets --- */
	$("content").hide()
	$("load-status").show()
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: true
    })
	
	
	/* --- Event Listener --- */
    Mojo.Event.listen($("content"), Mojo.Event.listTap, this.openIssue)
    
	
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
                label: "Issue List",
                width: 200
            }, {
                icon: "forward",
                command: 'fwd',
                label: "Forward"
            }]
        }]
    });
    
    
    /* --- UI widgets --- */
    this.controller.setupWidget('content', {
        itemTemplate: 'issue-list/item-template',
        listTemplate: 'issue-list/list-template'
    }, this.listModel = {
        items: [],
        listTitle: "Issues"
    });

    
    /* --- Load --- */
    new Ajax.Request("https://github.com/api/v2/json/issues/list/" + this.user + "/" + this.repo + "/open", {
        method: "post",
        evalJSON: "false",
        onSuccess: this.updateIssues,
        onFailure: StageAssistant.connectionError,
        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
    })
};

IssueListAssistant.prototype.updateIssues = function(response){
    this.listModel.items = response.responseJSON.issues
	$("load-spinner").mojo.stop()
    this.controller.modelChanged(this.listModel)
    $("load-status").hide()
	$("content").show()
}

IssueListAssistant.prototype.openIssue = function(event){
    Mojo.Controller.stageController.pushScene("issue-details", this.depot, this.auth, this.user, this.repo, event.item.number)
}

IssueListAssistant.prototype.activate = function(event){
};

IssueListAssistant.prototype.deactivate = function(event){
};

IssueListAssistant.prototype.cleanup = function(event){
    Mojo.Event.stopListening($("issues-list"), Mojo.Event.listTap, this.openIssue)
};

IssueListAssistant.prototype.handleCommand = function(event){
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "repo-details",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.user, this.repo)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "repo-details",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.user, this.repo)
                break;
                break;
        }
    }
}

