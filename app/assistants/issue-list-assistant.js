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

function IssueListAssistant(user, repo){
    Mojo.Log.info("[IssueListAssistant] ==> Construct")
    this.user = user
    this.repo = repo
    
    this.state = "open"
    Mojo.Log.info("[IssueListAssistant] <== Construct")
}

IssueListAssistant.prototype.setup = function(){
    Mojo.Log.info("[IssueListAssistant] ==> setup")
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    this.handleCommand = this.handleCommand.bind(this)
    this.openIssue = this.openIssue.bind(this)
    
    
    /* --- Status widgets --- */
    $("load-spinner").hide()
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: false
    })
    
    
    /* --- Event Listener --- */
    Mojo.Event.listen($("content"), Mojo.Event.listTap, this.openIssue)
    
    
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
                label: "Issue List",
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
        }, {
            items: [{
                label: $L('Open'),
                command: 'cmd-showOpen',
            }, {
                label: $L('Closed'),
                command: 'cmd-showClosed',
            }],
            toggleCmd: "cmd-showOpen"
        }, {
            label: $L('Refresh'),
            icon: 'refresh',
            command: 'do-refresh'
        }]
    });
    
    
    /* --- UI widgets --- */
    this.controller.setupWidget('content', {
        itemTemplate: 'issue-list/item-template',
        listTemplate: 'issue-list/list-template'
    }, this.listModel = new Issues(this.user,this.repo));
	this.listModel.bindWatcher(function(){this.controller.modelChanged(this.listModel)}.bind(this))
	
    Mojo.Log.info("[IssueListAssistant] <== setup")
    
    this.controller.get("load-status").hide()
};


IssueListAssistant.prototype.refreshIssuelist = function(state){
    Mojo.Log.info("[IssueListAssistant] ==> refreshIssuelist")
    this.state = state
    Github.request("/issues/list/#{user}/#{repo}/#{state}", {
        user: this.user,
        repo: this.repo,
        state: state
    }, {
        onSuccess: function(params,response){
            this.listModel.items = response.responseJSON.issues
			this.listModel.listTitle = "#{state} Issues for #{user}/#{repo}".interpolate(params)
            this.controller.modelChanged(this.listModel)
        }
.bind(this,{user:this.user,repo:this.repo,state:this.state})        ,
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
    
    Mojo.Log.info("[IssueListAssistant] <== refreshIssuelist")
}

IssueListAssistant.prototype.openIssue = function(event){
    Mojo.Log.info("[IssueListAssistant] ==> openIssue")
    Mojo.Controller.stageController.pushScene("issue-details", this.user, this.repo, event.item.number)
    Mojo.Log.info("[IssueListAssistant] <== openIssue")
}

IssueListAssistant.prototype.activate = function(event){
    AdMob.ad.request({
        onSuccess: (function(ad){ // successful ad call, parameter 'ad' is the html markup for the ad
            $('admob').insert(ad); // place mark up in the the previously declared div
        }).bind(this),
        onFailure: (function(response){ 
        }).bind(this),
    });
    Mojo.Log.info("[IssueListAssistant] ==> activate")
    this.listModel.update({onComplete: function(x){
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
    Mojo.Log.info("[IssueListAssistant] <== activate")
};

IssueListAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[IssueListAssistant] <=> deactivate")
};

IssueListAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[IssueListAssistant] ==> clean")
    Mojo.Event.stopListening($("content"), Mojo.Event.listTap, this.openIssue)
    Mojo.Log.info("[IssueListAssistant] <== cleanup")
};

IssueListAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[IssueListAssistant] ==> handleCommand")
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
            case 'do-refresh':
                event.stopPropagation()
                this.refresh()
                break;
            case "cmd-showOpen":
                event.stopPropagation()
                this.listModel.setType("open")
                break;
            case "cmd-showClosed":
                event.stopPropagation()
                this.listModel.setType("closed")
                break;
        }
    }
    Mojo.Log.info("[IssueListAssistant] <== handleCommand")
}

