function RefListAssistant(depot, auth, user, repo){
    Mojo.Log.info("[RefListAssistant] ==> Construct")
    this.depot = depot
    this.auth = auth
    this.user = user
    this.repo = repo
    
    this.ref = "branches"
    Mojo.Log.info("[RefListAssistant] <== Construct")
}

RefListAssistant.prototype.setup = function(){
    Mojo.Log.info("[RefListAssistant] ==> setup")
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
        items: undefined,
        listTitle: "Ref List"
    });
    Mojo.Log.info("[RefListAssistant] <== setup")
};


RefListAssistant.prototype.refreshReflist = function(ref){
    Mojo.Log.info("[RefListAssistant] ==> refreshReflist")
    this.ref = ref
    
    Github.request("/repos/show/#{user}/#{repo}/#{ref}", {
        user: this.user,
        repo: this.repo,
        ref: ref
    }, {
        onSuccess: function(params,response){
            this.listModel.items = (response.responseJSON.branches == undefined) ? $H(response.responseJSON.tags).keys().collect(function(value){
                return {
                    name: value
                }
            }) : $H(response.responseJSON.branches).keys().collect(function(value){
                return {
                    name: value
                }
            })
			this.listModel.listTitle = ((params.ref == "branches") ? "Branches of #{user}/#{repo}" : "Tags of #{user}/#{repo}").interpolate(params)
            this.controller.modelChanged(this.listModel)
        }
.bind(this,{user:this.user,repo:this.repo,ref:ref})        ,
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
    })
	
    Mojo.Log.info("[RefListAssistant] <== refreshReflist")
}

RefListAssistant.prototype.openRef = function(event){
    Mojo.Log.info("[RefListAssistant] ==> openRef")
    Mojo.Controller.stageController.pushScene("commit-list", this.depot, this.auth, this.user, this.repo, event.item.name)
    Mojo.Log.info("[RefListAssistant] <== openRef")
}

RefListAssistant.prototype.activate = function(event){
    Mojo.Log.info("[RefListAssistant] ==> acitvate")
    if (this.listModel.items == undefined)
    this.refreshReflist(this.ref)
    Mojo.Log.info("[RefListAssistant] <== activate")
};

RefListAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[RefListAssistant] <=> deactivate")
};

RefListAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[RefListAssistant] <=> cleanup")
};

RefListAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[RefListAssistant] ==> handleCommand")
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
    Mojo.Log.info("[RefListAssistant] <== handleCommand")
}
