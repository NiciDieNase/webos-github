function CommitListAssistant(user, repo, ref){
    Mojo.Log.info("[CommitListAssistant] ==> Construct")
    this.user = user
    this.repo = repo
    this.ref = ref
    Mojo.Log.info("[CommitListAssistant] <== Construct")
}

CommitListAssistant.prototype.setup = function(){
    Mojo.Log.info("[CommitListAssistant] ==> setup")
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    this.handleCommand = this.handleCommand.bind(this)
    this.openCommit = this.openCommit.bind(this)
    
    
    Mojo.Event.listen($("content"), Mojo.Event.listTap, this.openCommit)
    
    
    /* --- Status widgets --- */
    $("load-spinner").hide()
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: false
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
                label: "Commit List",
                width: 320
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
    
    
    /* --- UI widgets --- */
    this.controller.setupWidget('content', {
        itemTemplate: 'commit-list/item-template',
        listTemplate: 'commit-list/list-template'
    }, this.listModel = new Commits(this.user,this.repo,this.ref));
	this.listModel.bindWatcher(function(){this.controller.modelChanged(this.listModel)}.bind(this))
    Mojo.Log.info("[CommitListAssistant] <== setup")
};

CommitListAssistant.prototype.activate = function(event){
    Mojo.Log.info("[CommitListAssistant] ==> activate")
    this.listModel.update({onComplete: function(x){
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
    Mojo.Log.info("[CommitListAssistant] <== activate")
};

CommitListAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[CommitListAssistant] <=> deactivate")
};

CommitListAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[CommitListAssistant] ==> cleanup")
    Mojo.Event.stopListening($("content"), Mojo.Event.listTap, this.openCommit)
    Mojo.Log.info("[CommitListAssistant] <== cleanup")
};

CommitListAssistant.prototype.openCommit = function(event){
    Mojo.Log.info("[CommitListAssistant] ==> openCommit")
    Mojo.Controller.stageController.pushScene("commit-details", this.user, this.repo, event.item.id)
    Mojo.Log.info("[CommitListAssistant] <== openCommit")
}

CommitListAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[CommitListAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'do-refresh':
                event.stopPropagation()
                this.listModel.refresh()
                break;
        }
    }
    Mojo.Log.info("[CommitListAssistant] <== handleCommand")
}
