function RepoDetailsAssistant(username, repo){
    Mojo.Log.info("[RepoDetailsAssistant] ==> Construct")
    this.username = username
    this.repo = repo
    Mojo.Log.info("[RepoDetailsAssistant] <== Construct")
}

RepoDetailsAssistant.prototype.setup = function(){
    Mojo.Log.info("[RepoDetailsAssistant] ==> setup")
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    this.refreshRepoinfo = this.refreshRepoinfo.bind(this)
    
    
    /* --- Status widgets --- */
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
                label: $L("Repository Details"),
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
    
    Mojo.Log.info("[RepoDetailsAssistant] <== setup")
};

RepoDetailsAssistant.prototype.activate = function(event){
    Mojo.Log.info("[RepoDetailsAssistant] ==> activate")
    this.refreshRepoinfo()
    Mojo.Log.info("[RepoDetailsAssistant] <== activate")
};

RepoDetailsAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[RepoDetailsAssistant] <=> Construct")
};

RepoDetailsAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[RepoDetailsAssistant] <=> Construct")
};

RepoDetailsAssistant.prototype.refreshRepoinfo = function(){
    Mojo.Log.info("[RepoDetailsAssistant] ==> refreshRepoinfo")
    
    
    Github.request("/repos/show/#{user}/#{repo}", {
        user: this.username,
        repo: this.repo
    }, {
        onSuccess: function(response){
            Mojo.Log.info("[RepoDetailsAssistant] === refreshRepoinfo -> onSuccess")
            var content = Mojo.View.render({
                object: response.responseJSON.repository,
                template: 'repo-details/details'
            })
            
            $("details").update(content)
            Mojo.Log.info("[RepoDetailsAssistant] === refreshRepoinfo <- onSuccess")
        }
.bind(this)        ,
        onCreate: function(x){
            Mojo.Log.info("[RepoDetailsAssistant] === refreshRepoinfo -> onCreate")
            $("load-spinner").mojo.start()
            $("details").hide()
            $("load-status").show()
            Mojo.Log.info("[RepoDetailsAssistant] === refreshRepoinfo <- onCreate")
        },
        onComplete: function(x){
            Mojo.Log.info("[RepoDetailsAssistant] === refreshRepoinfo -> onComplete")
            $("load-status").hide()
            $("load-spinner").mojo.stop()
            $("details").show()
            Mojo.Log.info("[RepoDetailsAssistant] === refreshRepoinfo <- onComplete")
        },
		method: (Github.auth.login == this.username) ? "post" : "get"
    })
    
    Mojo.Log.info("[RepoDetailsAssistant] <== refreshRepoinfo")
}


RepoDetailsAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[RepoDetailsAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "issue-list",
                    transition: Mojo.Transition.crossFade
                }, this.username, this.repo)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "ref-list",
                    transition: Mojo.Transition.crossFade
                }, this.username, this.repo)
                break;
            case 'do-refresh':
                event.stopPropagation()
                this.refreshRepoinfo()
                break;
        }
    }
    Mojo.Log.info("[RepoDetailsAssistant] <== handleCommand")
}
