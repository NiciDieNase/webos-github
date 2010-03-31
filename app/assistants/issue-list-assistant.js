function IssueListAssistant(depot, auth, user, repo){
    this.depot = depot
    this.auth = auth
    this.user = user
    this.repo = repo
    
    this.state = "open"
}

IssueListAssistant.prototype.setup = function(){
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    this.handleCommand = this.handleCommand.bind(this)
    this.refreshIssuelist = this.refreshIssuelist.bind(this)
    this.openIssue = this.openIssue.bind(this)
    
    
    /* --- Status widgets --- */
    $("load-spinner").hide()
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: false
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
    
    this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, {
        visible: true,
        items: [{
            visible: false
        }, {
            items: [{
                label: $L('Open'),
                command: 'cmd-showOpen',
            }, {
                label: $L('Closed'),
                command: 'cmd-showClosed',
            }],
            toggleCmd: "cmd-showOpen"
        }, {
            label: $L('Refresh'),
            icon: 'refresh',
            command: 'do-refresh'
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
};


IssueListAssistant.prototype.refreshIssuelist = function(state){
    this.state = state
    new Ajax.Request("https://github.com/api/v2/json/issues/list/" + this.user + "/" + this.repo + "/" + state, {
        method: "post",
        evalJSON: "false",
        onSuccess: function(response){
            this.listModel.items = response.responseJSON.issues
            this.controller.modelChanged(this.listModel)
        }
.bind(this)        ,
        onComplete: function(x){
            $("load-spinner").mojo.stop()
            $("load-status").hide()
            $("content").show()
        },
        onCreate: function(x){
            $("load-spinner").mojo.start()
            $("content").hide()
            $("load-status").show()
        },
        onFailure: StageAssistant.connectionError,
        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
    })
}

IssueListAssistant.prototype.openIssue = function(event){
    Mojo.Controller.stageController.pushScene("issue-details", this.depot, this.auth, this.user, this.repo, event.item.number)
}

IssueListAssistant.prototype.activate = function(event){
    this.refreshIssuelist(this.state)
};

IssueListAssistant.prototype.deactivate = function(event){
};

IssueListAssistant.prototype.cleanup = function(event){
    Mojo.Event.stopListening($("content"), Mojo.Event.listTap, this.openIssue)
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
            case 'do-refresh':
                event.stopPropagation()
                this.refreshIssuelist(this.state)
                break;
            case "cmd-showOpen":
                event.stopPropagation()
                this.refreshIssuelist("open")
                break;
            case "cmd-showClosed":
                event.stopPropagation()
                this.refreshIssuelist("closed")
                break;
        }
    }
}

