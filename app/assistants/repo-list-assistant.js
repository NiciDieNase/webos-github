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
    this.refreshRepos = this.refreshRepos.bind(this)
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
    }, this.listModel = {
        items: undefined,
        listTitle: "Repo List"
    });
    Mojo.Log.info("[RepoListAssistant] <== setup")
};

RepoListAssistant.prototype.activate = function(event){
    Mojo.Log.info("[RepoListAssistant] ==> activate")
    if (this.listModel.items == undefined)
	this.refreshRepos(this.direction)
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
                this.refreshRepos(this.direction)
                break;
            case "cmd-showOwn":
                event.stopPropagation()
                this.refreshRepos("show")
                break;
            case "cmd-showWatched":
                event.stopPropagation()
                this.refreshRepos("watched")
                break;
        }
    }
    Mojo.Log.info("[RepoListAssistant] <== handleCommand")
}

RepoListAssistant.prototype.refreshRepos = function(direction){
    Mojo.Log.info("[RepoListAssistant] ==> refreshRepos")
	this.direction = direction
	
	
    Github.request("/repos/#{direction}/#{user}",{
		direction: direction,
		user:this.username
	}, {
        onSuccess: function(params,response){
            this.listModel.items = response.responseJSON.repositories
			this.listModel.listTitle = ((params.direction == 'show') ? "#{user} Repos" : "Watched by #{user}").interpolate(params)
            this.controller.modelChanged(this.listModel)
        }.bind(this,{user:this.username,direction:direction}),
		onComplete: function (x) {
            $("load-spinner").mojo.stop()
            $("load-status").hide()
            $("content").show()
		},
		onCreate: function (x) {
            $("content").hide()
            $("load-spinner").mojo.start()
            $("load-status").show()
		},
    })
	
    Mojo.Log.info("[RepoListAssistant] <== refreshRepos")
}

RepoListAssistant.prototype.openRepo = function(event){
    Mojo.Log.info("[RepoListAssistant] ==> openRepo")
    Mojo.Controller.stageController.pushScene("repo-details", event.item.owner, event.item.name)
    Mojo.Log.info("[RepoListAssistant] <== openRepo")
}

