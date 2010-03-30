function IssuedetailAssistant(depot,auth,user,repo,number) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	  this.depot = depot
	  this.auth = auth
	  this.user = user
	  this.repo = repo
	  this.number = number
}

IssuedetailAssistant.prototype.setup = function() {
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
                label: $L("Issuedetail") + ": " + this.repo,
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
    
    /* add event handlers to listen to events from widgets */
    
	this.controller.get('issuedetail-debug').update(dump(this.repo))
    var request = new Ajax.Request("https://github.com/api/v2/json/issues/show/" + escape(this.user) + "/" + escape(this.repo) + "/" + escape(this.number), {
        method: "post",
        evalJSON: "false",
        onSuccess: this.updateIssuedetail.bind(this),
        onFailure: StageAssistant.connectionError,
        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
    })
	
	/* add event handlers to listen to events from widgets */
};

IssuedetailAssistant.prototype.connectionFailed = function(response){
	this.controller.get('issuedetail-debug').update(dump(response.responseJSON))
}

IssuedetailAssistant.prototype.updateIssuedetail = function (response)	{ 
	var content = Mojo.View.render({
        object: response.responseJSON.issue,
        template: 'issuedetail/details'
    })
    this.controller.get("issuedetail-details").update(content)
}


IssuedetailAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

IssuedetailAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

IssuedetailAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
