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

function CommitDetailsAssistant(user, repo, sha){
    Mojo.Log.info("[CommitDetailsAssistant] ==> Construct")
    this.user = user
    this.repo = repo
    this.sha = sha
    Mojo.Log.info("[CommitDetailsAssistant] <== Construct")
}

CommitDetailsAssistant.prototype.setup = function(){
    Mojo.Log.info("[CommitDetailsAssistant] ==> setup")
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    this.handleCommand = this.handleCommand.bind(this)
    this.updateMainModel = this.updateMainModel.bind(this)
    
    this.mainModel = new Commit(this.user, this.repo, this.sha)
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
                label: $L("Commit Details"),
                width: 320
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
    Mojo.Log.info("[CommitDetailsAssistant] <== setup")
};

CommitDetailsAssistant.prototype.updateMainModel = function(event){
    Mojo.Log.info("[CommitDetailsAssistant] ==> updateRepo ")
    $("details").update(Mojo.View.render({
        object: this.mainModel,
        template: "commit-details/details"
    }))
    
    Mojo.Log.info("[CommitDetailsAssistant] <== updateRepo")
    
    this.controller.get("load-status").hide()
};

CommitDetailsAssistant.prototype.activate = function(event){
    Mojo.Log.info("[CommitDetailsAssistant] ==> activate")
    StageAssistant.addAd(this.controller.get("admob"))
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
    Mojo.Log.info("[CommitDetailsAssistant] <== activate")
};

CommitDetailsAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[CommitDetailsAssistant] <=> deactivate")
};

CommitDetailsAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[CommitDetailsAssistant] <=> cleanup")
};

CommitDetailsAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[CommitDetailsAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'do-refresh':
                event.stopPropagation()
                this.mainModel.refresh()
                break;
        }
    }
    Mojo.Log.info("[CommitDetailsAssistant] <== handleCommand")
}
