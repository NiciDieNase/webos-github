function CommitListAssistant(depot,auth,user,repo,ref) {
	this.depot = depot
	this.auth = auth
	this.user = user
	this.repo = repo
	this.ref = ref
}

CommitListAssistant.prototype.setup = function() {
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    this.handleCommand = this.handleCommand.bind(this)
    this.refreshCommizlist = this.refreshCommitlist.bind(this)
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
                icon: "back",
                command: 'back',
                label: "Back"
            }, {
                label: "Commit List",
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
        },{
            label: $L('Refresh'),
            icon: 'refresh',
            command: 'do-refresh'
        }]
    });
    
    
    /* --- UI widgets --- */
    this.controller.setupWidget('content', {
        itemTemplate: 'commit-list/item-template',
        listTemplate: 'commit-list/list-template'
    }, this.listModel = {
        items: [],
        listTitle: "Commit List"
    });
};

CommitListAssistant.prototype.activate = function(event) {
	this.refreshCommitlist()
};

CommitListAssistant.prototype.deactivate = function(event) {
};

CommitListAssistant.prototype.cleanup = function(event) {
    Mojo.Event.stopListening($("content"), Mojo.Event.listTap, this.openCommit)
};

CommitListAssistant.prototype.openCommit = function(event){
    Mojo.Controller.stageController.pushScene("commit-details", this.depot, this.auth, this.user, this.repo, event.item.id)
}

CommitListAssistant.prototype.refreshCommitlist = function(){
    new Ajax.Request("https://github.com/api/v2/json/commits/list/" + this.user + "/" + this.repo + "/" + this.ref, {
        method: "post",
        evalJSON: "false",
        onSuccess: function(response){
            this.listModel.items = response.responseJSON.commits
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

CommitListAssistant.prototype.handleCommand = function(event){
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "commit-list",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.user, this.repo, this.ref)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "commit-list",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.user, this.repo,this.ref)
                break;
            case 'do-refresh':
                event.stopPropagation()
                this.refreshCommitlist()
                break;
        }
    }
}
