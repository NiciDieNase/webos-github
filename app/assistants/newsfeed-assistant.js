function NewsfeedAssistant(){

}

NewsfeedAssistant.prototype.setup = function(){
    this.openEntry = this.openEntry.bind(this)
    this.handleCommand = this.handleCommand.bind(this)
    
    
    /* --- Status widgets --- */
    $("load-spinner").hide()
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: false
    })
    
    /* --- Status widgets --- */
    this.listModel = []
    /* --- UI widgets --- */
    this.controller.setupWidget('content', {
        itemTemplate: 'newsfeed/item-template',
        listTemplate: 'newsfeed/list-template',
        height: "auto"
    }, this.listModel = {
        items: [],
        listTitle: "",
        info: {}
    });
    /* --- App widgets --- */
    this.controller.setupWidget(Mojo.Menu.appMenu, {
        omitDefaultItems: true
    }, StageAssistant.appMenu);
    
    this.controller.setupWidget(Mojo.Menu.viewMenu, {
        spacerHeight: 00,
    }, {
        visible: true,
        items: [{
            items: [{
                label: "Newsfeed",
                width: 320
            }]
        }]
    });
    
    this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, {
        visible: true,
        items: [{
            visible: false
        }, {
            items: [{
                label: $L('Profile'),
                command: 'cmd-showProfile',
            }, {
                label: $L('Search'),
                command: 'cmd-showSearch',
            }]
        }, {
            label: $L('Refresh'),
            icon: 'refresh',
            command: 'do-refresh'
        }]
    });
    
    
    /* --- Event Listener --- */
    Mojo.Event.listen($("content"), Mojo.Event.listTap, this.openEntry)
    
};

NewsfeedAssistant.prototype.activate = function(event){
    $("content").hide()
    $("load-status").show()
    $("load-spinner").mojo.start()
    Github.privateFeed(function(response){
        Mojo.Log.info("[NewsfeedAssistant] === activate -> onSuccess")
        //        $("debug").update(dump(response.responseATOM.feed.entry[0][1].updated))
        this.listModel.items = $H(response.responseATOM.feed.entry).collect(function(value){
            var Ausdruck = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})-(\d{2}):(\d{2})/;
            var result = Ausdruck.exec(value[1].updated)
            var dateObj = new Date(result[1], parseInt(result[2]) - 1, result[3], parseInt(result[4]) + parseInt(result[7]), result[5], result[6])
            
            dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset())
            
            value[1].updated = Mojo.Format.formatDate(dateObj, {
                date: "long",
                time: "short"
            })
			
			value[1].link = value[1].attribute_link_href
            return value[1]
        })
        this.controller.modelChanged(this.listModel)
        $("content").show()
        $("load-status").hide()
        $("load-spinner").mojo.stop()
        Mojo.Log.info("[NewsfeedAssistant] === activate <- onSuccess")
    }
.bind(this))
};

NewsfeedAssistant.prototype.deactivate = function(event){
};

NewsfeedAssistant.prototype.cleanup = function(event){
    Mojo.Event.stopListening($("content"), Mojo.Event.listTap, this.openEntry)
};


NewsfeedAssistant.prototype.openEntry = function(event){
    Mojo.Log.info("[NewsfeedAssistant] ==> openEntry")
    Mojo.Controller.stageController.pushScene("newsfeed-details", event.item)
    Mojo.Log.info("[NewsfeedAssistant] <== openEntry")
}

NewsfeedAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[NewsfeedAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "ref-list",
                    transition: Mojo.Transition.crossFade
                }, this.user, this.repo)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "repo-details",
                    transition: Mojo.Transition.crossFade
                }, this.user, this.repo)
                break;
            case "cmd-showProfile":
                event.stopPropagation()
                Mojo.Controller.stageController.pushScene("user-details", Github.auth.login)
                break;
            case 'do-refresh':
                event.stopPropagation()
                this.refreshIssuelist(this.state)
                break;
            case "cmd-showOpen":
                event.stopPropagation()
                this.refreshIssuelist("open")
                break;
            case "cmd-showClosed":
                event.stopPropagation()
                this.refreshIssuelist("closed")
                break;
        }
    }
    Mojo.Log.info("[NewsfeedAssistant] <== handleCommand")
}
