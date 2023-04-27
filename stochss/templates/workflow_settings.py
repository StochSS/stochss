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

wkfl_settings_template = {
    "inferenceSettings": {
        "batchSize": 10,
        "chunkSize": 10,
        "numRounds": 5,
        "numSamples": 100,
        "obsData": "",
        "parameters": [],
        "priorMethod": "Uniform Prior",
        "summaryStats": [
            {
                "name": "sum_values",
                "args": None,
                "formula": ""
            },
            {
                "name": "median",
                "args": None,
                "formula": ""
            },
            {
                "name": "mean",
                "args": None,
                "formula": ""
            },
            {
                "name": "length",
                "args": None,
                "formula": ""
            },
            {
                "name": "standard_deviation",
                "args": None,
                "formula": ""
            },
            {
                "name": "variance",
                "args": None,
                "formula": ""
            },
            {
                "name": "maximum",
                "args": None,
                "formula": ""
            },
            {
                "name": "minimum",
                "args": None,
                "formula": ""
            }
        ],
        "summaryStatsType": "minimal"
    },
    "parameterSweepSettings": {
        "parameters": [],
        "speciesOfInterest": {}
    },
    "resultsSettings": {
        "mapper": "final",
        "outputs": [],
        "reducer": "avg"
    },
    "simulationSettings": {
        "absoluteTol": 1e-06,
        "algorithm": "SSA",
        "isAutomatic": True,
        "realizations": 100,
        "relativeTol": 0.001,
        "seed": -1,
        "tauTol": 0.03
    },
    "template_version": 1,
    "timespanSettings": {
        "endSim": 20,
        "timeStep": 0.05,
        "timestepSize": 1e-05
    }
}
