function UserinfoAssistant(depot, auth){
    /* this is the creator function for your scene assistant object. It will be passed all the 
     additional parameters (after the scene name) that were passed to pushScene. The reference
     to the scene controller (this.controller) has not be established yet, so any initialization
     that needs the scene controller should be done in the setup function below. */
    this.depot = depot
    this.auth = auth
}

UserinfoAssistant.prototype.setup = function(){
    /* this function is for setup tasks that have to happen when the scene is first created */
    
    var request = new Ajax.Request("https://github.com/api/v2/json/user/show/" + this.auth["username"], {
        method: "post",
        evalJSON: "false",
        onSuccess: this.updateUserinfo.bind(this),
        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
    })
    
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */
    
    /* setup widgets here */
    
    this.feedMenuModel = {
        visible: true,
        items: [{
            items: [{
                icon: "back",
                command: 'back',
                label: "Back"
            }, {
                label: "Userinfo",
                width: 200
            }, {
                icon: "forward",
                command: 'fwd',
                label: "Forward"
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
        listTitle: "Userinfo"
    }
    
    // Set up the attributes & model for the List widget:
    this.controller.setupWidget('userinfo-list', {
        itemTemplate: 'userinfo/item-template',
        listTemplate: 'userinfo/list-template'
    }, this.listModel);
    
    this.controller.setupWidget('discard-auth', {
        type: Mojo.Widget.activityButton
    }, {
        buttonLabel: 'Update',
        buttonClass: 'primary',
        disabled: false
    });
    
    /* add event handlers to listen to events from widgets */
    Mojo.Event.listen(this.controller.get('discard-auth'), Mojo.Event.tap, this.discardAuthorization.bind(this))
    
    
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
};


UserinfoAssistant.prototype.updateUserinfo = function(response){
    //	this.controller.get("debug").update(dump(response.responseJSON))
    //    this.controller.get("username").update(response.responseJSON.user.name)
    
    this.listModel.items = [{
        key: 'name',
        value: response.responseJSON.user.name,
        css: ' first'
    }, {
        key: 'login',
        value: response.responseJSON.user.login
    }, {
        key: 'email',
        value: response.responseJSON.user.email,
    }, {
        key: 'location',
        value: response.responseJSON.user.location
    }, {
        key: 'company',
        value: response.responseJSON.user.company,
    }, {
        key: 'blog',
        value: response.responseJSON.user.blog
    }, {
        key: 'created_at',
        value: Mojo.Format.formatDate(new Date(response.responseJSON.user.created_at),{date:'medium'})
    }, {
        key: 'public_gist_count',
        value: response.responseJSON.user.public_gist_count
    }, {
        key: 'public_repo_count',
        value: response.responseJSON.user.public_repo_count
    }, {
        key: 'totel_private_repot_count',
        value: response.responseJSON.user.total_private_repo_count,
    }, {
        key: 'owned_private_repo_count',
        value: response.responseJSON.user.owned_private_repo_count,
    }, {
        key: 'collaborators',
        value: response.responseJSON.user.collaborators,
    }, {
        key: 'disk-usage',
        value: response.responseJSON.user.disk_usage,
    }, {
        key: 'following_count',
        value: response.responseJSON.user.following_count
    }, {
        key: 'followers_count',
        value: response.responseJSON.user.followers_count
    }, {
        key: 'plan.name',
        value: response.responseJSON.user.plan.name,
    }, {
        key: 'plan.collaborators',
        value: response.responseJSON.user.plan.collaborators,
    }, {
        key: 'plan.space',
        value: response.responseJSON.user.plan.space,
    }, {
        key: 'plan.private_repos',
        value: response.responseJSON.user.plan.private_repos,
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
                }, this.depot, this.auth)
                break;
            case 'fwd':
                event.stopPropagation()
                Mojo.Controller.stageController.swapScene({
                    name: "repositories",
                    transition: Mojo.Transition.crossFade
                }, this.depot, this.auth)
                break;
        }
    }
}
