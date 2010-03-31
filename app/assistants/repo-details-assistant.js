function RepoDetailsAssistant(depot, auth, username, repo){
    this.depot = depot
    this.auth = auth
    this.username = username
    this.repo = repo
}

RepoDetailsAssistant.prototype.setup = function(){
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
    
    
    /* --- Load --- */
};

RepoDetailsAssistant.prototype.activate = function(event){
	this.refreshRepoinfo()
};

RepoDetailsAssistant.prototype.deactivate = function(event){
};

RepoDetailsAssistant.prototype.cleanup = function(event){
};

RepoDetailsAssistant.prototype.refreshRepoinfo = function(){
    var request = new Ajax.Request("https://github.com/api/v2/json/repos/show/" + escape(this.username) + "/" + escape(this.repo), {
        method: "post",
        evalJSON: "false",
        onSuccess: function(response){
            var content = Mojo.View.render({
                object: response.responseJSON.repository,
                template: 'repo-details/details'
            })
            
            $("details").update(content)
        }.bind(this),
		onCreate: function (x) {
			$("load-spinner").mojo.start()
            $("details").hide()
            $("load-status").show()
		},
		onComplete: function (x) {
            $("load-status").hide()
            $("load-spinner").mojo.stop()
            $("details").show()
		},
        onFailure: StageAssistant.connectionError,
        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
    })
}


RepoDetailsAssistant.prototype.handleCommand = function(event){
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "issue-list",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username, this.repo)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "issue-list",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username, this.repo)
                break;
            case 'do-refresh':
                event.stopPropagation()
                this.refreshRepoinfo()
                break;
        }
    }
}
