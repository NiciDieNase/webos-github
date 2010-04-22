//////////////////////////////////// xml2array() ////////////////////////////////////////
//See http://www.openjs.com/scripts/xml_parser/
var not_whitespace = new RegExp(/[^\s]/);//This can be given inside the funciton - I made it a global variable to make the scipt a little bit faster.
var parent_count;
//Process the xml data
function xml2array(xmlDoc,parent_count) {
    var arr;
    var parent = "";
    parent_count = parent_count || new Object;

    var attribute_inside = 0; /*:CONFIG: Value - 1 or 0
    *   If 1, Value and Attribute will be shown inside the tag - like this...
    *   For the XML string...
    *   <guid isPermaLink="true">http://www.bin-co.com/</guid>
    *   The resulting array will be...
    *   array['guid']['value'] = "http://www.bin-co.com/";
    *   array['guid']['attribute_isPermaLink'] = "true";
    *   
    *   If 0, the value will be inside the tag but the attribute will be outside - like this... 
    *   For the same XML String the resulting array will be...
    *   array['guid'] = "http://www.bin-co.com/";
    *   array['attribute_guid_isPermaLink'] = "true";
    */

    if(xmlDoc.nodeName && xmlDoc.nodeName.charAt(0) != "#") {
        if(xmlDoc.childNodes.length > 1) { //If its a parent
            arr = new Object;
            parent = xmlDoc.nodeName;
            
        }
    }
    var value = xmlDoc.nodeValue;
    if(xmlDoc.parentNode && xmlDoc.parentNode.nodeName && value) {
        if(not_whitespace.test(value)) {//If its a child
            arr = new Object;
            arr[xmlDoc.parentNode.nodeName] = value;
        }
    }

    if(xmlDoc.childNodes.length) {
        if(xmlDoc.childNodes.length == 1) { //Just one item in this tag.
            arr = xml2array(xmlDoc.childNodes[0],parent_count); //:RECURSION:
        } else { //If there is more than one childNodes, go thru them one by one and get their results.
            var index = 0;

            for(var i=0; i<xmlDoc.childNodes.length; i++) {//Go thru all the child nodes.
                var temp = xml2array(xmlDoc.childNodes[i],parent_count); //:RECURSION:
                if(temp) {
                    var assoc = false;
                    var arr_count = 0;
                    for(key in temp) {
                        if(isNaN(key)) assoc = true;
                        arr_count++;
                        if(arr_count>2) break;//We just need to know wether it is a single value array or not
                    }

                    if(assoc && arr_count == 1) {
                        if(arr[key]) {  //If another element exists with the same tag name before,
                                        //      put it in a numeric array.
                            //Find out how many time this parent made its appearance
                            if(!parent_count || !parent_count[key]) {
                                parent_count[key] = 0;

                                var temp_arr = arr[key];
                                arr[key] = new Object;
                                arr[key][0] = temp_arr;
                            }
                            parent_count[key]++;
                            arr[key][parent_count[key]] = temp[key]; //Members of of a numeric array
                        } else {
                            parent_count[key] = 0;
                            arr[key] = temp[key];
                            if(xmlDoc.childNodes[i].attributes && xmlDoc.childNodes[i].attributes.length) {
                                for(var j=0; j<xmlDoc.childNodes[i].attributes.length; j++) {
                                    var nname = xmlDoc.childNodes[i].attributes[j].nodeName;
                                    if(nname) {
                                        /* Value and Attribute inside the tag */
                                        if(attribute_inside) {
                                            var temp_arr = arr[key];
                                            arr[key] = new Object;
                                            arr[key]['value'] = temp_arr;
                                            arr[key]['attribute_'+nname] = xmlDoc.childNodes[i].attributes[j].nodeValue;
                                        } else {
                                        /* Value in the tag and Attribute otside the tag(in parent) */
                                            arr['attribute_' + key + '_' + nname] = xmlDoc.childNodes[i].attributes[j].nodeValue;
                                        }
                                    }
                                } //End of 'for(var j=0; j<xmlDoc. ...'
                            } //End of 'if(xmlDoc.childNodes[i] ...'
                        }
                    } else {
                        arr[index] = temp;
                        index++;
                    }
                } //End of 'if(temp) {'
            } //End of 'for(var i=0; i<xmlDoc. ...'
        }
    }

    if(parent && arr) {
        var temp = arr;
        arr = new Object;
        
        arr[parent] = temp;
    }
    return arr;
}

function dump (arr, level){
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


function iso2date (value) {
    result = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})-(\d{2}):(\d{2})/.exec(value)
    date = new Date(result[1], parseInt(result[2]) - 1, result[3], parseInt(result[4]) + parseInt(result[7]), result[5], result[6])
            
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    return date    
}

function rss2object(feed){
    meta = $A(feed.childNodes).findAll(function(item) {
        return (item.nodeType == 1) && (item.tagName != "entry")
    })
	rssObject = {
		entry: $A(feed.getElementsByTagName("entry")).map(function(entry){
			return {
				id: entry.getElementsByTagName("id")[0].firstChild.nodeValue,
				published: entry.getElementsByTagName("published")[0].firstChild.nodeValue,
				updated: entry.getElementsByTagName("updated")[0].firstChild.nodeValue,
				content: entry.getElementsByTagName("content")[0].firstChild.nodeValue,
				title: entry.getElementsByTagName("title")[0].firstChild.nodeValue,
				author: $A(entry.getElementsByTagName("author")).map(function(author){
					return {
						name: author.getElementsByTagName("name")[0].firstChild.nodeValue
					}
				}),
				link: $A(entry.getElementsByTagName("link")).map(function(link){
					return {
						href: link.attributes.getNamedItem("href").value
					}
				})
			}
		}),
		link: $A(meta).findAll(function(item){return item.tagName == 'link'}) .map(function(link){
			return {
				href:link.attributes.getNamedItem("href").value
			}
		}),
		id: $A(meta).findAll(function(item){return item.tagName == 'id'})[0].childNodes[0].nodeValue,
        title: $A(meta).findAll(function(item){return item.tagName == 'title'})[0].childNodes[0].nodeValue,
        updated: $A(meta).findAll(function(item){return item.tagName == 'updated'})[0].childNodes[0].nodeValue
	}
	return rssObject
}
