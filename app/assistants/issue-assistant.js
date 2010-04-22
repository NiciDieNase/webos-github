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
var IssueAssistant = Class.create(Assistant,{
    initialize: function($super,user, repo, number){
		$super({scene:"issue"})

        this.user = user
        this.repo = repo
        this.number = number
        
        this.comments = new Comments(this, user, repo, number)
        this.issue = new Issue(this, user, repo, number)
		
        this.handleCommand = this.handleCommand.bind(this)
        this.updateMainModel = this.updateMainModel.bind(this)
    },
    
    setup: function($super){
		$super()
        
        this.controller.watchModel(this.issue, this, this.updateMainModel)
        
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
        
        this.controller.setupWidget('comments', {
            itemTemplate: 'issue/comments/item-template',
            listTemplate: 'issue/comments/list-template'
        }, this.comments);
    },
    
    cleanup: function($super,event){
        $super(event)
		
		this.controller.removeWatcher(this,this.issue)
    },
    
    activate: function($super,event){
        $super(event)
        
        this.comments.update()
        this.issue.update({
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
    
    deactivate: function($super,event){
        $super(event)
    },
    
    handleCommand: function($super,event){
        $super(event)
		
        if (event.type == Mojo.Event.command) {
            switch (event.command) {
                case 'do-refresh':
                    event.stopPropagation()
                    this.issue.refresh()
                    break;
            }
        }
    },
    
    updateMainModel: function(event){
        $("details").update(Mojo.View.render({
            object: this.issue,
            template: "issue/details"
        }))
    },
})
