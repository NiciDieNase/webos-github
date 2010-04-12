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

function IssueDetailsAssistant(user, repo, number){
    Mojo.Log.info("[IssueDetailsAssistant] ==> Construct")
    this.user = user
    this.repo = repo
    this.number = number
	
	this.comments = new Comments (this,user,repo,number)
    this.issue = new Issue(this,user, repo, number)
	
    Mojo.Log.info("[IssueDetailsAssistant] <== Construct")
}

IssueDetailsAssistant.prototype.setup = function(){
    Mojo.Log.info("[IssueDetailsAssistant] <== setup")
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
	this.handleCommand = this.handleCommand.bind(this)
    this.updateMainModel = this.updateMainModel.bind(this)
    
    this.controller.watchModel(this.issue, this, this.updateMainModel)
    
    /* --- Status widgets --- */
    $("load-status").hide()
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: true
    })
    
    
    /* --- App widgets --- */
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
	
	this.controller.setupWidget('comments', {
        itemTemplate: 'issue-details/comments/item-template',
        listTemplate: 'issue-details/comments/list-template'
    }, this.comments);
	
    Mojo.Log.info("[IssueDetailsAssistant] <== setup")
    
    this.controller.get("load-status").hide()
};

IssueDetailsAssistant.prototype.updateMainModel = function(event){
    Mojo.Log.info("[IssueDetailsAssistant] ==> updateRepo ")
    $("details").update(Mojo.View.render({
        object: this.issue,
        template: "issue-details/details"
    }))
    
    Mojo.Log.info("[IssueDetailsAssistant] <== updateRepo")
};


IssueDetailsAssistant.prototype.activate = function(event){
    Mojo.Log.info("[IssueDetailsAssistant] ==> activate")
	
    StageAssistant.addAd(this.controller.get("admob"))

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
    Mojo.Log.info("[IssueDetailsAssistant] <== activate")
};

IssueDetailsAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[IssueDetailsAssistant] <=> deactivate")
};

IssueDetailsAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[IssueDetailsAssistant] <=> cleanup")
};

IssueDetailsAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[IssueDetailsAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'do-refresh':
                event.stopPropagation()
                this.issue.refresh()
                break;
        }
    }
    Mojo.Log.info("[IssueDetailsAssistant] <== handleCommand")
}
