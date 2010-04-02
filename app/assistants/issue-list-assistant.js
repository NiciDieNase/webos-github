function IssueListAssistant(depot, auth, user, repo){
    Mojo.Log.info("[IssueListAssistant] ==> Construct")
    this.depot = depot
    this.auth = auth
    this.user = user
    this.repo = repo
    
    this.state = "open"
    Mojo.Log.info("[IssueListAssistant] <== Construct")
}

IssueListAssistant.prototype.setup = function(){
    Mojo.Log.info("[IssueListAssistant] ==> setup")
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
        items: undefined,
        listTitle: "Issues"
    });
    Mojo.Log.info("[IssueListAssistant] <== setup")
};


IssueListAssistant.prototype.refreshIssuelist = function(state){
    Mojo.Log.info("[IssueListAssistant] ==> refreshIssuelist")
    this.state = state
    Github.request("/issues/list/#{user}/#{repo}/#{state}", {
        user: this.user,
        repo: this.repo,
        state: state
    }, {
        onSuccess: function(params,response){
            this.listModel.items = response.responseJSON.issues
			this.listModel.listTitle = "#{state} Issues for #{user}/#{repo}".interpolate(params)
            this.controller.modelChanged(this.listModel)
        }
.bind(this,{user:this.user,repo:this.repo,state:this.state})        ,
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
    })
    
    Mojo.Log.info("[IssueListAssistant] <== refreshIssuelist")
}

IssueListAssistant.prototype.openIssue = function(event){
    Mojo.Log.info("[IssueListAssistant] ==> openIssue")
    Mojo.Controller.stageController.pushScene("issue-details", this.depot, this.auth, this.user, this.repo, event.item.number)
    Mojo.Log.info("[IssueListAssistant] <== openIssue")
}

IssueListAssistant.prototype.activate = function(event){
    Mojo.Log.info("[IssueListAssistant] ==> activate")
    if (this.listModel.items == undefined)
    this.refreshIssuelist(this.state)
    Mojo.Log.info("[IssueListAssistant] <== activate")
};

IssueListAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[IssueListAssistant] <=> deactivate")
};

IssueListAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[IssueListAssistant] ==> clean")
    Mojo.Event.stopListening($("content"), Mojo.Event.listTap, this.openIssue)
    Mojo.Log.info("[IssueListAssistant] <== cleanup")
};

IssueListAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[IssueListAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "ref-list",
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
    Mojo.Log.info("[IssueListAssistant] <== handleCommand")
}

