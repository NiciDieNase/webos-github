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
var Assistant = Class.create({
    lists: undefined,
    scene: undefined,
    initialize: function(params){
        this.lists = (params.lists == undefined) ? [] : params.lists
        this.scene = params.scene
        this.openItem = this.openItem.bind(this)
    },
    setup: function(){
        this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
        if (this.controller.get("load-spinner") != undefined) {
            this.controller.setupWidget("load-spinner", {
                spinnerSize: "large"
            }, {
                spinning: false
            })
        }
        
        this.controller.setupWidget(Mojo.Menu.appMenu, {
            omitDefaultItems: true
        }, {
            visible: true,
            items: [Mojo.Menu.editItem, {
                label: Mojo.Menu.prefsItem.label,
                command: Mojo.Menu.prefsItem.command
            }, {
                label: Mojo.Menu.helpItem.label,
                command: Mojo.Menu.helpItem.command
            }]
        });
        
        $A(this.lists).each(function(item){
            Mojo.Log.info(Mojo.Log.propertiesAsString(item))
            this.controller.setupWidget(item.name + "-drawer", {
                modelProperty: 'open',
                unstyled: true
            }, {
                open: false
            });
            
            
            this.controller.setupWidget(item.name + '-list', {
                itemTemplate: this.scene + "/" + item.template + "/item-template",
                listTemplate: this.scene + "/" + item.template + "/list-template",
                itemsProperty: (item.itemsProperty == undefined) ? "items" : item.itemsProperty
            }, item.model);
            
            
            Mojo.Event.listen($(item.name + "-collapser"), Mojo.Event.tap, this.drawerTap.bind(this, item.model))
            
            Mojo.Event.listen($(item.name + "-list"), Mojo.Event.listTap, this.openItem)
        }, this)
    },
    activate: function(event){
        if (true && this.controller.get("admob") != undefined) {
            AdMob.ad.request({
                onSuccess: (function(ad){
                    this.update()
                    this.insert(ad);
                }).bind(this.controller.get("admob")),
                onFailure: (function(response){
                }),
            });
        }
    },
    deactivate: function(event){
    
    },
    cleanup: function(event){
    
        Mojo.Log.info("[UserDetailsAssistant] ==> cleanup")
        
        
        $A(this.lists).each(function(item){
            Mojo.Event.stopListening($(item.name + "-collapser"), Mojo.Event.tap)
            Mojo.Event.stopListening($(item.name + "-list"), Mojo.Event.listTap, this.openItem)
        }, this)
        
        Mojo.Log.info("[UserDetailsAssistant] <== cleanup")
    },
    
    drawerTap: function(model, event){
        Mojo.Log.info("-->")
        if (event.srcElement.up("div[name=top]").down("div[name=drawer]").mojo.getOpenState()) {
            var top = event.srcElement.up("div[name=top]")
            top.down("div[name=drawer]").mojo.toggleState()
            top.down("div.arrow_button").removeClassName("palm-arrow-expanded")
            top.down("div.arrow_button").addClassName("palm-arrow-closed")
            
        }
        else {
            model.update({
                onCreate: function(event){
                    var top = this.srcElement.up("div[name=top]")
                    top.down("div[name=spinner]").mojo.start();
                }
.bind(event)                ,
                onComplete: function(event){
                    var top = this.srcElement.up("div[name=top]")
                    top.down("div[name=spinner]").mojo.stop()
                    top.down("div[name=drawer]").mojo.toggleState()
                    top.down("div[name=arrow]").removeClassName("palm-arrow-closed")
                    top.down("div[name=arrow]").addClassName("palm-arrow-expanded")
                }
.bind(event)
            })
        }
        Mojo.Log.info("<--")
    },
    handleCommand: function(event){
    },
    
    openItem: function(event){
    }
})
