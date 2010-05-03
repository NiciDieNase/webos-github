/*
 * de.kingcrunch.github
 *
 * Copyright 2009 Sebastian "KingCrunch" Krebs <sebastian.krebs@kingcrunch.de>
 *
 * This file is part of "de.kingcrunch.gut".
 * "de.kingcrunch.github" is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * "crunch" is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License
 * along with "de.kingcrunch.github". If not, see <http://www.gnu.org/licenses/>.
 */
var Model = Class.create({
    storage: new Hash(),
    formatters: {},
    loaded: false,
    
    uri: "unknown",
    
    specs: {
        uriTemplate: "",
        uriSpecs: {},
        responseKey: {},
        itemKey: "items"
    },
    
    initialize: function(assistant, specs){
        this.loaded = false
        this.assistant = assistant
        this.specs = specs
        this.uri = specs.uriTemplate.interpolate(specs.uriSpecs)
        this[this.specs.itemKey] = []
    },
    
    update: function(options){
        if (this.loaded) {
            if (options.onComplete != undefined) {
                options.onComplete()
                
            }
        }
        else {
            this.refresh(options)
        }
    },
    
    refresh: function(options){
        options = options || new Object()
        options.onSuccess = function(response){
        
            if (this.specs.collect) {
                this[this.specs.itemKey] = Mojo.Model.format($H(response.responseJSON[this.specs.responseKey]).collect(this.specs.collect), this.formatters)
            }
            else {
                if (this.specs.map) {
                    this[this.specs.itemKey] = Mojo.Model.format($A(response.responseJSON[this.specs.responseKey]).map(this.specs.map), this.formatters)
                }
                else {
                    this[this.specs.itemKey] = Mojo.Model.format(response.responseJSON[this.specs.responseKey], this.formatters)
                }
            }
            this.loaded = true
            this.assistant.controller.modelChanged(this)
        }
.bind(this)
        
        options.method = "get"
        
        Github.request(this.specs.uriTemplate, this.specs.uriSpecs, options)
    }
})
