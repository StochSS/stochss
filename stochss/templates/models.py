'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
'''

spatial_template = {
	"is_spatial": True,
	"defaultID": 1,
	"defaultMode": "discrete",
	"annotation": "",
	"modelSettings": {
		"endSim": 20,
		"timeStep": 0.05,
		"timestepSize": 1e-5
	},
	"domain": {},
	"species": [],
    "initialConditions": [],
	"parameters": [],
	"reactions": [],
    "refLinks": [],
	"boundaryConditions": [],
	"template_version": 1
}

well_mixed_template = {
	"is_spatial": False,
	"defaultID": 1,
	"defaultMode": "",
	"annotation": "",
	"volume": 1,
	"modelSettings": {
		"endSim": 20,
		"timeStep": 0.05
	},
	"species": [],
    "parameters": [],
	"reactions": [],
    "refLinks": [],
	"rules": [],
	"eventsCollection": [],
	"functionDefinitions": [],
	"template_version": 1
}
