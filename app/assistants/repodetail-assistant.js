function RepodetailAssistant(depot, auth, username, repo){
    /* this is the creator function for your scene assistant object. It will be passed all the 
     additional parameters (after the scene name) that were passed to pushScene. The reference
     to the scene controller (this.controller) has not be established yet, so any initialization
     that needs the scene controller should be done in the setup function below. */
    this.depot = depot
    this.auth = auth
    this.username = username
    this.repo = repo
}

RepodetailAssistant.prototype.setup = function(){
    /* this function is for setup tasks that have to happen when the scene is first created */
    
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */
    
    /* setup widgets here */
    this.feedMenuModel = {
        visible: true,
        items: [{
            items: [{
                icon: "back",
                command: 'back',
                label: $L("Back")
            }, {
                label: $L("Repodetail") + ": " + this.repo,
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
    
    this.repodetailModel = {
        items: [{
            key: 'info',
            value: 'loading...'
        }],
        listTitle: $L("Repodetail")
    }
    
    // Set up the attributes & model for the List widget:
    this.controller.setupWidget('repodetail-list', {
        itemTemplate: 'repodetail/item-template',
        listTemplate: 'repodetail/list-template'
    }, this.repodetailModel);
    
    /* add event handlers to listen to events from widgets */
	
    var request = new Ajax.Request("https://github.com/api/v2/json/repos/show/" + escape(this.username) + "/" + escape(this.repo), {
        method: "post",
        evalJSON: "false",
        onSuccess: this.updateRepodetail.bind(this),
        onFailure: this.connectionFailed.bind(this),
        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
    })
};

RepodetailAssistant.prototype.activate = function(event){
    /* put in event handlers here that should only be in effect when this scene is active. For
     example, key handlers that are observing the document */
};

RepodetailAssistant.prototype.deactivate = function(event){
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
     this scene is popped or another scene is pushed on top */
};

RepodetailAssistant.prototype.cleanup = function(event){
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
};

RepodetailAssistant.prototype.updateRepodetail = function(response){
    this.repodetailModel.items = [{
        key: $L({
			key: "name",
			value: "Name"
		}),
        value: response.responseJSON.repository.name
    }, {
        key: $L({
			key: "description",
			value: "Description"
		}),
        value: response.responseJSON.repository.description
    }, {
        key: $L({
			key: "owner",
			value: "Owner"
		}),
        value: response.responseJSON.repository.owner
    }, {
        key: $L({
			key: "url",
			value: "URL"
		}),
        value: response.responseJSON.repository.url
    }, {
        key: $L({
			key: "homepage",
			value: "Homepage"
		}),
        value: response.responseJSON.repository.homepage
    }, {
        key: $L({
			key: "open_issues",
			value: "open Issues"
		}),
        value: response.responseJSON.repository.open_issues
    }, {
        key: $L({
			key: "private",
			value: "Private"
		}),
        value: response.responseJSON.repository.private ? "yes" : "no"
    }, {
        key: $L({
			key: "forks",
			value: "Forks"
		}),
        value: response.responseJSON.repository.forks
    }, {
        key: $L({
			key: "form",
			value: "Is fork"
		}),
        value: response.responseJSON.repository.fork ? "yes" : "no"
    }]
	
    this.controller.modelChanged(this.repodetailModel)
}

RepodetailAssistant.prototype.connectionFailed = function(response){
    this.controller.get('repodetail-debug').update(dump(response.responseJSON))
}
