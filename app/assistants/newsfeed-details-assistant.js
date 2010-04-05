function NewsfeedDetailsAssistant(entry) {
	this.entry = entry
}

NewsfeedDetailsAssistant.prototype.setup = function() {
    /* --- App widgets --- */
    this.controller.setupWidget(Mojo.Menu.appMenu, {
        omitDefaultItems: true
    }, StageAssistant.appMenu);
    
    this.controller.setupWidget(Mojo.Menu.viewMenu, {
        spacerHeight: 00,
    }, {
        visible: true,
        items: [{
            items: [{
                label: "Newsfeed",
                width:320
            }]
        }]
    });
};

NewsfeedDetailsAssistant.prototype.activate = function(event) {
	$("details").update(Mojo.View.render({
                object: this.entry,
                template: 'newsfeed-details/details'
            }))
			$("debug").update(this.entry.toJSON())
};

NewsfeedDetailsAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

NewsfeedDetailsAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
