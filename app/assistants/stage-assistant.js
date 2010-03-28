function StageAssistant(){
    /* this is the creator function for your stage assistant object */
	
    var options = {
        name: "github", //Name used for the HTML5 database name. (required)
        version: 1, //Version number used for the HTML5 database. (optional, defaults to 1)	
        //displayName: "de.kingcrunch.github", //Name that would be used in user interface that the user sees regarding this database. Not currently used. (optional, defaults to name)
        //estimatedSize: 200000, //Estimated size for this database. (optional, no default)
        replace: false // open an existing depot
    };
    this.depot = new Mojo.Depot(options);
	
}

StageAssistant.prototype.setup = function(){
    /* this function is for setup tasks that have to happen when the stage is first created */
    
    /* for a simple application, the stage assistant's only task is to push the scene, making it
     visible */
    this.appMenuModel = {
        items: [{
            label: "Reset API Key",
            command: "do-auth"
        }]
    };
    
    
	this.depot.get("auth",this.loadAuthorization.bind(this))
};

function dump(arr, level){
    var dumped_text = "";
    if (!level) 
        level = 0;
    
    //The padding given at the beginning of the line.
    var level_padding = "";
    for (var j = 0; j < level + 1; j++) 
        level_padding += "    ";
    
    if (typeof(arr) == 'object') { //Array/Hashes/Objects 
        for (var item in arr) {
            var value = arr[item];
            
            if (typeof(value) == 'object') { //If it is an array,
                dumped_text += level_padding + "'" + item + "' ...\n";
                dumped_text += dump(value, level + 1);
            }
            else {
                dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
            }
        }
    }
    else { //Stings/Chars/Numbers etc.
        dumped_text = "===>" + arr + "<===(" + typeof(arr) + ")";
    }
    return dumped_text;
}

StageAssistant.prototype.loadAuthorization = function (auth) {
	if (auth == undefined) {
		this.controller.pushScene("auth",this.depot)
	} else {
		this.controller.pushScene("userinfo",this.depot,auth)
	}
}

StageAssistant.prototype.handleCommand = function(event){

    this.controller = Mojo.Controller.stageController.activeScene();
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            // another built-in menu item, but we've enabled it (see below in this method)
            // so now we have to handle it:
            case 'do-auth':
                this.resetAuthentification();
                break;
        }
    }
}