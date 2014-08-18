#!/usr/bin/env python
import dolfin
import sys
import tempfile

import pyurdme

mesh = pyurdme.URDMEMesh.read_dolfin_mesh(sys.argv[1])

print mesh.export_to_three_js()
