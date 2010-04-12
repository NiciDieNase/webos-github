/*
 * de.kingcrunch.github
 *
 * Copyright 2009 Sebastian "KingCrunch" Krebs <sebastian.krebs@kingcrunch.de>
 *
 * This file is part of "de.kingcrunch.gut".
 * "de.kingcrunch.github" is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * "crunch" is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License
 * along with "de.kingcrunch.github". If not, see <http://www.gnu.org/licenses/>.
 */
function UserDetailsAssistant(username){
    Mojo.Log.info("[UserDetailsAssistant] ==> Construct")
    
    
    this.username = username
    
    this.user = new User(this,username)
    this.followersList = new Followers(this,username)
    this.followingList = new Following(this, username)
    this.watchedRepositoriesList = new WatchedRepositories(this, username)
    this.ownRepositoriesList = new OwnRepositories(this, username)
    this.activitiesList = new Activities(this, username)
    
    this.updateInfo = this.updateInfo.bind(this)
    
    
    Mojo.Log.info("[UserDetailsAssistant] <=== Construct")
}

UserDetailsAssistant.prototype.setup = function(){
    Mojo.Log.info("[UserDetailsAssistant] ==> setup")
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    this.controller.watchModel(this.user, this, this.updateInfo)
    
    /* --- Main widgets --- */
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: false
    })
    
    // App Menu
    this.controller.setupWidget(Mojo.Menu.appMenu, {
        omitDefaultItems: true
    }, StageAssistant.appMenu);
    
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
    
    
    this.controller.setupWidget("activities-drawer", {
        modelProperty: 'open',
        unstyled: true
    }, {
        open: false
    });
    this.controller.setupWidget("own-repos-drawer", {
        modelProperty: 'open',
        unstyled: true
    }, {
        open: false
    });
    this.controller.setupWidget("watched-repos-drawer", {
        modelProperty: 'open',
        unstyled: true
    }, {
        open: false
    });
    
    this.controller.setupWidget("following-drawer", {
        modelProperty: 'open',
        unstyled: true
    }, {
        open: false
    });
    
    this.controller.setupWidget("followers-drawer", {
        modelProperty: 'open',
        unstyled: true
    }, {
        open: false
    });
    
    
    this.controller.setupWidget('activities-list', {
        itemTemplate: 'user-details/activities/item-template',
        listTemplate: 'user-details/activities/list-template'
    }, this.activitiesList);
    this.controller.setupWidget('own-repos-list', {
        itemTemplate: 'user-details/repositories/item-template',
        listTemplate: 'user-details/repositories/list-template'
    }, this.ownRepositoriesList);
    this.controller.setupWidget('watched-repos-list', {
        itemTemplate: 'user-details/repositories/item-template',
        listTemplate: 'user-details/repositories/list-template'
    }, this.watchedRepositoriesList);
    this.controller.setupWidget('following-list', {
        itemTemplate: 'user-details/social/item-template',
        listTemplate: 'user-details/social/list-template'
    }, this.followingList);
    this.controller.setupWidget('followers-list', {
        itemTemplate: 'user-details/social/item-template',
        listTemplate: 'user-details/social/list-template'
    }, this.followersList);
    
    
    Mojo.Event.listen($("activities-collapser"), Mojo.Event.tap, this.drawerTap.bind(this, this.activitiesList))
    Mojo.Event.listen($("own-repos-collapser"), Mojo.Event.tap, this.drawerTap.bind(this, this.ownRepositoriesList))
    Mojo.Event.listen($("watched-repos-collapser"), Mojo.Event.tap, this.drawerTap.bind(this, this.watchedRepositoriesList))
    Mojo.Event.listen($("following-collapser"), Mojo.Event.tap, this.drawerTap.bind(this, this.followingList))
    Mojo.Event.listen($("followers-collapser"), Mojo.Event.tap, this.drawerTap.bind(this, this.followersList))
    
    
    
    
    Mojo.Event.listen($("activities-list"), Mojo.Event.listTap, this.openActivity)
    Mojo.Event.listen($("watched-repos-list"), Mojo.Event.listTap, this.openRepo)
    Mojo.Event.listen($("own-repos-list"), Mojo.Event.listTap, this.openRepo)
    Mojo.Event.listen($("following-list"), Mojo.Event.listTap, this.openUser)
    Mojo.Event.listen($("followers-list"), Mojo.Event.listTap, this.openUser)
    
    this.controller.get("load-status").hide()
    
    this.controller.setupWidget("activities-spinner", this.attributes = {
        spinnerSize: "small"
    }, this.model = {
        spinning: false
    });
    Mojo.Log.info("[UserDetailsAssistant] <== setup")
};

UserDetailsAssistant.prototype.activate = function(event){
    Mojo.Log.info("[UserDetailsAssistant] ==> activate")
    
    
    StageAssistant.addAd(this.controller.get("admob"))
    
    this.user.update({
        onCreate: function(){
            $("load-spinner").mojo.start()
            $("load-status").show()
        },
        onComplete: function(){
            $("load-status").hide()
            $("load-spinner").mojo.stop()
        }
.bind(this)
    })
    Mojo.Log.info("[UserDetailsAssistant] <== activate")
};

UserDetailsAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[UserDetailsAssistant] <=> deactivate")
};

UserDetailsAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[UserDetailsAssistant] ==> cleanup")
    
    Mojo.Event.stopListening($("activities-collapser"), Mojo.Event.tap, this.drawerTap.bind(this, this.activitiesList))
    Mojo.Event.stopListening($("own-repos-collapser"), Mojo.Event.tap, this.drawerTap.bind(this, this.ownRepositoriesList))
    Mojo.Event.stopListening($("watched-repos-collapser"), Mojo.Event.tap, this.drawerTap.bind(this, this.watchedRepositoriesList))
    Mojo.Event.stopListening($("following-collapser"), Mojo.Event.tap, this.drawerTap.bind(this, this.followingList))
    Mojo.Event.stopListening($("followers-collapser"), Mojo.Event.tap, this.drawerTap.bind(this, this.followersList))
    
    Mojo.Event.stopListening($("activities-list"), Mojo.Event.listTap, this.openActivity)
    Mojo.Event.stopListening($("watched-repos-list"), Mojo.Event.listTap, this.openRepo)
    Mojo.Event.stopListening($("own-repos-list"), Mojo.Event.listTap, this.openRepo)
    Mojo.Event.stopListening($("following-list"), Mojo.Event.listTap, this.openUser)
    Mojo.Event.stopListening($("followers-list"), Mojo.Event.listTap, this.openUser)
    
    Mojo.Log.info("[UserDetailsAssistant] <== cleanup")
};

UserDetailsAssistant.prototype.updateInfo = function(event){
    Mojo.Log.info("[UserDetailsAssistant] ==> updateInfo " + this.user.name)
    $("content").update(Mojo.View.render({
        object: this.user,
        template: "user-details/details",
    }))
    
    Mojo.Log.info("[UserDetailsAssistant] <== updateInfo")
};

UserDetailsAssistant.prototype.aboutToActivate = function(event){
    Mojo.Log.info(Mojo.Log.propertiesAsString(event))
}


UserDetailsAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[UserDetailsAssistant] ==> handleCommand")
    switch (event.type) {
        case Mojo.Event.command:
            switch (event.command) {
                case 'back':
                    event.stopPropagation()
                    Mojo.Controller.stageController.swapScene({
                        name: "user-list",
                        transition: Mojo.Transition.crossFade
                    }, this.username)
                    break;
                case 'fwd':
                    event.stopPropagation()
                    Mojo.Controller.stageController.swapScene({
                        name: "repo-list",
                        transition: Mojo.Transition.crossFade
                    }, this.username)
                    break;
                case 'do-refresh':
                    event.stopPropagation()
                    this.user.refresh()
                    break;
            }
            break;
    }
    Mojo.Log.info("[UserDetailsAssistant] <== handleCommand")
}

UserDetailsAssistant.prototype.openRepo = function(event){
    Mojo.Log.info("[UserDetailsAssistant] ==> openRepo")
    Mojo.Controller.stageController.pushScene("repo-details", event.item.owner, event.item.name)
    Mojo.Log.info("[UserDetailsAssistant] <== openRepo")
}


UserDetailsAssistant.prototype.openUser = function(event){
    Mojo.Log.info("[UserListAssistant] ==> openUserinfo")
    Mojo.Controller.stageController.pushScene("user-details", event.item.name)
    Mojo.Log.info("[UserListAssistant] <== openUserinfo")
}


UserDetailsAssistant.prototype.openActivity = function(event){
    Mojo.Log.info("[ActivitiesListAssistant] ==> openEntry")
    Mojo.Controller.stageController.pushScene("activities-details", event.item)
    Mojo.Log.info("[ActivitiesListAssistant] <== openEntry")
}


UserDetailsAssistant.prototype.drawerTap = function(model, event){
    Mojo.Log.info("-->")
    Mojo.Log.info(Mojo.Log.propertiesAsString(model))
    if (event.srcElement.up("div[name=top]").down("div[name=drawer]").mojo.getOpenState()) {
        var top = event.srcElement.up("div[name=top]")
        top.down("div[name=drawer]").mojo.toggleState()
        top.down("div.arrow_button").removeClassName("palm-arrow-expanded")
        top.down("div.arrow_button").addClassName("palm-arrow-closed")
        model.items = []
        this.controller.modelChanged(model)
        
    }
    else {
        model.update({
            onCreate: function(event, model){
                var top = event.srcElement.up("div[name=top]")
                top.down("div[name=spinner]").mojo.start();
            }
.bind(this, event, model)            ,
            onComplete: function(event, model){
                var top = event.srcElement.up("div[name=top]")
                top.down("div[name=spinner]").mojo.stop()
                top.down("div[name=drawer]").mojo.toggleState()
                top.down("div[name=arrow]").removeClassName("palm-arrow-closed")
                top.down("div[name=arrow]").addClassName("palm-arrow-expanded")
            }
.bind(this, event, model)
        })
    }
    Mojo.Log.info("<--")
}

