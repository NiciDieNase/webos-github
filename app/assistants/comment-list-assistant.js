function CommentListAssistant(depot,auth,user,repo,number) {
    Mojo.Log.info("[CommentListAssistant] ==> Construct")
    this.depot = depot
    this.auth = auth
    this.user = user
    this.repo = repo
	this.number = number
    Mojo.Log.info("[CommentListAssistant] <== Construct")
}

CommentListAssistant.prototype.setup = function() {
    Mojo.Log.info("[CommentListAssistant] ==> setup")
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    this.handleCommand = this.handleCommand.bind(this)
    this.refreshCommentlist = this.refreshCommentlist.bind(this)
    
    
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
                label: "Comment List",
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
        itemTemplate: 'comment-list/item-template',
        listTemplate: 'comment-list/list-template'
    }, this.listModel = {
        items: [],
        listTitle: "Comments"
    });
    Mojo.Log.info("[CommentListAssistant] <== setup")
};

CommentListAssistant.prototype.refreshCommentlist = function(){
    Mojo.Log.info("[CommentListAssistant] ==> refreshCommentlist")
	
    Github.request("/issues/comments/#{user}/#{repo}/#{number}",{user:this.user,repo:this.repo,number:this.number}, {
        onSuccess: function(response){
            this.listModel.items = response.responseJSON.comments
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
    })
	
    Mojo.Log.info("[CommentListAssistant] <== refreshCommentlist")
}

CommentListAssistant.prototype.activate = function(event) {
    Mojo.Log.info("[CommentListAssistant] ==> activate")
	this.refreshCommentlist()
    Mojo.Log.info("[CommentListAssistant] <== activate")
};

CommentListAssistant.prototype.deactivate = function(event) {
    Mojo.Log.info("[CommentListAssistant] <=> deactivate")
};

CommentListAssistant.prototype.cleanup = function(event) {
    Mojo.Log.info("[CommentListAssistant] <=> cleanup")
};

CommentListAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[CommentListAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "issue-details",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.user, this.repo,this.number)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "issue-details",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.user, this.repo,this.number)
                break;
            case 'do-refresh':
                event.stopPropagation()
                this.refreshCommentlist()
                break;
        }
    }
    Mojo.Log.info("[CommentListAssistant] <== handleCommand")
}
