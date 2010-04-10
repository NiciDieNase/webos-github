function NewsfeedAssistant(){

}

NewsfeedAssistant.prototype.setup = function(){
    this.openEntry = this.openEntry.bind(this)
    this.handleCommand = this.handleCommand.bind(this)
    AdMob.ad.request({
        onSuccess: (function(ad){ // successful ad call, parameter 'ad' is the html markup for the ad
            $('admob').insert(ad); // place mark up in the the previously declared div
        }).bind(this),
        onFailure: (function(response){ 
          Mojo.Log.info("AdMob failed: "+response.responseText)
        }).bind(this),
    });
    
    
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
    }, this.listModel = new Newsfeed(Github.auth.login));
    this.listModel.bindWatcher(function(){
        this.controller.modelChanged(this.listModel)
    }
.bind(this))
    
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
            }]
        }, {
            label: $L('Refresh'),
            icon: 'refresh',
            command: 'do-refresh'
        }]
    });
    
    /* --- Event Listener --- */
    Mojo.Event.listen($("content"), Mojo.Event.listTap, this.openEntry)
    
    this.controller.get("load-status").hide()
    
};

NewsfeedAssistant.prototype.activate = function(event){
    
	
    this.listModel.update({
        onComplete: function(x){
            $("load-spinner").mojo.stop()
            $("load-status").hide()
            $("content").show()
        },
        onCreate: function(x){
            $("load-spinner").mojo.start()
            $("content").hide()
            $("load-status").show()
        }
    })
}


NewsfeedAssistant.prototype.activateold = function(event){
    Github.privateFeed({
        onSuccess: function(response){
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
            
            var Ausdruck = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})-(\d{2}):(\d{2})/;
            var result = Ausdruck.exec(response.responseATOM.feed.updated)
            var dateObj = new Date(result[1], parseInt(result[2]) - 1, result[3], parseInt(result[4]) + parseInt(result[7]), result[5], result[6])
            
            dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset())
            
            this.listModel.listTitle = Mojo.Format.formatDate(dateObj, {
                date: "long",
                time: "short"
            })
            
            this.controller.modelChanged(this.listModel)
            Mojo.Log.info("[NewsfeedAssistant] === activate <- onSuccess")
        }
.bind(this)        ,
        onCreate: function(){
            $("content").hide()
            $("load-status").show()
            $("load-spinner").mojo.start()
        },
        onComplete: function(){
            $("content").show()
            $("load-status").hide()
            $("load-spinner").mojo.stop()
        }
    })
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
            case 'cmd-showProfile':
                event.stopPropagation()
                Mojo.Controller.stageController.pushScene({
                    name: "user-details",
                }, Github.auth.login)
                break;
            case 'do-refresh':
                event.stopPropagation()
                this.listModel.refresh()
                break;
        }
    }
    Mojo.Log.info("[NewsfeedAssistant] <== handleCommand")
}
