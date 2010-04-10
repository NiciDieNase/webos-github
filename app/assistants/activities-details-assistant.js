function ActivitiesDetailsAssistant(entry) {
    this.entry = entry
}

ActivitiesDetailsAssistant.prototype.setup = function() {
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
                label: "Actitivties",
                width:320
            }]
        }]
    });
	
	this.controller.get("load-status").hide()
};

ActivitiesDetailsAssistant.prototype.activate = function(event) {
    $("details").update(Mojo.View.render({
                object: this.entry,
                template: 'activities-details/details'
            }))
            $("debug").update(this.entry.toJSON())
};

ActivitiesDetailsAssistant.prototype.deactivate = function(event) {
};

ActivitiesDetailsAssistant.prototype.cleanup = function(event) {
};
