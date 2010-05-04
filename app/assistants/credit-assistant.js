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
var CreditAssistant = Class.create(Assistant,{
	initialize : function ($super) {
		$super({scene:"credit"})
	},
	setup:function ($super) {
		$super()
	},
	cleanup: function ($super,event) {
		$super(event)
	},
	activate: function ($super,event) {
		$super(event)
	},
	deactivate: function ($super,event) {
		$super(event)
	},
	handleCommand: function ($super, event) {
		$super(event)
	}
})
