#utility
_RANDOM_DEPS = Random.h Random.cpp
_UTILITY_DEPS = StandardDriverUtilities.h StandardDriverUtilities.cpp CommandLineInterface.h CommandLineInterface.cpp StandardDriverTypes.h
_TRIGGER = TimeBasedTrigger.h TimeBasedTrigger.cpp
_COMMAND_LINE_INTERFACE = CommandLineInterface.h CommandLineInterface.cpp
_STD_DRIVER_UT_DEPS = StandardDriverUtilities.h StandardDriverUtilities.cpp CommandLineInterface.h StandardDriverTypes.h
_PRECOMPILED_HEADER_DEPS = boost_headers.h

RANDOM_DEPS  =  $(patsubst %,$(STOCHKIT_SRC)/utility/%,$(_RANDOM_DEPS))
UTILITY_DEPS =  $(patsubst %,$(STOCHKIT_SRC)/utility/%,$(_UTILITY_DEPS))
TRIGGER      =  $(patsubst %,$(STOCHKIT_SRC)/utility/%,$(_TRIGGER))
COMMAND_LINE_INTERFACE  =  $(patsubst %,$(STOCHKIT_SRC)/utility/%,$(_COMMAND_LINE_INTERFACE))
STD_DRIVER_UT_DEPS  =  $(patsubst %,$(STOCHKIT_SRC)/utility/%,$(_STD_DRIVER_UT_DEPS))
PRECOMPILED_HEADER_DEPS  =  $(patsubst %,$(STOCHKIT_SRC)/utility/%,$(_PRECOMPILED_HEADER_DEPS))

#output
_OUTPUT_DEPS = StatsOutput.h  IntervalOutput.h StandardDriverOutput.h

OUTPUT_DEPS =  $(patsubst %,$(STOCHKIT_SRC)/output/%,$(_OUTPUT_DEPS))

#model_parser
_INPUT_DEPS = Input.h Input.ipp Input_mass_action.h StringCalculator.h StringCalculator.cpp 
_PARAMETER = Parameter.h Parameter.cpp
_INPUT_MIXED_BEF_AFT_COM = Input_mixed_before_compile.h Input_mixed_after_compile.h
_INPUT_EVENTS_BEF_AFT_COM = Input_events_before_compile.h Input_events_after_compile.h
_INPUT_EVENTS_BEF_COM = Input_events_before_compile.h 
_INPUT_EVENTS_AFT_COM = Input_events_after_compile.h
_TAG_DEP = Input_tag.h ModelTag.h


INPUT_DEPS = $(patsubst %,$(STOCHKIT_SRC)/model_parser/%,$(_INPUT_DEPS))
PARAMETER = $(patsubst %,$(STOCHKIT_SRC)/model_parser/%,$(_PARAMETER))
INPUT_MIXED_BEF_AFT_COM = $(patsubst %,$(STOCHKIT_SRC)/model_parser/%,$(_INPUT_MIXED_BEF_AFT_COM))
INPUT_EVENTS_BEF_AFT_COM = $(patsubst %,$(STOCHKIT_SRC)/model_parser/%,$(_INPUT_EVENTS_BEF_AFT_COM))
INPUT_EVENTS_BEF_COM = $(patsubst %,$(STOCHKIT_SRC)/model_parser/%,$(_INPUT_EVENTS_BEF_COM))
INPUT_EVENTS_AFT_COM = $(patsubst %,$(STOCHKIT_SRC)/model_parser/%,$(_INPUT_EVENTS_AFT_COM))
TAG_DEP = $(patsubst %,$(STOCHKIT_SRC)/model_parser/%,$(_TAG_DEP))

#drivers
_SERIAL_DEPS = SerialIntervalSimulationDriver.h
_PARALLEL_INTERVAL_DEPS = ParallelIntervalSimulation.h ParallelIntervalSimulation.cpp
_SSA_DIRECT_EVENT_DRIVER = ssa_direct_events.cpp 

SERIAL_DEPS =  $(patsubst %,$(STOCHKIT_SRC)/drivers/%,$(_SERIAL_DEPS))
PARALLEL_INTERVAL_DEPS =  $(patsubst %,$(STOCHKIT_SRC)/drivers/%,$(_PARALLEL_INTERVAL_DEPS))
SSA_DIRECT_EVENT_DRIVER = $(patsubst %,$(STOCHKIT_SRC)/drivers/%,$(_SSA_DIRECT_EVENT_DRIVER))

#solvers
_SSA_DIRECT_DEPS = SSA_Direct.h SSA_Direct.ipp
_SSA_DIRECT_EVENT_SOLVER = SSA_Direct_Events.h

SSA_DIRECT_DEPS = $(patsubst %,$(STOCHKIT_SRC)/solvers/%,$(_SSA_DIRECT_DEPS))
SSA_DIRECT_EVENT_SOLVER = $(patsubst %,$(STOCHKIT_SRC)/solvers/%,$(_SSA_DIRECT_EVENT_SOLVER))

_LDMTREE_DEPS = LDMTree.h LDMTree.cpp
LDMTREE_DEPS = $(patsubst %,$(STOCHKIT_SRC)/solvers/%,$(_LDMTREE_DEPS))

_LDM_DEPS = SSA_LDM.h SSA_LDM.ipp
LDM_DEPS = $(patsubst %,$(STOCHKIT_SRC)/solvers/%,$(_LDM_DEPS))

_CONSTANT_TIME_HDEPS = SSA_ConstantTime.h SSA_ConstantTime.ipp
CONSTANT_TIME_HDEPS = $(patsubst %,$(STOCHKIT_SRC)/solvers/%,$(_CONSTANT_TIME_HDEPS))

_TAUL_EXP_ADP_DEPS = TauLeapingExplicitAdaptive.h TauLeapingExplicitAdaptive.ipp
TAUL_EXP_ADP_DEPS = $(patsubst %,$(STOCHKIT_SRC)/solvers/%,$(_TAUL_EXP_ADP_DEPS))

_CONSTANT_GROUP_DEPS = ConstantTimeGroup.cpp ConstantTimeGroupCollection.cpp ConstantTimeGroup.h ConstantTimeGroupCollection.h
CONSTANT_GROUP_DEPS = $(patsubst %,$(STOCHKIT_SRC)/solvers/%,$(_CONSTANT_GROUP_DEPS))

#for ssa
SSA_DEPS = $(STOCHKIT_SRC)/drivers/ssa.cpp $(COMMAND_LINE_INTERFACE) $(TAG_DEP)

#for ssa_direct
SSA_DIRECT_DEPS = $(PARALLEL_INTERVAL_DEPS) $(PARAMETER) $(UTILITY_DEPS)  $(STOCHKIT_SRC)/drivers/ssa_direct.cpp

#for ssa_odm
SSA_ODM_DEPS = $(PARALLEL_INTERVAL_DEPS) $(PARAMETER) $(UTILITY_DEPS)  $(STOCHKIT_SRC)/drivers/ssa_odm.cpp 

#for ssa_direct_serial
SDS_DEPS= $(STOCHKIT_SRC)/drivers/ssa_direct_serial.cpp $(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS) $(SERIAL_DEPS) $(UTILITY_DEPS) 

#for ssa_odm_serial
SOS_DEPS = $(STOCHKIT_SRC)/drivers/ssa_odm_serial.cpp  $(STOCHKIT_SRC)/solvers/SSA_ODM.h \
			$(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS) $(SERIAL_DEPS) $(UTILITY_DEPS) 

#for ssa_direct_small
SDSM_DEPS= $(STOCHKIT_SRC)/drivers/ssa_direct_small.cpp $(PARALLEL_INTERVAL_DEPS) $(UTILITY_DEPS) 

#for ssa_odm_small
SOSM_DEPS = $(STOCHKIT_SRC)/drivers/ssa_odm_small.cpp $(PARALLEL_INTERVAL_DEPS) $(UTILITY_DEPS) 

#for ssa_direct_serial_small
SDSS_DEPS= $(STOCHKIT_SRC)/drivers/ssa_direct_serial_small.cpp $(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS) $(SERIAL_DEPS) $(UTILITY_DEPS) 

#for ssa_odm_serial_small
SOSS_DEPS =  $(STOCHKIT_SRC)/drivers/ssa_odm_serial_small.cpp  $(STOCHKIT_SRC)/solvers/SSA_ODM.h \
						$(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS) $(SERIAL_DEPS) $(UTILITY_DEPS) 

#for ssa_direct_mixed
SDM_DEPS =   $(STOCHKIT_SRC)/drivers/ssa_direct_mixed.cpp \
						$(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS)  $(UTILITY_DEPS) $(INPUT_MIXED_BEF_AFT_COM)

#for ssa_odm_mixed
SOM_DEPS =  $(STOCHKIT_SRC)/drivers/ssa_odm_mixed.cpp \
						$(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS)  $(UTILITY_DEPS) $(INPUT_MIXED_BEF_AFT_COM)

#for ssa_direct_events
SDE_DEPS = $(STOCHKIT_SRC)/drivers/ssa_direct_events_serial.cpp \
						$(SSA_DIRECT_EVENT_DRIVER)  $(OUTPUT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS) $(INPUT_EVENTS_BEF_COM) \
						$(SSA_DIRECT_EVENT_SOLVER) $(UTILITY_DEPS) $(PARALLEL_INTERVAL_DEPS) $(PARAMETER) $(TRIGGER)

#for ssa_direct_events_compiled
SDEC_DEPS = $(STOCHKIT_SRC)/drivers/ssa_direct_events_serial.cpp \
						$(SSA_DIRECT_EVENT_DRIVER)  $(OUTPUT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS) $(INPUT_EVENTS_BEF_COM) \
						$(SSA_DIRECT_EVENT_SOLVER) $(UTILITY_DEPS) $(PARALLEL_INTERVAL_DEPS) $(PARAMETER) $(TRIGGER)
#for ssa_direct_mixed_compiled
SDMC_DEPS =  $(STOCHKIT_SRC)/drivers/ssa_direct_mixed_serial.cpp \
						$(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(PARAMETER) $(RANDOM_DEPS) $(SERIAL_DEPS) $(INPUT_DEPS)  $(UTILITY_DEPS) 

#for ssa_direct_mixed_small_compiled
SDMSC_DEPS =  $(STOCHKIT_SRC)/drivers/ssa_direct_mixed_serial.cpp \
						$(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(PARAMETER) $(RANDOM_DEPS) $(SERIAL_DEPS) $(INPUT_DEPS)  $(UTILITY_DEPS) 

#for ssa_odm_mixed_compiled
SOMC_DEPS =  $(STOCHKIT_SRC)/drivers/ssa_odm_mixed_serial.cpp \
						$(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(PARAMETER) $(RANDOM_DEPS) $(SERIAL_DEPS) $(INPUT_DEPS)  $(UTILITY_DEPS) 

#for ssa_odm_mixed_small_compiled
SOMSC_DEPS =  $(STOCHKIT_SRC)/drivers/ssa_odm_mixed_serial_small.cpp \
						$(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(PARAMETER) $(RANDOM_DEPS) $(SERIAL_DEPS) $(INPUT_DEPS)  $(UTILITY_DEPS) 

#for ssa_direct_mixed_small
SDMS_DEPS =   $(STOCHKIT_SRC)/drivers/ssa_direct_mixed.cpp \
						$(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS)  $(UTILITY_DEPS) $(INPUT_MIXED_BEF_AFT_COM)

#for ssa_direct_mixed_small
SOMS_DEPS =   $(STOCHKIT_SRC)/drivers/ssa_odm_mixed.cpp \
						$(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(PARAMETER) $(RANDOM_DEPS) $(INPUT_DEPS)  $(UTILITY_DEPS) $(INPUT_MIXED_BEF_AFT_COM)

#for ssa_constant
SSA_COT_DEPS = $(PARALLEL_INTERVAL_DEPS) $(PARAMETER) $(UTILITY_DEPS)  $(STOCHKIT_SRC)/drivers/ssa_constant.cpp 

#for ssa_constant_serial
SCS_DEPS= $(STOCHKIT_SRC)/drivers/ssa_constant_serial.cpp $(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(CONSTANT_GROUP_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS) $(SERIAL_DEPS) $(UTILITY_DEPS) 

#for ssa_constant_mixed
SCM_DEPS =  $(STOCHKIT_SRC)/drivers/ssa_constant_mixed.cpp \
						$(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(CONSTANT_GROUP_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS)  $(UTILITY_DEPS) $(INPUT_MIXED_BEF_AFT_COM)

#for ssa_constant_mixed_compiled
SCMC_DEPS =  $(STOCHKIT_SRC)/drivers/ssa_constant_mixed_serial.cpp \
						$(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(CONSTANT_GROUP_DEPS) $(PARAMETER) \
						$(CONSTANT_TIME_HDEPS) $(RANDOM_DEPS) $(SERIAL_DEPS) $(INPUT_DEPS)  $(UTILITY_DEPS) 

#for ssa_ldm
SSA_LDM_DEPS = $(PARALLEL_INTERVAL_DEPS) $(PARAMETER) $(UTILITY_DEPS)  $(STOCHKIT_SRC)/drivers/ssa_ldm.cpp 

#for ssa_ldm_serial
SLS_DEPS= $(STOCHKIT_SRC)/drivers/ssa_ldm_serial.cpp $(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS) $(SERIAL_DEPS) $(UTILITY_DEPS) 

#for ssa_ldm_mixed
SLM_DEPS =  $(STOCHKIT_SRC)/drivers/ssa_ldm_mixed.cpp \
						$(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS) $(PARAMETER) $(UTILITY_DEPS) $(INPUT_MIXED_BEF_AFT_COM)

#for ssa_ldm_mixed_compiled
SLMC_DEPS =  $(STOCHKIT_SRC)/drivers/ssa_ldm_mixed_serial.cpp \
						$(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(LDMTREE_DEPS) $(LDM_DEPS) $(RANDOM_DEPS) $(SERIAL_DEPS) $(INPUT_DEPS)  $(UTILITY_DEPS) 

#for ssa_nrm
SSA_nrm_DEPS = $(PARALLEL_INTERVAL_DEPS) $(PARAMETER) $(UTILITY_DEPS)  $(STOCHKIT_SRC)/drivers/ssa_nrm.cpp 

#for ssa_nrm_serial
SNS_DEPS= $(STOCHKIT_SRC)/drivers/ssa_nrm_serial.cpp $(STOCHKIT_SRC)/solvers/BinHeap.h $(STOCHKIT_SRC)/solvers/BinHeap.cpp $(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS) $(SERIAL_DEPS) $(UTILITY_DEPS) 

#for ssa_nrm_mixed
SNM_DEPS =  $(STOCHKIT_SRC)/drivers/ssa_nrm_mixed.cpp $(STOCHKIT_SRC)/solvers/BinHeap.h $(STOCHKIT_SRC)/solvers/BinHeap.cpp \
						$(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS) $(PARAMETER) $(UTILITY_DEPS) $(INPUT_MIXED_BEF_AFT_COM)

#for ssa_nrm_mixed_compiled
SNMC_DEPS =  $(STOCHKIT_SRC)/drivers/ssa_nrm_mixed_serial.cpp $(STOCHKIT_SRC)/solvers/BinHeap.h $(STOCHKIT_SRC)/solvers/BinHeap.cpp \
						$(OUTPUT_DEPS) $(SSA_DIRECT_DEPS) $(RANDOM_DEPS) $(SERIAL_DEPS) $(INPUT_DEPS)  $(UTILITY_DEPS) 

#for tau_leaping
TAUL_DEPS = $(STOCHKIT_SRC)/drivers/tau_leaping.cpp $(COMMAND_LINE_INTERFACE) $(TAG_DEP)

#for tau_leaping_exp_adapt
TAUL_EXP_ADAPT_DEPS = $(STOCHKIT_SRC)/drivers/tau_leaping_exp_adapt.cpp $(PARALLEL_INTERVAL_DEPS) $(UTILITY_DEPS)

#for tau_leaping_exp_adapt_serial
TLEAS_DEPS = $(STOCHKIT_SRC)/drivers/tau_leaping_exp_adapt_serial.cpp \
			$(OUTPUT_DEPS)  $(SSA_DIRECT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS) $(COMMAND_LINE_INTERFACE) \
			$(TAUL_EXP_ADP_DEPS) $(PARALLEL_INTERVAL_DEPS)  $(SERIAL_DEPS) $(UTILITY_DEPS) 

#for tau_leaping_exp_adapt_mixed
TLEAM_DEPS = $(STOCHKIT_SRC)/drivers/tau_leaping_exp_adapt_mixed.cpp \
			$(OUTPUT_DEPS) $(TAUL_EXP_ADP_DEPS) $(SSA_DIRECT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS) $(COMMAND_LINE_INTERFACE) \
			$(INPUT_MIXED_BEF_AFT_COM) $(UTILITY_DEPS) 

#for tau_leaping_exp_adapt_mixed_compiled
TEAM_DEPS = $(STOCHKIT_SRC)/drivers/tau_leaping_exp_adapt_mixed_compiled.cpp \
			$(OUTPUT_DEPS) $(TAUL_EXP_ADP_DEPS) $(SSA_DIRECT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS)  $(SERIAL_DEPS) $(COMMAND_LINE_INTERFACE) \
			$(UTILITY_DEPS) 

