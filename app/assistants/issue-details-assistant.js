function IssueDetailsAssistant(depot, auth, user, repo, number){
    /* this is the creator function for your scene assistant object. It will be passed all the 
     additional parameters (after the scene name) that were passed to pushScene. The reference
     to the scene controller (this.controller) has not be established yet, so any initialization
     that needs the scene controller should be done in the setup function below. */
    this.depot = depot
    this.auth = auth
    this.user = user
    this.repo = repo
    this.number = number
}

IssueDetailsAssistant.prototype.setup = function(){
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    this.refreshIssueinfo = this.refreshIssueinfo.bind(this)
	this.handleCommand = this.handleCommand.bind(this)
    
    
    /* --- Status widgets --- */
    $("load-status").hide()
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: true
    })
    
    
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
                label: $L("Back")
            }, {
                label: $L("Issue Details"),
                width: 200
            }, {
                icon: "forward",
                command: 'fwd',
                label: $L("Forward")
            }]
        }]
    });
    
    this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, {
        visible: true,
        items: [{
            visible: false
        }, {
            label: $L('Refresh'),
            icon: 'refresh',
            command: 'do-refresh'
        }]
    });
};

IssueDetailsAssistant.prototype.connectionFailed = function(response){
}

IssueDetailsAssistant.prototype.refreshIssueinfo = function(response){
    new Ajax.Request("https://github.com/api/v2/json/issues/show/" + escape(this.user) + "/" + escape(this.repo) + "/" + escape(this.number), {
        method: "post",
        evalJSON: "false",
        onSuccess: function(response){
            var content = Mojo.View.render({
                object: response.responseJSON.issue,
                template: 'issue-details/details'
            })
            $("details").update(content)
        }
.bind(this)        ,
        onComplete: function(x){
        
            $("load-status").hide()
            $("load-spinner").mojo.stop()
            $("details").show()
        },
        onCreate: function(x){
            $("details").hide()
            $("load-status").show()
        },
        onFailure: StageAssistant.connectionError,
        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
    })
}


IssueDetailsAssistant.prototype.activate = function(event){
    this.refreshIssueinfo()
};

IssueDetailsAssistant.prototype.deactivate = function(event){
};

IssueDetailsAssistant.prototype.cleanup = function(event){
};

IssueDetailsAssistant.prototype.handleCommand = function(event){
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "issue-details",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.user, this.repo)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "issue-details",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.user, this.repo)
                break;
            case 'do-refresh':
                event.stopPropagation()
                this.refreshIssueinfo()
                break;
        }
    }
}
