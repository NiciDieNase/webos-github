function Newsfeed(login){
    this.login = login
    this.watcher = ""
    
    this.items = []
    
    this.type = "open"
    
}

Newsfeed.mapping = new Hash()



Newsfeed.prototype.refresh = function(options){
    Mojo.Log.info("[Newsfeed] ==> refresh")
    options = options || new Object()
    options.onSuccess = function(response){
        Mojo.Log.info("[Newsfeed] === refresh -> onSuccess")
        
        Newsfeed.mapping[this.login + "/newsfeed/entries"] = $H(response.responseATOM.feed.entry).collect(function(value){
            return value[1]
        }).each(function(item){
            return Mojo.Model.format(item, Newsfeed.formatters)
        })
        
        this.update()
        Mojo.Log.info("[Newsfeed] === refresh <- onSuccess")
    }
.bind(this)
    
    options.method = "get"
    
    Github.privateFeed(options)
    Mojo.Log.info("[Newsfeed] <== refresh")
}

Newsfeed.prototype.update = function(options){
    if (Newsfeed.mapping[this.login + "/newsfeed/entries"] == undefined) {
        this.refresh(options)
    }
    else {
        this.items = Newsfeed.mapping[this.login + "/newsfeed/entries"]
        
        this.watcher()
    }
}


Newsfeed.prototype.bindWatcher = function(watcher){
    this.watcher = watcher
}

Newsfeed.prototype.setType = function(type){
    this.type = type
    this.update()
}


Newsfeed.formatters = {
    updated: function(value,context){
        var Ausdruck = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})-(\d{2}):(\d{2})/;
        var result = Ausdruck.exec(value)
        var dateObj = new Date(result[1], parseInt(result[2]) - 1, result[3], parseInt(result[4]) + parseInt(result[7]), result[5], result[6])
        
        dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset())
        
        context.updated = Mojo.Format.formatDate(dateObj, {
            date: "long",
            time: "short"
        })
    },
    published: function(value,context){
        var Ausdruck = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})-(\d{2}):(\d{2})/;
        var result = Ausdruck.exec(value)
        var dateObj = new Date(result[1], parseInt(result[2]) - 1, result[3], parseInt(result[4]) + parseInt(result[7]), result[5], result[6])
        
        dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset())
        
        context.published = Mojo.Format.formatDate(dateObj, {
            date: "long",
            time: "short"
        })
    }
}
