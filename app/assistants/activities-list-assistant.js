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

function ActivitiesListAssistant(user) {
	this.user = user
}

ActivitiesListAssistant.prototype.setup = function() {
    AdMob.ad.request({
        onSuccess: (function(ad){ // successful ad call, parameter 'ad' is the html markup for the ad
            $('admob').insert(ad); // place mark up in the the previously declared div
        }).bind(this),
        onFailure: (function(response){ 
          Mojo.Log.info("AdMob failed: "+response.responseText)
        }).bind(this),
    });
    this.openEntry = this.openEntry.bind(this)
    this.handleCommand = this.handleCommand.bind(this)
    
    
    /* --- Status widgets --- */
    $("load-spinner").hide()
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: false
    })
    
    /* --- Status widgets --- */
    this.listModel = []
    /* --- UI widgets --- */
    this.controller.setupWidget('content', {
        itemTemplate: 'activities-list/item-template',
        listTemplate: 'activities-list/list-template',
        height: "auto"
    }, this.listModel = new Activities(this.user));
	this.listModel.bindWatcher(function(){this.controller.modelChanged(this.listModel)}.bind(this))
	
	
    /* --- App widgets --- */
    this.controller.setupWidget(Mojo.Menu.appMenu, {
        omitDefaultItems: true
    }, StageAssistant.appMenu);
    
    this.controller.setupWidget(Mojo.Menu.viewMenu, {
        spacerHeight: 00,
    }, {
        visible: true,
        items: [{
            items: [{
                icon: "back",
                command: 'back',
                label: "Back"
            }, {
                label: "Activities",
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
            label: $L('Refresh'),
            icon: 'refresh',
            command: 'do-refresh'
        }]
    });
    
    
    /* --- Event Listener --- */
    Mojo.Event.listen($("content"), Mojo.Event.listTap, this.openEntry)
	
	this.controller.get("load-status").hide()
};

ActivitiesListAssistant.prototype.activate = function(event){
    this.listModel.update({
        onComplete: function(x){
            $("load-spinner").mojo.stop()
            $("load-status").hide()
            $("content").show()
        },
        onCreate: function(x){
            $("load-spinner").mojo.start()
            $("content").hide()
            $("load-status").show()
        }
    })
}


ActivitiesListAssistant.prototype.activateold = function(event) {
    Github.activitiesFeed({user:this.user},{
        onSuccess: function(response){
            Mojo.Log.info("[ActivitiesListAssistant] === activate -> onSuccess")
            //        $("debug").update(dump(response.responseATOM.feed.entry[0][1].updated))
            this.listModel.items = $H(response.responseATOM.feed.entry).collect(function(value){
                var Ausdruck = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})-(\d{2}):(\d{2})/;
                var result = Ausdruck.exec(value[1].updated)
                var dateObj = new Date(result[1], parseInt(result[2]) - 1, result[3], parseInt(result[4]) + parseInt(result[7]), result[5], result[6])
                
                dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset())
                
                value[1].updated = Mojo.Format.formatDate(dateObj, {
                    date: "long",
                    time: "short"
                })
                
                value[1].link = value[1].attribute_link_href
                return value[1]
            })
            
            var Ausdruck = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})-(\d{2}):(\d{2})/;
            var result = Ausdruck.exec(response.responseATOM.feed.updated)
            var dateObj = new Date(result[1], parseInt(result[2]) - 1, result[3], parseInt(result[4]) + parseInt(result[7]), result[5], result[6])
            
            dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset())
            
            this.listModel.listTitle = Mojo.Format.formatDate(dateObj, {
                date: "long",
                time: "short"
            })
            
            this.controller.modelChanged(this.listModel)
            Mojo.Log.info("[ActivitiesListAssistant] === activate <- onSuccess")
        }
.bind(this)        ,
        onCreate: function(){
            $("content").hide()
            $("load-status").show()
            $("load-spinner").mojo.start()
        },
        onComplete: function(){
            $("content").show()
            $("load-status").hide()
            $("load-spinner").mojo.stop()
        }
    })
};

ActivitiesListAssistant.prototype.deactivate = function(event) {
};

ActivitiesListAssistant.prototype.cleanup = function(event) {
    Mojo.Event.stopListening($("content"), Mojo.Event.listTap, this.openEntry)
};

ActivitiesListAssistant.prototype.openEntry = function(event){
    Mojo.Log.info("[ActivitiesListAssistant] ==> openEntry")
    Mojo.Controller.stageController.pushScene("activities-details", event.item)
    Mojo.Log.info("[ActivitiesListAssistant] <== openEntry")
}

ActivitiesListAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[ActivitiesListAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "repo-list",
                    transition: Mojo.Transition.crossFade
                }, this.user)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "user-list",
                    transition: Mojo.Transition.crossFade
                }, this.user)
                break;
            case 'do-refresh':
                event.stopPropagation()
                this.activate()
                break;
        }
    }
    Mojo.Log.info("[ActivitiesListAssistant] <== handleCommand")
}

