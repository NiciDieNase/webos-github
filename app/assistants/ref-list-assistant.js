function RefListAssistant(depot, auth, user, repo){
    /* this is the creator function for your scene assistant object. It will be passed all the 
     additional parameters (after the scene name) that were passed to pushScene. The reference
     to the scene controller (this.controller) has not be established yet, so any initialization
     that needs the scene controller should be done in the setup function below. */
    this.depot = depot
    this.auth = auth
    this.user = user
    this.repo = repo
    
    this.ref = "branches"
}

RefListAssistant.prototype.setup = function(){
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    this.handleCommand = this.handleCommand.bind(this)
    this.refreshReflist = this.refreshReflist.bind(this)
    this.openRef = this.openRef.bind(this)
    
    
    /* --- Status widgets --- */
    $("load-spinner").hide()
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: false
    })
    
    
    /* --- Event Listener --- */
    Mojo.Event.listen($("content"), Mojo.Event.listTap, this.openRef)
    
    
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
                label: "Ref List",
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
                label: $L('Branches'),
                command: 'cmd-showBranches',
            }, {
                label: $L('Tags'),
                command: 'cmd-showTags',
            }],
            toggleCmd: "cmd-showBranches"
        }, {
            label: $L('Refresh'),
            icon: 'refresh',
            command: 'do-refresh'
        }]
    });
    
    
    /* --- UI widgets --- */
    this.controller.setupWidget('content', {
        itemTemplate: 'ref-list/item-template',
        listTemplate: 'ref-list/list-template'
    }, this.listModel = {
        items: [],
        listTitle: "Ref List"
    });
};
RefListAssistant.prototype.refreshReflist = function(ref){
    this.ref = ref
    new Ajax.Request("https://github.com/api/v2/json/repos/show/" + this.user + "/" + this.repo + "/" + ref, {
        method: "post",
        evalJSON: "false",
        onSuccess: function(response){
            this.listModel.items = (response.responseJSON.branches == undefined) ? $H(response.responseJSON.tags).keys().collect(function(value){
                return {
                    name: value
                }
            }) : $H(response.responseJSON.branches).keys().collect(function(value){
                return {
                    name: value
                }
            })
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

RefListAssistant.prototype.openRef = function(event){
    Mojo.Controller.stageController.pushScene("commit-list", this.depot, this.auth, this.user, this.repo, event.item.name)
}

RefListAssistant.prototype.activate = function(event){
    this.refreshReflist(this.ref)
};

RefListAssistant.prototype.deactivate = function(event){
};

RefListAssistant.prototype.cleanup = function(event){
};
RefListAssistant.prototype.handleCommand = function(event){
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "repo-details",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.user, this.repo)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "issue-list",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.user, this.repo)
                break;
            case 'do-refresh':
                event.stopPropagation()
                this.refreshReflist(this.ref)
                break;
            case "cmd-showTags":
                event.stopPropagation()
                this.refreshReflist("tags")
                break;
            case "cmd-showBranches":
                event.stopPropagation()
                this.refreshReflist("branches")
                break;
        }
    }
}
