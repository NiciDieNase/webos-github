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

function RepoDetailsAssistant(username, reponame){
    Mojo.Log.info("[RepoDetailsAssistant] ==> Construct")
    this.username = username
    this.reponame = reponame
	
	this.repo = new Repository(this,username,reponame)
	this.openIssues = new OpenIssues(this, username, reponame)
	this.closedIssues = new ClosedIssues (this, username, reponame)
	this.tags = new Tags(this,username,reponame)
	this.branches = new Branches(this,username,reponame)
	
	this.openIssue = this.openIssue.bind(this)
	this.openRef = this.openRef.bind(this)
    this.updateMainModel = this.updateMainModel.bind(this)
	
    Mojo.Log.info("[RepoDetailsAssistant] <== Construct")
}

RepoDetailsAssistant.prototype.setup = function(){
    Mojo.Log.info("[RepoDetailsAssistant] ==> setup")
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    
    this.controller.watchModel(this.repo, this, this.updateMainModel)
    
    $("load-status").hide()
    /* --- Status widgets --- */
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
	
	this.controller.setupWidget("open-issues-drawer", {
        modelProperty: 'open',
        unstyled: true
    }, {
        open: false
    });
    this.controller.setupWidget("closed-issues-drawer", {
        modelProperty: 'open',
        unstyled: true
    }, {
        open: false
    });
    this.controller.setupWidget("tags-drawer", {
        modelProperty: 'open',
        unstyled: true
    }, {
        open: false
    });
    this.controller.setupWidget("branches-drawer", {
        modelProperty: 'open',
        unstyled: true
    }, {
        open: false
    });
	
	
	this.controller.setupWidget('open-issues-list', {
        itemTemplate: 'repo-details/issues/item-template',
        listTemplate: 'repo-details/issues/list-template'
    }, this.openIssues);
    this.controller.setupWidget('closed-issues-list', {
        itemTemplate: 'repo-details/issues/item-template',
        listTemplate: 'repo-details/issues/list-template'
    }, this.closedIssues);
    this.controller.setupWidget('branches-list', {
        itemTemplate: 'repo-details/refs/item-template',
        listTemplate: 'repo-details/refs/list-template'
    }, this.branches);
    this.controller.setupWidget('tags-list', {
        itemTemplate: 'repo-details/refs/item-template',
        listTemplate: 'repo-details/refs/list-template'
    }, this.tags);
    
	
	
    Mojo.Event.listen($("open-issues-collapser"), Mojo.Event.tap, this.drawerTap.bind(this, this.openIssues))
    Mojo.Event.listen($("closed-issues-collapser"), Mojo.Event.tap, this.drawerTap.bind(this, this.closedIssues))
    Mojo.Event.listen($("branches-collapser"), Mojo.Event.tap, this.drawerTap.bind(this, this.branches))
    Mojo.Event.listen($("tags-collapser"), Mojo.Event.tap, this.drawerTap.bind(this, this.tags))
	
	
    Mojo.Event.listen($("open-issues-list"), Mojo.Event.listTap, this.openIssue)
    Mojo.Event.listen($("closed-issues-list"), Mojo.Event.listTap, this.openIssue)
    Mojo.Event.listen($("branches-list"), Mojo.Event.listTap, this.openRef)
    Mojo.Event.listen($("tags-list"), Mojo.Event.listTap, this.openRef)
	
    this.controller.get("load-status").hide()
    
    Mojo.Log.info("[RepoDetailsAssistant] <== setup")
};

RepoDetailsAssistant.prototype.updateMainModel = function(event){
    Mojo.Log.info("[RepoDetailsAssistant] ==> updateRepo ")
    $("content").update(Mojo.View.render({
        object: this.repo,
        template: "repo-details/details"
    }))
    
    Mojo.Log.info("[RepoDetailsAssistant] <== updateRepo")
};

RepoDetailsAssistant.prototype.activate = function(event){
    Mojo.Log.info("[RepoDetailsAssistant] ==> activate")
	
    StageAssistant.addAd(this.controller.get("admob"))
	
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
    Mojo.Log.info("[RepoDetailsAssistant] <== activate")
};

RepoDetailsAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[RepoDetailsAssistant] <=> Construct")
};

RepoDetailsAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[RepoDetailsAssistant] <=> Construct")
};

RepoDetailsAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[RepoDetailsAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'do-refresh':
                event.stopPropagation()
                this.mainModel.refresh()
                break;
        }
    }
    Mojo.Log.info("[RepoDetailsAssistant] <== handleCommand")
}

RepoDetailsAssistant.prototype.drawerTap = function(model, event){
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

RepoDetailsAssistant.prototype.openIssue = function(event){
    Mojo.Log.info("[IssueListAssistant] ==> openIssue")
	Mojo.Log.info(Mojo.Log.propertiesAsString(event.item))
    Mojo.Controller.stageController.pushScene("issue-details", event.item.user, this.reponame, event.item.number)
    Mojo.Log.info("[IssueListAssistant] <== openIssue")
}

RepoDetailsAssistant.prototype.openRef = function(event){
    Mojo.Log.info("[RefListAssistant] ==> openRef")
    Mojo.Log.info(Mojo.Log.propertiesAsString(event.item))
    Mojo.Controller.stageController.pushScene("commit-details", this.username, this.reponame, event.item.commit)
    Mojo.Log.info("[RefListAssistant] <== openRef")
}


