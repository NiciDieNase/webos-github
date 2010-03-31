function IssueDetailsAssistant(depot,auth,user,repo,number) {
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

IssueDetailsAssistant.prototype.setup = function() {
	this.controller.setDefaultTransition(Mojo.Transition.zoomFade)
	
	/* --- Bindings --- */
	this.updateIssuedetail = this.updateIssuedetail.bind(this)
    

	/* --- Status widgets --- */    
	$("details").hide()
	$("load-status").show()
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
    });
    
	
    /* --- Load --- */
    new Ajax.Request("https://github.com/api/v2/json/issues/show/" + escape(this.user) + "/" + escape(this.repo) + "/" + escape(this.number), {
        method: "post",
        evalJSON: "false",
        onSuccess: this.updateIssuedetail,
        onFailure: StageAssistant.connectionError,
        postBody: "login=" + escape(this.auth['username']) + "&token=" + escape(this.auth['apikey'])
    })
};

IssueDetailsAssistant.prototype.connectionFailed = function(response){
}

IssueDetailsAssistant.prototype.updateIssuedetail = function (response)	{ 
	var content = Mojo.View.render({
        object: response.responseJSON.issue,
        template: 'issue-details/details'
    })
	
	$("load-status").hide()
	$("load-spinner").mojo.stop()
    $("details").update(content).show()
}


IssueDetailsAssistant.prototype.activate = function(event) {
};

IssueDetailsAssistant.prototype.deactivate = function(event) {
};

IssueDetailsAssistant.prototype.cleanup = function(event) {
};
