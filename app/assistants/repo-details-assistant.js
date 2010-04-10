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
    this.updateMainModel = this.updateMainModel.bind(this)
    
    this.mainModel = new Repository(this.username, this.repo)
    this.mainModel.bindWatcher(function(){
        this.controller.modelChanged(this.mainModel)
    }
.bind(this))
    this.controller.watchModel(this.mainModel, this, this.updateMainModel)
    
    $("load-status").hide()
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
    
    this.controller.get("load-status").hide()
    
    Mojo.Log.info("[RepoDetailsAssistant] <== setup")
};

RepoDetailsAssistant.prototype.updateMainModel = function(event){
    Mojo.Log.info("[RepoDetailsAssistant] ==> updateRepo ")
    $("details").update(Mojo.View.render({
        object: this.mainModel,
        template: "repo-details/details"
    }))
    
    Mojo.Log.info("[RepoDetailsAssistant] <== updateRepo")
};

RepoDetailsAssistant.prototype.activate = function(event){
    Mojo.Log.info("[RepoDetailsAssistant] ==> activate")
    this.mainModel.update({
        onCreate: function(){
            $("details").hide()
            $("load-spinner").mojo.start()
            $("load-status").show()
        },
        onComplete: function(){
            $("load-status").hide()
            $("details").show()
            $("load-spinner").mojo.stop()
        }
    })
    Mojo.Log.info("[RepoDetailsAssistant] <== activate")
};

RepoDetailsAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[RepoDetailsAssistant] <=> Construct")
};

RepoDetailsAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[RepoDetailsAssistant] <=> Construct")
};

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
                this.mainModel.refresh()
                break;
        }
    }
    Mojo.Log.info("[RepoDetailsAssistant] <== handleCommand")
}
