function CommitDetailsAssistant(user, repo, sha){
    Mojo.Log.info("[CommitDetailsAssistant] ==> Construct")
    this.user = user
    this.repo = repo
    this.sha = sha
    Mojo.Log.info("[CommitDetailsAssistant] <== Construct")
}

CommitDetailsAssistant.prototype.setup = function(){
    Mojo.Log.info("[CommitDetailsAssistant] ==> setup")
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    this.refreshCommiteinfo = this.refreshCommitinfo.bind(this)
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
                label: $L("Commit Details"),
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
    Mojo.Log.info("[CommitDetailsAssistant] <== setup")
};

CommitDetailsAssistant.prototype.refreshCommitinfo = function(){
    Mojo.Log.info("[CommitDetailsAssistant] ==> refreshCommitinfo")
    
    Github.request("/commits/show/#{user}/#{repo}/#{sha}", {
        user: this.user,
        repo: this.repo,
        sha: this.sha
    }, {
        onSuccess: function(response){
            var content = Mojo.View.render({
                object: response.responseJSON.commit,
                template: 'commit-details/details'
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
    
    Mojo.Log.info("[CommitDetailsAssistant] <== refreshCommitinfo")
}

CommitDetailsAssistant.prototype.activate = function(event){
    Mojo.Log.info("[CommitDetailsAssistant] ==> activate")
    this.refreshCommiteinfo()
    Mojo.Log.info("[CommitDetailsAssistant] <== activate")
};

CommitDetailsAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[CommitDetailsAssistant] <=> deactivate")
};

CommitDetailsAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[CommitDetailsAssistant] <=> cleanup")
};

CommitDetailsAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[CommitDetailsAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "commit-details",
                    transition: Mojo.Transition.crossFade
                }, this.user, this.repo, this.sha)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "commit-details",
                    transition: Mojo.Transition.crossFade
                }, this.user, this.repo, this.sha)
                break;
            case 'do-refresh':
                event.stopPropagation()
                this.refreshCommitinfo()
                break;
        }
    }
    Mojo.Log.info("[CommitDetailsAssistant] <== handleCommand")
}
