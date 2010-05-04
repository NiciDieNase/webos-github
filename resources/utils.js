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
