function RepoListAssistant(username){
    Mojo.Log.info("[RepoListAssistant] ==> Construct")
    this.username = username
	
	this.direction = "show"
    Mojo.Log.info("[RepoListAssistant] ==> Construct")
}

RepoListAssistant.prototype.setup = function(){
    Mojo.Log.info("[RepoListAssistant] ==> setup")
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    this.openRepo = this.openRepo.bind(this)
    
    
    /* --- Status widgets --- */
	$("load-spinner").hide()
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: false
    })
    
    
    /* --- Event Listener --- */
    Mojo.Event.listen($("content"), Mojo.Event.listTap, this.openRepo)
    
    
    /* --- App Widgets */
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
                label: "Repository List",
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
            visible:false
        }, {
            items: [{
                label: $L('Own'),
                command: 'cmd-showOwn',
            }, {
                label: $L('Watched'),
                command: 'cmd-showWatched',
            }],
            toggleCmd: "cmd-showOwn"
        }, {
            label: $L('Refresh'),
            icon: 'refresh',
            command: 'do-refresh'
        }]
    });
    
    
    /* --- UI widget --- */
    this.controller.setupWidget('content', {
        itemTemplate: 'repo-list/item-template',
        listTemplate: 'repo-list/list-template'
    }, this.listModel = new Repos(this.username));
	this.listModel.bindWatcher(function(){this.controller.modelChanged(this.listModel)}.bind(this))
	
    Mojo.Log.info("[RepoListAssistant] <== setup")
};

RepoListAssistant.prototype.activate = function(event){
    Mojo.Log.info("[RepoListAssistant] ==> activate")
	this.listModel.update({onComplete: function(x){
            Mojo.Log.info("[RepoListAssistant] === refreshUsers -> onComplete")
            $("load-spinner").mojo.stop()
            $("load-status").hide()
            $("content").show()
            Mojo.Log.info("[RepoListAssistant] === refreshUsers <- onComplete")
        },
        onCreate: function(x){
            Mojo.Log.info("[RepoListAssistant] === refreshUsers -> onCreate")
            $("content").hide()
            $("load-spinner").mojo.start()
            $("load-status").show()
            Mojo.Log.info("[RepoListAssistant] === refreshUsers <- onCreate")
        }})
    Mojo.Log.info("[RepoListAssistant] <== activate")
};

RepoListAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[RepoListAssistant] <=> deactive")
};

RepoListAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[RepoListAssistant] ==> cleanup")
    Mojo.Event.stopListening($("content"), Mojo.Event.listTap, this.openRepo)
    Mojo.Log.info("[RepoListAssistant] <== clean")
};

RepoListAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[RepoListAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "user-details",
                    transition: Mojo.Transition.crossFade
                }, this.username)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "activities-list",
                    transition: Mojo.Transition.crossFade
                }, this.username)
                break;
            case 'do-refresh':
                event.stopPropagation()
                this.listModel.refresh()
                break;
            case "cmd-showOwn":
                event.stopPropagation()
                this.listModel.setType('show')
                break;
            case "cmd-showWatched":
                event.stopPropagation()
                this.listModel.setType('watched')
                break;
        }
    }
    Mojo.Log.info("[RepoListAssistant] <== handleCommand")
}

RepoListAssistant.prototype.openRepo = function(event){
    Mojo.Log.info("[RepoListAssistant] ==> openRepo")
    Mojo.Controller.stageController.pushScene("repo-details", event.item.owner, event.item.name)
    Mojo.Log.info("[RepoListAssistant] <== openRepo")
}

