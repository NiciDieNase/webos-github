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

function CommentListAssistant(user, repo, number){
    Mojo.Log.info("[CommentListAssistant] ==> Construct")
    this.user = user
    this.repo = repo
    this.number = number
    Mojo.Log.info("[CommentListAssistant] <== Construct")
}

CommentListAssistant.prototype.setup = function(){
    AdMob.ad.request({
        onSuccess: (function(ad){ // successful ad call, parameter 'ad' is the html markup for the ad
            $('admob').insert(ad); // place mark up in the the previously declared div
        }).bind(this),
        onFailure: (function(response){ 
          Mojo.Log.info("AdMob failed: "+response.responseText)
        }).bind(this),
    });
    Mojo.Log.info("[CommentListAssistant] ==> setup")
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
    
    /* --- Bindings --- */
    this.handleCommand = this.handleCommand.bind(this)
    this.refreshCommentlist = this.refreshCommentlist.bind(this)
    
    
    /* --- Status widgets --- */
    $("load-spinner").hide()
    this.controller.setupWidget("load-spinner", {
        spinnerSize: "large"
    }, {
        spinning: false
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
                label: "Back"
            }, {
                label: "Comment List",
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
    
    
    /* --- UI widgets --- */
    this.controller.setupWidget('content', {
        itemTemplate: 'comment-list/item-template',
        listTemplate: 'comment-list/list-template'
    }, this.listModel = new Comments(this.user,this.repo,this.number));
	this.listModel.bindWatcher(function(){this.controller.modelChanged(this.listModel)}.bind(this))
	
	
    Mojo.Log.info("[CommentListAssistant] <== setup")
    
    this.controller.get("load-status").hide()
};

CommentListAssistant.prototype.refreshCommentlist = function(){
    Mojo.Log.info("[CommentListAssistant] ==> refreshCommentlist")
    
    Github.request("/issues/comments/#{user}/#{repo}/#{number}", {
        user: this.user,
        repo: this.repo,
        number: this.number
    }, {
        onSuccess: function(params, response){
            this.listModel.items = response.responseJSON.comments
			this.listModel.listTitle = "Comments for Issue ##{number} on #{user}/#{repo}".interpolate(params)
            this.controller.modelChanged(this.listModel)
        }
.bind(this,{user:this.user,repo:this.repo,number:this.number})        ,
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
    
    Mojo.Log.info("[CommentListAssistant] <== refreshCommentlist")
}

CommentListAssistant.prototype.activate = function(event){
    Mojo.Log.info("[CommentListAssistant] ==> activate")
    this.listModel.update({onComplete: function(x){
            $("load-spinner").mojo.stop()
            $("load-status").hide()
            $("content").show()
        },
        onCreate: function(x){
            $("load-spinner").mojo.start()
            $("content").hide()
            $("load-status").show()
        }})
    Mojo.Log.info("[CommentListAssistant] <== activate")
};

CommentListAssistant.prototype.deactivate = function(event){
    Mojo.Log.info("[CommentListAssistant] <=> deactivate")
};

CommentListAssistant.prototype.cleanup = function(event){
    Mojo.Log.info("[CommentListAssistant] <=> cleanup")
};

CommentListAssistant.prototype.handleCommand = function(event){
    Mojo.Log.info("[CommentListAssistant] ==> handleCommand")
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "issue-details",
                    transition: Mojo.Transition.crossFade
                }, this.user, this.repo, this.number)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "issue-details",
                    transition: Mojo.Transition.crossFade
                }, this.user, this.repo, this.number)
                break;
            case 'do-refresh':
                event.stopPropagation()
                this.listModel.refresh()
                break;
        }
    }
    Mojo.Log.info("[CommentListAssistant] <== handleCommand")
}
