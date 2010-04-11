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
    Mojo.Log.info("[UserDetailsAssistant] <=== Construct")
}

UserDetailsAssistant.prototype.setup = function(){
    Mojo.Log.info("[UserDetailsAssistant] ==> setup")
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    this.updateInfo = this.updateInfo.bind(this)
    
    this.user = new User(this.username)
    
    this.user.bindWatcher(function(){
        this.controller.modelChanged(this.user)
    }
.bind(this))
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
    
    // Head Menu
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
                label: $L("User Details"),
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
    
    this.controller.get("load-status").hide()
    
    Mojo.Log.info("[UserDetailsAssistant] <== setup")
};

UserDetailsAssistant.prototype.activate = function(event){
    Mojo.Log.info("[UserDetailsAssistant] ==> activate")
	
    StageAssistant.addAd(this.controller.get("admob"))
	
    this.user.update({
        onCreate: function(){
            $("content").hide()
            $("load-spinner").mojo.start()
            $("load-status").show()
        },
        onComplete: function(){
            $("load-status").hide()
            $("content").show()
            $("load-spinner").mojo.stop()
        }
    })
    Mojo.Log.info("[UserDetailsAssistant] <== activate")
};

UserDetailsAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[UserDetailsAssistant] <=> deactivate")
};

UserDetailsAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[UserDetailsAssistant] <=> cleanup")
};

UserDetailsAssistant.prototype.updateInfo = function(event){
    Mojo.Log.info("[UserDetailsAssistant] ==> updateInfo " + this.user.name)
    $("content").update(Mojo.View.render({
        object: this.user,
        template: "user-details/details",
        formatters: {
            created_at: function(value, model){
                model.created_at = Mojo.Format.formatDate(new Date(value), {
                    date: 'medium'
                })
            },
        }
    }))
    
    Mojo.Log.info("[UserDetailsAssistant] <== updateInfo")
};


UserDetailsAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[UserDetailsAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
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
    }
    Mojo.Log.info("[UserDetailsAssistant] <== handleCommand")
}
