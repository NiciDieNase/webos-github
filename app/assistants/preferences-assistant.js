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

function PreferencesAssistant(depot, auth){
    this.depot = depot
    this.auth = auth
}

PreferencesAssistant.prototype.setup = function(){
    AdMob.ad.request({
        onSuccess: (function(ad){ // successful ad call, parameter 'ad' is the html markup for the ad
            $('admob').insert(ad); // place mark up in the the previously declared div
        }).bind(this),
        onFailure: (function(response){ 
          Mojo.Log.info("AdMob failed: "+response.responseText)
        }).bind(this),
    });
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    
    /* --- App widgets --- */
    this.controller.setupWidget(Mojo.Menu.appMenu, {
        omitDefaultItems: true
    }, StageAssistant.appMenu);
    
    /* --- UI widgets --- */
    this.controller.setupWidget('login', usernameAttributes = {
        hintText: 'Login',
        modelProperty: 'login'
    }, this.auth);
    this.controller.setupWidget('token', apikeyAttributes = {
        hintText: 'Token',
        modelProperty: 'token'
    }, this.auth);
    
    this.controller.setupWidget('save', {
        type: Mojo.Widget.activityButton
    }, this.buttonModel = {
        buttonLabel: 'Save',
        buttonClass: 'primary',
        disabled: !((this.auth.login.length > 0) && (this.auth.token.length == 32))
    });
    this.controller.setupWidget(Mojo.Menu.viewMenu, {
        spacerHeight: 00,
        menuClass: 'no-fade'
    }, {
        visible: true,
        items: [{
            items: [{
                label: "Preferences",
                width: 320
            }]
        }]
    });
    
    
    this.saveAccount = this.saveAccount.bind(this)
    Mojo.Event.listen(this.controller.get('save'), Mojo.Event.tap, this.saveAccount)
    
};

PreferencesAssistant.prototype.activate = function(event){
};

PreferencesAssistant.prototype.deactivate = function(event){
};

PreferencesAssistant.prototype.cleanup = function(event){
    Mojo.Event.stopListening(this.controller.get('update'), Mojo.Event.tap, this.saveAccount)
};


PreferencesAssistant.prototype.saveAccount = function(){
    var r = new Ajax.Request("https://github.com/api/v2/json/user/show/#{login}".interpolate(this.auth), {
        method: "post",
        parameters: this.auth,
        onSuccess: function(){
			this.depot.add("auth",this.auth)
			Github.auth = this.auth
            Mojo.Controller.stageController.popScene()
        }.bind(this),
        onFailure: function(response){
			this.controller.get("save").mojo.deactivate()
            if ((response.responseJSON == undefined) || (response.responseJSON.error == undefined)) {
                if (response.status == 401) {
                    Mojo.Controller.errorDialog("Username or API-Token invalid")
                }
                else {
                    Mojo.Controller.errorDialog(response.status + ": " + response.statusText)
                }
            }
            else {
                Mojo.Controller.errorDialog(response.responseJSON.error[0].error)
            }
        }.bind(this)
    })
}
