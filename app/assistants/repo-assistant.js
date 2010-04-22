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
var RepoAssistant = Class.create(Assistant, {
    initialize: function($super, owner, name){
        this.owner = owner
        this.name = name
        
        $super({
            scene: "repo",
            lists: [{
                model: new OpenIssues(this, owner, name),
                name: "open-issues",
                template: "issues",
                targetScene: "issue"
            }, {
                model: new ClosedIssues(this, owner, name),
                name: "closed-issues",
                template: "issues",
                targetScene: "issue"
            }, {
                model: new Tags(this, owner, name),
                name: "tags",
                template: "refs",
                targetScene: "commit"
            }, {
                model: new Branches(this, owner, name),
                name: "branches",
                template: "refs",
                targetScene: "commit"
            }]
        })
        
        this.repo = new Repository(this, owner, name)
        
        this.updateMainModel = this.updateMainModel.bind(this)
        this.openDetail = this.openDetail.bind(this)
    },
    
    setup: function($super){
        $super()
        $("content").update(Mojo.View.render({
            object: {},
            template: "repo/details"
        }))
        Mojo.Event.listen(this.controller.get("content"), Mojo.Event.tap, this.openDetail)
        
        this.controller.watchModel(this.repo, this, this.updateMainModel)
        
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
        
        
    },
    
    cleanup: function($super, event){
        $super(event)
        
        this.controller.removeWatcher(this, this.model)
        Mojo.Event.stopListening(this.controller.get("content"), Mojo.Event.tap, this.openDetail)
    },
    
    activate: function($super, event){
        $super(event)
        
        this.repo.update({
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
        
        if (event.type == Mojo.Event.command) {
            switch (event.command) {
                case 'do-refresh':
                    event.stopPropagation()
                    this.mainModel.refresh()
                    break;
            }
        }
    },
    
    updateMainModel: function(event){
        $("content").update(Mojo.View.render({
            object: this.repo,
            template: "repo/details"
        }))
    },
    
    openItem: function($super, event){
        $super(event)
        
        $A(this.lists).each(function(item){
            if (item.model == this.event.model) {
                switch (item.name) {
                    case "open-issues":
                    case "closed-issues":
                        Mojo.Controller.stageController.pushScene(item.targetScene, this.event.item.user, this.assistant.name, this.event.item.number)
                        break;
                    case "tags":
                    case "branches":
                        Mojo.Controller.stageController.pushScene(item.targetScene, this.assistant.owner, this.assistant.name, this.event.item.commit)
                        break;
                }
                throw $break;
            }
        }, {
            event: event,
            assistant: this
        })
    },
    
    openDetail: function(event){
//        Mojo.Log.info("openOwner")
//        Mojo.Log.info(Mojo.Log.propertiesAsString(event.target.up(".palm-row")))
		row = event.target.up(".palm-row")
        switch (row.id) {
            case 'owner-row':
                title = row.down(".title")
//        Mojo.Log.info(Mojo.Log.propertiesAsString(title))
				Mojo.Controller.stageController.pushScene("user",title.innerText)
                break;
        }
    }
})
