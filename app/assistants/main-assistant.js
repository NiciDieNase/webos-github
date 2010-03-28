function MainAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
    var options = {
        name: "github", //Name used for the HTML5 database name. (required)
        version: 1, //Version number used for the HTML5 database. (optional, defaults to 1)	
        //displayName: "de.kingcrunch.github", //Name that would be used in user interface that the user sees regarding this database. Not currently used. (optional, defaults to name)
        //estimatedSize: 200000, //Estimated size for this database. (optional, no default)
        replace: false // open an existing depot
    };
    this.depot = new Mojo.Depot(options);
}

MainAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
	/* setup widgets here */
	this.controller.setupWidget(Mojo.Menu.appMenu, {}, StageController.appMenuModel); 
	
	/* add event handlers to listen to events from widgets */
};

MainAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
	  
	if (event == undefined) {
		this.depot.get("auth",this.retrieveAuthorization.bind(this));
	} else {
		this.depot.add("auth",event)
		this.retrieveAuthorization(event)
	}
};

MainAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

MainAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};

MainAssistant.prototype.retrieveAuthorization = function (auth) {
	if (auth == undefined) {
		Mojo.Controller.stageController.pushScene("auth",this.depot)
	} else {
		Mojo.Controller.stageController.pushScene("userinfo",this.depot,auth)
	}
}
