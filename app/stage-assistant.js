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
var StageAssistant = Class.create({
    initialize: function(){
        Mojo.Log.info("[StageAssistant] ==> Construct")
        
        this.depot = new Mojo.Depot({
            name: "de.kingcrunch.github",
            version: 1,
            //displayName: "de.kingcrunch.github",
            //estimatedSize: 200000, 
            replace: false // open an existing depot
        });
        
        
        AdMob.ad.initialize({
            pub_id: 'a14bbbbacb9e602', // your publisher id
            bg_color: '#ccc', // optional background color, defaults to #fff
            text_color: '#333', // optional background color, defaults to #000
            test_mode: true // optional, set to true for testing ads, remove or set to false for production
        });
        
        this.handleCommand = this.handleCommand.bind(this)
        
        Mojo.Log.info("[StageAssistant] <== Construct")
        
    },
    
    
    setup: function(){
        Mojo.Log.info("[StageAssistant] ==> setup")
        
        this.depot.get("auth", this.loadAuthorization.bind(this))
        
        Mojo.Log.info("[StageAssistant] <== setup")
    },
    
    
    loadAuthorization: function(auth){
        Mojo.Log.info("[StageAssistant] ==> loadAuthorization")
        
        if (auth == undefined) {
            Mojo.Log.info("[StageAssistant] === loadAuthorization: Auth undefined, push 'auth'")
            this.controller.pushScene("auth", this.depot)
        }
        else {
            Mojo.Log.info("[StageAssistant] === loadAuthorization: Auth defined, push 'user-details'")
            this.auth = auth
            Github.authorize(auth.login, auth.token)
            //        this.controller.pushScene("user-details", auth["username"])
            this.controller.pushScene("newsfeed")
        }
        
        Mojo.Log.info("[StageAssistant] <== loadAuthorization")
    },
    
    handleCommand: function(event){
        Mojo.Log.info("[StageAssistant] ==> handleCommand")
        
        if (event.type == Mojo.Event.command) {
            Mojo.Log.info("[StageController] = handleCommand: '" + event.command + "' received")
            switch (event.command) {
                case 'cmd-updateToken':
                    event.stopPropagation()
                    this.controller.pushScene("auth", this.depot, this.auth)
                    break;
                case Mojo.Menu.helpItem.command:
                    this.controller.pushAppSupportInfoScene()
                    break;
                case Mojo.Menu.prefsItem.command:
                    this.controller.pushScene("preferences", this.depot, Github.auth)
                    break;
                default:
                    Mojo.Log.info("[StageAssistant] = handleCommand: '" + event.command + "' not handled here")
                    break;
                    
            }
        }
        
        Mojo.Log.info("[StageAssistant] <== loadAuthorization")
    }
    
    
    
})

StageAssistant.connectionError = function(response){
    Mojo.Log.info("[StageAssistant] ==> connectionError")
    
    if ((response.responseJSON == undefined) || (response.responseJSON.error == undefined)) {
        Mojo.Log.error("[StageAssistant] === connectionError: Error caused by Connection: " + response.status + " - '" + response.statusText + "' not handled correctly")
        Mojo.Controller.errorDialog(response.status + ": " + response.statusText)
    }
    else {
        Mojo.Log.warn("[StageAssistant] === connectionError: Error caused by Application: " + response.responseJSON.error[0].error)
        Mojo.Controller.errorDialog(response.responseJSON.error[0].error)
    }
    
    Mojo.Log.info("[StageAssistant] <== connectionError")
}
