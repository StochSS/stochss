PyURDME Example:  Coral Reef
=============================

Introduction
----------------------
This model of space competiinot between Macro Algae (MA) and Coral (C) is a 2D periodic domain representing a patch of reef.  Mature Coral colonys produce mobile propagules, which diffuse. Same with Macro Algae  When a propagule find a open Turf space (T), it creates a new mature version of it's species.  Mature version are able to grow locally filling the free Turf within each voxel, but are unable to spread beyond voxel the border. It must depend on the mobile propagules for that.


Code
----------------------

.. literalinclude:: ../examples/coral_reef/coral.py
   :language: python
   :linenos:
