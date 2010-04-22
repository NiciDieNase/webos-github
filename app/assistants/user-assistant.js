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
var UserAssistant = Class.create(Assistant, {
    initialize: function($super, name){
        this.name = name
		
        $super({
            lists: [{
                model: new Followers(this, name),
                name: "followers",
                template: "social",
                targetScene: "user"
            }, {
                model: new Following(this, name),
                name: "following",
                template: "social",
                targetScene: "user"
            }, {
                model: new WatchedRepositories(this, name),
                name: "watched-repos",
                template: "repositories",
                targetScene: "repo"
            }, {
                model: new OwnRepositories(this, name),
                name: "own-repos",
                template: "repositories",
                targetScene: "repo"
            }, {
                model: new Activities(this, name),
                name: "activities",
                template: "activities",
                itemsProperty: "entry",
                targetScene: "feed-entry"
            }],
            scene: "user"
        })
        
        this.user = new User(this, name)
        
        this.updateInfo = this.updateInfo.bind(this)
    },
    
    setup: function($super){
        $super()
        
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
		
        this.controller.watchModel(this.user, this, this.updateInfo)
    },
    
    cleanup: function($super, event){
        $super(event)
		this.controller.removeWatcher(this,this.user)
    },
    
    activate: function($super, event){
        $super(event)
        
        this.user.update({
            onCreate: function(){
                $("load-spinner").mojo.start()
                $("load-status").show()
            },
            onComplete: function(){
                $("load-status").hide()
                $("load-spinner").mojo.stop()
            }
        })
    },
    
    deactivate: function($super, event){
        $super(event)
    },
    
    handleCommand: function($super, event){
        $super(event)
		
        switch (event.type) {
            case Mojo.Event.command:
                switch (event.command) {
                    case 'do-refresh':
                        event.stopPropagation()
                        this.user.refresh()
                        break;
                }
                break;
        }
    },
    
    updateInfo: function(event){
        $("content").update(Mojo.View.render({
            object: this.user,
            template: "user/details",
        }))
    },
    
    aboutToActivate: function(event){
		// Currently demo ^^
    },
    
    openItem: function($super, event){
        $super(event)
        $A(this.lists).each(function(item){
            if (item.model == this.event.model) {
                switch (item.name) {
                    case "watched-repos":
                    case "own-repos":
                        Mojo.Controller.stageController.pushScene(item.targetScene, this.event.item.owner,this.event.item.name)
                        break;
                    case "followers":
                    case "following":
                        Mojo.Controller.stageController.pushScene(item.targetScene, this.event.item.name)
                        break;
                    case "activities":
                        Mojo.Controller.stageController.pushScene(item.targetScene, this.event.item)
						break;
                }
                throw $break;
            }
        }, {
			event: event,
			assistant: this
		})
    }
})
