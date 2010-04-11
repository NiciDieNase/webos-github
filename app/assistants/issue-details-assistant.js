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
    Mojo.Log.info("[IssueDetailsAssistant] <== Construct")
}

IssueDetailsAssistant.prototype.setup = function(){
    Mojo.Log.info("[IssueDetailsAssistant] <== setup")
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
	this.handleCommand = this.handleCommand.bind(this)
    this.updateMainModel = this.updateMainModel.bind(this)
    
    this.mainModel = new Issue(this.user, this.repo, this.number)
    this.mainModel.bindWatcher(function(){
        this.controller.modelChanged(this.mainModel)
    }
.bind(this))
    this.controller.watchModel(this.mainModel, this, this.updateMainModel)
    
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
    
    this.controller.setupWidget(Mojo.Menu.viewMenu, {
        spacerHeight: 00,
        menuClass: 'no-fade'
    }, {
        visible: true,
        items: [{
            items: [{
                icon: "back",
                command: 'back',
                label: $L("Back")
            }, {
                label: $L("Issue Details"),
                width: 200
            }, {
                icon: "forward",
                command: 'fwd',
                label: $L("Forward")
            }]
        }]
    });
    
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
    Mojo.Log.info("[IssueDetailsAssistant] <== setup")
    
    this.controller.get("load-status").hide()
};

IssueDetailsAssistant.prototype.updateMainModel = function(event){
    Mojo.Log.info("[IssueDetailsAssistant] ==> updateRepo ")
    $("details").update(Mojo.View.render({
        object: this.mainModel,
        template: "issue-details/details"
    }))
    
    Mojo.Log.info("[IssueDetailsAssistant] <== updateRepo")
};


IssueDetailsAssistant.prototype.activate = function(event){
    AdMob.ad.request({
        onSuccess: (function(ad){ // successful ad call, parameter 'ad' is the html markup for the ad
            $('admob').insert(ad); // place mark up in the the previously declared div
        }).bind(this),
        onFailure: (function(response){ 
        }).bind(this),
    });
    Mojo.Log.info("[IssueDetailsAssistant] ==> activate")
    this.mainModel.update({
        onCreate: function(){
            $("details").hide()
            $("load-spinner").mojo.start()
            $("load-status").show()
        },
        onComplete: function(){
            $("load-status").hide()
            $("details").show()
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
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "comment-list",
                    transition: Mojo.Transition.crossFade
                }, this.user, this.repo,this.number)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "comment-list",
                    transition: Mojo.Transition.crossFade
                }, this.user, this.repo,this.number)
                break;
            case 'do-refresh':
                event.stopPropagation()
                this.mainModel.refresh()
                break;
        }
    }
    Mojo.Log.info("[IssueDetailsAssistant] <== handleCommand")
}
