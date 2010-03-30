function UserinfoAssistant(depot, auth, username){
    /* this is the creator function for your scene assistant object. It will be passed all the 
     additional parameters (after the scene name) that were passed to pushScene. The reference
     to the scene controller (this.controller) has not be established yet, so any initialization
     that needs the scene controller should be done in the setup function below. */
    this.depot = depot
    this.auth = auth
    this.username = username
}

UserinfoAssistant.prototype.setup = function(){
    /* this function is for setup tasks that have to happen when the scene is first created */
    this.updateUserinfo = this.updateUserinfo.bind(this)
    this.updatePrivateUserinfo = this.updatePrivateUserinfo.bind(this)
    
    //for more on what each attribute means, see the Spinner widget API docs
    var spinnerCAttrs = {
        mainFrameCount: 11,
        finalFrameCount: 7,
        fps: 10
    };
    
    
    if (this.auth["username"] == this.username) {
        var request = new Ajax.Request("https://github.com/api/v2/json/user/show/" + escape(this.username), {
            method: "post",
            evalJSON: "false",
            onSuccess: this.updatePrivateUserinfo,
            onFailure: this.connectionFailed.bind(this),
            postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
        })
    }
    else {
        var request = new Ajax.Request("https://github.com/api/v2/json/user/show/" + escape(this.username), {
            method: "get",
            evalJSON: "false",
            onSuccess: this.updateUserinfo,
            onFailure: this.connectionFailed.bind(this)
        })
    }
    
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */
    
    /* setup widgets here */
    this.controller.setupWidget(Mojo.Menu.appMenu, {
        omitDefaultItems: true
    }, StageAssistant.appMenu);
    
    this.feedMenuModel = {
        visible: true,
        items: [{
            items: [{
                icon: "back",
                command: 'back',
                label: $L("Back")
            }, {
                label: $L("Userinfo"),
                width: 200
            }, {
                icon: "forward",
                command: 'fwd',
                label: $L("Forward")
            }]
        }]
    };
    this.controller.setupWidget(Mojo.Menu.viewMenu, {
        spacerHeight: 00,
        menuClass: 'no-fade'
    }, this.feedMenuModel);
    
    this.listModel = {
        items: [{
            key: 'info',
            value: 'loading...'
        }],
        listTitle: $L("Userinfo")
    }
    
    // Set up the attributes & model for the List widget:
    this.controller.setupWidget('userinfo-list', {
        itemTemplate: 'userinfo/item-template',
        listTemplate: 'userinfo/list-template'
    }, this.listModel);
    
    this.controller.setupWidget('discard-auth', {
        type: Mojo.Widget.activityButton
    }, {
        buttonLabel: $L({
            key: 'update-token',
            value: "Change API Token"
        }),
        buttonClass: 'primary',
        disabled: false
    });
    
    /* add event handlers to listen to events from widgets */
    this.discardAuthorization = this.discardAuthorization.bind(this)
    Mojo.Event.listen(this.controller.get('discard-auth'), Mojo.Event.tap, this.discardAuthorization)
    
    
    /* add event handlers to listen to events from widgets */
};

UserinfoAssistant.prototype.activate = function(event){
    /* put in event handlers here that should only be in effect when this scene is active. For
     example, key handlers that are observing the document */
};

UserinfoAssistant.prototype.deactivate = function(event){
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
     this scene is popped or another scene is pushed on top */
};

UserinfoAssistant.prototype.cleanup = function(event){
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
    Mojo.Event.stopListening(this.controller.get("discard-auth"), Mojo.Event.tap, this.discardAuthorization)
};


UserinfoAssistant.prototype.updatePrivateUserinfo = function(response){
    //	this.controller.get("debug").update(dump(response.responseJSON))
    //    this.controller.get("username").update(response.responseJSON.user.name)
    
    this.listModel.items = [{
        key: $L({
            value: 'name',
            key: 'name'
        }),
        value: response.responseJSON.user.name,
        css: ' first'
    }, {
        key: $L({
            key: 'login',
            value: 'login'
        }),
        value: response.responseJSON.user.login
    }, {
        key: $L({
            key: 'email',
            value: 'email'
        }),
        value: response.responseJSON.user.email,
    }, {
        key: $L({
            key: 'location',
            value: 'location'
        }),
        value: response.responseJSON.user.location
    }, {
        key: $L({
            key: 'company',
            value: 'company'
        }),
        value: response.responseJSON.user.company,
    }, {
        key: $L({
            key: 'blog',
            value: 'blog'
        }),
        value: "<a href=\"" + response.responseJSON.user.blog + "\">" + response.responseJSON.user.blog + "</a>"
    }, {
        key: $L({
            key: 'created_at',
            value: 'created at'
        }),
        value: Mojo.Format.formatDate(new Date(response.responseJSON.user.created_at), {
            date: 'medium'
        })
    }, {
        key: $L({
            key: 'public_gist_count',
            value: 'public gists count'
        }),
        value: response.responseJSON.user.public_gist_count
    }, {
        key: $L({
            key: 'public_repo_count',
            value: 'public repo count'
        }),
        value: response.responseJSON.user.public_repo_count
    }, {
        key: $L({
            key: 'total_private_repo_count',
            value: 'total private repo count'
        }),
        value: response.responseJSON.user.total_private_repo_count,
    }, {
        key: $L({
            key: 'owned_private_repo_count',
            value: 'owned private repo count'
        }),
        value: response.responseJSON.user.owned_private_repo_count,
    }, {
        key: $L({
            key: 'collaborators',
            value: 'collaborators'
        }),
        value: response.responseJSON.user.collaborators,
    }, {
        key: $L({
            key: 'disk-usage',
            value: 'disk usage'
        }),
        value: response.responseJSON.user.disk_usage,
    }, {
        key: $L({
            key: 'following_count',
            value: 'following count'
        }),
        value: response.responseJSON.user.following_count
    }, {
        key: $L({
            key: 'followers_count',
            value: 'followers count'
        }),
        value: response.responseJSON.user.followers_count
    }, {
        key: $L({
            key: 'plan.name',
            value: 'plan: name'
        }),
        value: response.responseJSON.user.plan.name,
    }, {
        key: $L({
            key: 'plan.collaborators',
            value: 'plan: collaborators'
        }),
        value: response.responseJSON.user.plan.collaborators,
    }, {
        key: $L({
            key: 'plan.space',
            value: 'pan: space'
        }),
        value: response.responseJSON.user.plan.space,
    }, {
        key: $L({
            key: 'plan.private_repos',
            value: 'plan: private repos'
        }),
        value: response.responseJSON.user.plan.private_repos,
        css: ' last'
    }]
    
    this.controller.modelChanged(this.listModel)
}

UserinfoAssistant.prototype.updateUserinfo = function(response){
    //	this.controller.get("debug").update(dump(response.responseJSON))
    //    this.controller.get("username").update(response.responseJSON.user.name)
    
    this.listModel.items = [{
        key: $L({
            value: 'name',
            key: 'name'
        }),
        value: response.responseJSON.user.name,
        css: ' first'
    }, {
        key: $L({
            key: 'login',
            value: 'login'
        }),
        value: response.responseJSON.user.login
    }, {
        key: $L({
            key: 'email',
            value: 'email'
        }),
        value: response.responseJSON.user.email,
    }, {
        key: $L({
            key: 'location',
            value: 'location'
        }),
        value: response.responseJSON.user.location
    }, {
        key: $L({
            key: 'company',
            value: 'company'
        }),
        value: response.responseJSON.user.company,
    }, {
        key: $L({
            key: 'blog',
            value: 'blog'
        }),
        value: "<a href=\"" + response.responseJSON.user.blog + "\">" + response.responseJSON.user.blog + "</a>"
    }, {
        key: $L({
            key: 'created_at',
            value: 'created at'
        }),
        value: Mojo.Format.formatDate(new Date(response.responseJSON.user.created_at), {
            date: 'medium'
        })
    }, {
        key: $L({
            key: 'public_gist_count',
            value: 'public gists count'
        }),
        value: response.responseJSON.user.public_gist_count
    }, {
        key: $L({
            key: 'public_repo_count',
            value: 'public repo count'
        }),
        value: response.responseJSON.user.public_repo_count
    }, {
        key: $L({
            key: 'following_count',
            value: 'following count'
        }),
        value: response.responseJSON.user.following_count
    }, {
        key: $L({
            key: 'followers_count',
            value: 'followers count'
        }),
        value: response.responseJSON.user.followers_count,
        css: ' last'
    }]
    
    this.controller.modelChanged(this.listModel)
}

UserinfoAssistant.prototype.discardAuthorization = function(){
    Mojo.Controller.stageController.swapScene("auth", this.depot, this.auth)
}

UserinfoAssistant.prototype.handleCommand = function(event){

    //    this.controller = Mojo.Controller.stageController.activeScene();
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            // another built-in menu item, but we've enabled it (see below in this method)
            // so now we have to handle it:
            case 'back':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "social",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "repositories",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth, this.username)
                break;
        }
    }
}

UserinfoAssistant.prototype.connectionFailed = function(response){
    this.controller.get('userinfo-debug').update(dump(response.responseJSON))
}
