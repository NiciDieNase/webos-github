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

function RefListAssistant(user, repo){
    Mojo.Log.info("[RefListAssistant] ==> Construct")
    this.user = user
    this.repo = repo
    
    this.ref = "branches"
    Mojo.Log.info("[RefListAssistant] <== Construct")
}

RefListAssistant.prototype.setup = function(){
    Mojo.Log.info("[RefListAssistant] ==> setup")
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    this.handleCommand = this.handleCommand.bind(this)
    this.openRef = this.openRef.bind(this)
    
    
    /* --- Status widgets --- */
    $("load-spinner").hide()
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: false
    })
    
    
    /* --- Event Listener --- */
    Mojo.Event.listen($("content"), Mojo.Event.listTap, this.openRef)
    
    
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
                label: "Ref List",
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
                label: $L('Branches'),
                command: 'cmd-showBranches',
            }, {
                label: $L('Tags'),
                command: 'cmd-showTags',
            }],
            toggleCmd: "cmd-showBranches"
        }, {
            label: $L('Refresh'),
            icon: 'refresh',
            command: 'do-refresh'
        }]
    });
    
    
    /* --- UI widgets --- */
    this.controller.setupWidget('content', {
        itemTemplate: 'ref-list/item-template',
        listTemplate: 'ref-list/list-template'
    }, this.listModel = new Refs(this.user,this.repo));
	this.listModel.bindWatcher(function(){this.controller.modelChanged(this.listModel)}.bind(this))
    
    this.controller.get("load-status").hide()
	
    Mojo.Log.info("[RefListAssistant] <== setup")
};

RefListAssistant.prototype.openRef = function(event){
    Mojo.Log.info("[RefListAssistant] ==> openRef")
	Mojo.Log.info(Mojo.Log.propertiesAsString(event.item))
    Mojo.Controller.stageController.pushScene("commit-list", this.user, this.repo, event.item.name)
    Mojo.Log.info("[RefListAssistant] <== openRef")
}

RefListAssistant.prototype.activate = function(event){
    Mojo.Log.info("[RefListAssistant] ==> acitvate")
	
    StageAssistant.addAd(this.controller.get("admob"))
	
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
    Mojo.Log.info("[RefListAssistant] <== activate")
};

RefListAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[RefListAssistant] <=> deactivate")
};

RefListAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[RefListAssistant] <=> cleanup")
};

RefListAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[RefListAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "repo-details",
                    transition: Mojo.Transition.crossFade
                }, this.user, this.repo)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "issue-list",
                    transition: Mojo.Transition.crossFade
                }, this.user, this.repo)
                break;
            case 'do-refresh':
                event.stopPropagation()
                this.listModel.refresh()
                break;
            case "cmd-showTags":
                event.stopPropagation()
                this.listModel.setType("tags")
                break;
            case "cmd-showBranches":
                event.stopPropagation()
                this.listModel.setType("branches")
                break;
        }
    }
    Mojo.Log.info("[RefListAssistant] <== handleCommand")
}
