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
};

NewsfeedDetailsAssistant.prototype.cleanup = function(event) {
};
