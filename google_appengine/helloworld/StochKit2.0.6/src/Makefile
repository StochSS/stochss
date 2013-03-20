include ../.make/makefile.c
include ../.make/dependency.h
include ../.make/src4obj.h

stochkit_ssa: 	ssa \
				DM \
				ODM \
				LDM \
				CSSA \
				NRM

stochkit_tau : tau_leaping \
				tau_leaping_exp_adapt \
				tau_leaping_exp_adapt_serial \
				tau_leaping_exp_adapt_mixed \
#				tau_leaping_exp_adapt_mixed_compiled

stochkit_utility: 	precompiled_header \
			random \
			parameter \
			commandline \
			input \
			std_driver \
			std_driver_events \
			parallel

DM:		ssa_direct \
		ssa_direct_serial \
		ssa_direct_mixed \
		ssa_direct_small \
		ssa_direct_serial_small \
		ssa_direct_mixed_small \
		ssa_direct_events
#		ssa_direct_mixed_compiled\
#		ssa_direct_mixed_small_compiled

ODM:	ssa_odm \
		ssa_odm_serial \
		ssa_odm_mixed \
		ssa_odm_small \
		ssa_odm_serial_small \
		ssa_odm_mixed_small \
#		ssa_odm_mixed_compiled \
#		ssa_odm_mixed_small_compiled

CSSA: 	ssa_constant \
		ssa_constant_serial \
		ssa_constant_mixed \
#		ssa_constant_mixed_compiled

LDM:	ssa_ldm \
		ssa_ldm_serial \
		ssa_ldm_mixed \
#		ssa_ldm_mixed_compiled

NRM:	ssa_nrm \
		ssa_nrm_serial \
		ssa_nrm_mixed \

random: $(RANDOM_DEPS)
	$(CXX) $(RANDOM_SRC) -c -o $(STOCHKIT_OBJ)/Random.o $(COMPILE_ONLY_OPTIONS)

parameter: $(PARAMETER)
	$(CXX) $(PARAMETER_SRC) -c -o $(STOCHKIT_OBJ)/Parameter.o $(COMPILE_ONLY_OPTIONS)

commandline: $(COMMAND_LINE_INTERFACE)
	$(CXX) $(COMMAND_LINE_INTERFACE_SRC) -c -o $(STOCHKIT_OBJ)/CommandLineInterface.o $(COMPILE_ONLY_OPTIONS)

input: $(INPUT_DEPS)
	$(CXX) $(INPUT_SRC) -c -o $(STOCHKIT_OBJ)/StringCalculator.o $(COMPILE_ONLY_OPTIONS)

std_driver: $(STD_DRIVER_UT_DEPS)
	$(CXX) $(STD_DRIVER_UT_SRC) -c -o $(STOCHKIT_OBJ)/StandardDriverUtilities.o $(COMPILE_ONLY_OPTIONS)

std_driver_events: $(STD_DRIVER_UT_DEPS)
	$(CXX) -DEVENTS $(STD_DRIVER_UT_SRC) -c -o $(STOCHKIT_OBJ)/StandardDriverUtilities_EVENTS.o $(COMPILE_ONLY_OPTIONS)

parallel: $(PARALLEL_INTERVAL_DEPS)
	$(CXX) $(PARALLEL_INTERVAL_SRC) -c -o $(STOCHKIT_OBJ)/ParallelIntervalSimulation.o $(COMPILE_ONLY_OPTIONS)

precompiled_header: $(PRECOMPILED_HEADER_DEPS)
	$(CXX) $(PRECOMPILED_HEADER_SRC) $(COMPILE_ONLY_OPTIONS)

ssa: $(SSA_DEPS)
	$(CXX)  $(SSA_SRC) -o  $(STOCHKIT_BIN)/ssa $(ALLOPTIONS) 

ssa_direct: $(SSA_DIRECT_DEPS)
	$(CXX)  $(SSA_DIRECT_SRC) -o  $(STOCHKIT_BIN)/ssa_direct $(ALLOPTIONS) 

ssa_odm: $(SSA_ODM_DEPS)
	$(CXX)  $(SSA_ODM_SRC) -o  $(STOCHKIT_BIN)/ssa_odm $(ALLOPTIONS) 

ssa_direct_serial: $(SDS_DEPS)
	$(CXX)  $(SDS_SRC) -o  $(STOCHKIT_BIN)/ssa_direct_serial $(ALLOPTIONS) 

ssa_odm_serial: $(SOS_DEPS)
	$(CXX)  $(SOS_SRC) -o  $(STOCHKIT_BIN)/ssa_odm_serial $(ALLOPTIONS) 

ssa_direct_small: $(SDSM_DEPS)
	$(CXX)  $(SDSM_SRC) -o  $(STOCHKIT_BIN)/ssa_direct_small $(ALLOPTIONS) 

ssa_odm_small: $(SOSM_DEPS)
	$(CXX)  $(SOSM_SRC) -o  $(STOCHKIT_BIN)/ssa_odm_small $(ALLOPTIONS) 

ssa_direct_serial_small: $(SDSS_DEPS)
	$(CXX)  $(SDSS_SRC) -o  $(STOCHKIT_BIN)/ssa_direct_serial_small $(ALLOPTIONS) 

ssa_odm_serial_small: $(SOSS_DEPS)
	$(CXX)  $(SOSS_SRC) -o  $(STOCHKIT_BIN)/ssa_odm_serial_small $(ALLOPTIONS) 

ssa_direct_mixed: $(SDM_DEPS)
	$(CXX)  $(SDM_SRC) -o $(STOCHKIT_BIN)/ssa_direct_mixed $(ALLOPTIONS)

ssa_odm_mixed: $(SOM_DEPS)
	$(CXX)  $(SOM_SRC) -o $(STOCHKIT_BIN)/ssa_odm_mixed $(ALLOPTIONS)

ssa_direct_events: $(SDE_DEPS)
	$(CXX) -DEVENTS $(SDE_SRC) -o $(STOCHKIT_BIN)/ssa_direct_events $(ALLOPTIONS)

ssa_direct_events_compiled: $(SDEC_DEPS)
	$(CXX) -DEVENTS $(SDEC_SRC) -o  $(GENERATED_CODE_PATH)/bin/ssa_direct_events_compiled -include $(GENERATED_CODE_PATH)/CustomPropensityFunctions.h -include $(GENERATED_CODE_PATH)/CustomStateBasedTriggerFunctions.h -include $(GENERATED_CODE_PATH)/CustomChangeSingleSpeciesFunctions.h $(ALLOPTIONS)

ssa_direct_mixed_compiled: $(SDMC_DEPS)
	$(CXX) -DMIXED $(SDMC_SRC) -o  $(GENERATED_CODE_PATH)/bin/ssa_direct_mixed_compiled -include $(GENERATED_CODE_PATH)/CustomPropensityFunctions.h $(ALLOPTIONS)

ssa_direct_mixed_small_compiled: $(SDMSC_DEPS)
	$(CXX) -DMIXED $(SDMSC_SRC) -o  $(GENERATED_CODE_PATH)/bin/ssa_direct_mixed_small_compiled -include $(GENERATED_CODE_PATH)/CustomPropensityFunctions.h $(ALLOPTIONS)

ssa_direct_mixed_small: $(SDMS_DEPS)
	$(CXX)  $(SDMS_SRC) -o $(STOCHKIT_BIN)/ssa_direct_mixed_small $(ALLOPTIONS)

ssa_odm_mixed_small: $(SOMS_DEPS)
	$(CXX)  $(SOMS_SRC) -o $(STOCHKIT_BIN)/ssa_odm_mixed_small $(ALLOPTIONS)

ssa_odm_mixed_compiled: $(SOMC_DEPS)
	$(CXX) -DMIXED $(SOMC_SRC) -o $(GENERATED_CODE_PATH)/bin/ssa_odm_mixed_compiled -include $(GENERATED_CODE_PATH)/CustomPropensityFunctions.h $(ALLOPTIONS)

ssa_odm_mixed_small_compiled: $(SOMSC_DEPS)
	$(CXX) -DMIXED $(SOMSC_SRC) -o $(GENERATED_CODE_PATH)/bin/ssa_odm_mixed_small_compiled -include $(GENERATED_CODE_PATH)/CustomPropensityFunctions.h $(ALLOPTIONS)


constant_group: $(CONSTANT_GROUP_DEPS)
	$(CXX) $(CONSTANT_GROUP_SRC) -c -o $(STOCHKIT_OBJ)/ConstantTimeGroup.o $(COMPILE_ONLY_OPTIONS)

constant_group_collection: $(CONSTANT_GROUP_DEPS)
	$(CXX) $(CONSTANT_GROUP_COLLECTION_SRC) -c -o $(STOCHKIT_OBJ)/ConstantTimeGroupCollection.o $(COMPILE_ONLY_OPTIONS)

ssa_constant: constant_group constant_group_collection $(SSA_COT_DEPS)
	$(CXX)  $(SSA_COT_SRC) -o  $(STOCHKIT_BIN)/ssa_constant $(ALLOPTIONS) 

ssa_constant_serial: constant_group constant_group_collection $(SCS_DEPS)
	$(CXX)  $(SCS_SRC) -o  $(STOCHKIT_BIN)/ssa_constant_serial $(ALLOPTIONS) 

ssa_constant_mixed: constant_group constant_group_collection $(SCM_DEPS)
	$(CXX)  $(SCM_SRC) -o $(STOCHKIT_BIN)/ssa_constant_mixed $(ALLOPTIONS)

ssa_constant_mixed_compiled: constant_group constant_group_collection $(SCMC_DEPS)
	$(CXX) -DMIXED $(SCMC_SRC) -o $(GENERATED_CODE_PATH)/bin/ssa_constant_mixed_compiled -include $(GENERATED_CODE_PATH)/CustomPropensityFunctions.h $(ALLOPTIONS)

ssa_ldm: $(SSA_LDM_DEPS)
	$(CXX)  $(SSA_LDM_SRC) -o  $(STOCHKIT_BIN)/ssa_ldm $(ALLOPTIONS) 

ssa_ldm_serial: $(SLS_DEPS)
	$(CXX)  $(SLS_SRC) -o  $(STOCHKIT_BIN)/ssa_ldm_serial $(ALLOPTIONS) 

ssa_ldm_mixed: $(SLM_DEPS)
	$(CXX)  $(SLM_SRC) -o $(STOCHKIT_BIN)/ssa_ldm_mixed $(ALLOPTIONS)

ssa_ldm_mixed_compiled: $(SLMC_DEPS)
	$(CXX) -DMIXED $(SLMC_SRC) -o  $(GENERATED_CODE_PATH)/bin/ssa_ldm_mixed_compiled -include $(GENERATED_CODE_PATH)/CustomPropensityFunctions.h $(ALLOPTIONS)

ssa_nrm: $(SSA_nrm_DEPS)
	$(CXX)  $(SSA_nrm_SRC) -o  $(STOCHKIT_BIN)/ssa_nrm $(ALLOPTIONS) 

ssa_nrm_serial: $(SNS_DEPS)
	$(CXX)  $(SNS_SRC) -o  $(STOCHKIT_BIN)/ssa_nrm_serial $(ALLOPTIONS) 

ssa_nrm_mixed: $(SNM_DEPS)
	$(CXX)  $(SNM_SRC) -o $(STOCHKIT_BIN)/ssa_nrm_mixed $(ALLOPTIONS)

ssa_nrm_mixed_compiled: $(SNMC_DEPS)
	$(CXX) -DMIXED $(SNMC_SRC) -o  $(GENERATED_CODE_PATH)/bin/ssa_nrm_mixed_compiled -include $(GENERATED_CODE_PATH)/CustomPropensityFunctions.h $(ALLOPTIONS)

tau_leaping: $(TAUL_DEPS)
	$(CXX) $(TAUL_SRC) -o $(STOCHKIT_BIN)/tau_leaping $(ALLOPTIONS)

tau_leaping_exp_adapt: $(TAUL_EXP_ADAPT_DEPS)
	$(CXX) $(TAUL_EXP_ADAPT_SRC) -o $(STOCHKIT_BIN)/tau_leaping_exp_adapt $(ALLOPTIONS)

tau_leaping_exp_adapt_serial: $(TLEAS_DEPS)
	$(CXX) -DMATRIX_STOICHIOMETRY $(TLEAS_SRC) -o $(STOCHKIT_BIN)/tau_leaping_exp_adapt_serial $(ALLOPTIONS)

tau_leaping_exp_adapt_mixed: $(TLEAM_DEPS)
	$(CXX) $(TLEAM_SRC) -o  $(STOCHKIT_BIN)/tau_leaping_exp_adapt_mixed $(ALLOPTIONS)

tau_leaping_exp_adapt_mixed_compiled: $(TEAMC_DEPS)
	$(CXX) -DMATRIX_STOICHIOMETRY -DMIXED $(TEAMC_SRC) -o $(GENERATED_CODE_PATH)/bin/tau_leaping_exp_adapt_mixed_compiled -include $(GENERATED_CODE_PATH)/CustomPropensityFunctions.h $(ALLOPTIONS)

clean:
	rm -f $(ODIR)/*.o core*   
