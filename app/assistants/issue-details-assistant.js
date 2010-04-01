function IssueDetailsAssistant(depot, auth, user, repo, number){
    Mojo.Log.info("[IssueDetailsAssistant] ==> Construct")
    this.depot = depot
    this.auth = auth
    this.user = user
    this.repo = repo
    this.number = number
    Mojo.Log.info("[IssueDetailsAssistant] <== Construct")
}

IssueDetailsAssistant.prototype.setup = function(){
    Mojo.Log.info("[IssueDetailsAssistant] <== setup")
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
    Mojo.Log.info("[IssueDetailsAssistant] <== setup")
};

IssueDetailsAssistant.prototype.refreshIssueinfo = function(){
    Mojo.Log.info("[IssueDetailsAssistant] ==> refreshIssueinfo")
	
    Github.request("/issues/show/#{user}/#{repo}/#{number}",{user:this.user,repo:this.repo,number:this.number}, {
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
    })
	
    Mojo.Log.info("[IssueDetailsAssistant] <== refreshIssueinfo")
}


IssueDetailsAssistant.prototype.activate = function(event){
    Mojo.Log.info("[IssueDetailsAssistant] ==> activate")
    this.refreshIssueinfo()
    Mojo.Log.info("[IssueDetailsAssistant] <== activate")
};

IssueDetailsAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[IssueDetailsAssistant] <=> deactivate")
};

IssueDetailsAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[IssueDetailsAssistant] <=> cleanup")
};

IssueDetailsAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[IssueDetailsAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "comment-list",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.user, this.repo,this.number)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "comment-list",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.user, this.repo,this.number)
                break;
            case 'do-refresh':
                event.stopPropagation()
                this.refreshIssueinfo()
                break;
        }
    }
    Mojo.Log.info("[IssueDetailsAssistant] <== handleCommand")
}
