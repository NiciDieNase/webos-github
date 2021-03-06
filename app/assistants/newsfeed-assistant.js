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
var NewsfeedAssistant = Class.create(Assistant, {
    initialize: function($super){
        $super({
            scene: "newsfeed"
        })
        
        this.newsfeed = new Newsfeed(this, Github.auth.login)
		
        this.openEntry = this.openEntry.bind(this)
        this.handleCommand = this.handleCommand.bind(this)
    },
    
    setup: function($super){
        $super()
		
        /* --- UI widgets --- */
        this.controller.setupWidget('content', {
            itemTemplate: 'newsfeed/item-template',
            listTemplate: 'newsfeed/list-template',
            itemsProperty: 'entry',
            height: "auto"
        }, this.newsfeed);
        
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
    },
    
    cleanup: function($super, event){
        $super(event)
        Mojo.Event.stopListening($("content"), Mojo.Event.listTap, this.openEntry)
    },
    
    activate: function($super, event){
        $super(event)
        
        this.newsfeed.update({
            onComplete: function(x){
                $("load-spinner").mojo.stop()
                $("load-status").hide()
            },
            onCreate: function(x){
                $("load-spinner").mojo.start()
                $("load-status").show()
            }
        })
    },
    
    deactivate: function($super, event){
        $super(event)
    },
    
    handleCommand: function($super, event){
        $super(event)
        
        if (event.type == Mojo.Event.command) {
            switch (event.command) {
                case 'cmd-showProfile':
                    event.stopPropagation()
                    Mojo.Controller.stageController.pushScene({
                        name: "user",
                    }, Github.auth.login)
                    break;
                case 'do-refresh':
                    event.stopPropagation()
                    this.newsfeed.refresh()
                    break;
            }
        }
    },
    
    openEntry: function(event){
        Mojo.Controller.stageController.pushScene("feed-entry", event.item)
    }
})
