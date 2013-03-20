#utility
_RANDOM_SRC = Random.cpp
_UTILITY_SRC = StandardDriverUtilities.cpp CommandLineInterface.cpp 
_TRIGGER =  TimeBasedTrigger.cpp
_COMMAND_LINE_INTERFACE_SRC = CommandLineInterface.cpp
_STD_DRIVER_UT_SRC = StandardDriverUtilities.cpp
_PRECOMPILED_HEADER_SRC = boost_headers.h

_RANDOM_OBJ = Random.o
_COMMAND_LINE_INTERFACE_OBJ = CommandLineInterface.o
_STD_DRIVER_UT_OBJ = StandardDriverUtilities.o
_STD_DRIVER_UT_EVENTS_OBJ = StandardDriverUtilities_EVENTS.o

RANDOM_SRC  =  $(patsubst %,$(STOCHKIT_SRC)/utility/%,$(_RANDOM_SRC))
UTILITY_SRC =  $(patsubst %,$(STOCHKIT_SRC)/utility/%,$(_UTILITY_SRC))
TRIGGER      =  $(patsubst %,$(STOCHKIT_SRC)/utility/%,$(_TRIGGER))
COMMAND_LINE_INTERFACE_SRC  =  $(patsubst %,$(STOCHKIT_SRC)/utility/%,$(_COMMAND_LINE_INTERFACE_SRC))
STD_DRIVER_UT_SRC =  $(patsubst %,$(STOCHKIT_SRC)/utility/%,$(_STD_DRIVER_UT_SRC))
PRECOMPILED_HEADER_SRC =  $(patsubst %,$(STOCHKIT_SRC)/utility/%,$(_PRECOMPILED_HEADER_SRC))

RANDOM_OBJ  =  $(patsubst %,$(STOCHKIT_OBJ)/%,$(_RANDOM_OBJ))
COMMAND_LINE_INTERFACE_OBJ  =  $(patsubst %,$(STOCHKIT_OBJ)/%,$(_COMMAND_LINE_INTERFACE_OBJ))
STD_DRIVER_UT_OBJ =  $(patsubst %,$(STOCHKIT_OBJ)/%,$(_STD_DRIVER_UT_OBJ))
STD_DRIVER_UT_EVENTS_OBJ =  $(patsubst %,$(STOCHKIT_OBJ)/%,$(_STD_DRIVER_UT_EVENTS_OBJ))

#output
#_OUTPUT_SRC = StatsOutput.h  IntervalOutput.h StandardDriverOutput.h
#OUTPUT_SRC =  $(patsubst %,$(STOCHKIT_SRC)/output/%,$(_OUTPUT_SRC))

#model_parser
_INPUT_SRC = StringCalculator.cpp 
_PARAMETER_SRC = Parameter.cpp

INPUT_SRC = $(patsubst %,$(STOCHKIT_SRC)/model_parser/%,$(_INPUT_SRC))
PARAMETER_SRC = $(patsubst %,$(STOCHKIT_SRC)/model_parser/%,$(_PARAMETER_SRC))

_INPUT_OBJ = StringCalculator.o
_PARAMETER_OBJ = Parameter.o

INPUT_OBJ = $(patsubst %,$(STOCHKIT_OBJ)/%,$(_INPUT_OBJ))
PARAMETER_OBJ = $(patsubst %,$(STOCHKIT_OBJ)/%,$(_PARAMETER_OBJ))

#drivers
_PARALLEL_INTERVAL_SRC = ParallelIntervalSimulation.cpp

PARALLEL_INTERVAL_SRC =  $(patsubst %,$(STOCHKIT_SRC)/drivers/%,$(_PARALLEL_INTERVAL_SRC))

_PARALLEL_INTERVAL_OBJ = ParallelIntervalSimulation.o

PARALLEL_INTERVAL_OBJ =  $(patsubst %,$(STOCHKIT_OBJ)/%,$(_PARALLEL_INTERVAL_OBJ))

#solvers
_SSA_DIRECT_EVENT_SRC = ssa_direct_events.cpp 
_SSA_DIRECT_SRC = SSA_Direct.ipp
_CONSTANT_GROUP_SRC = ConstantTimeGroup.cpp
_CONSTANT_GROUP_COLLECTION_SRC = ConstantTimeGroupCollection.cpp

SSA_DIRECT_EVENT_SRC = $(patsubst %,$(STOCHKIT_SRC)/drivers/%,$(_SSA_DIRECT_EVENT_SRC))
SSA_DIRECT_SRC = $(patsubst %,$(STOCHKIT_SRC)/solvers/%,$(_SSA_DIRECT_SRC))
CONSTANT_GROUP_SRC = $(patsubst %,$(STOCHKIT_SRC)/solvers/%,$(_CONSTANT_GROUP_SRC))
CONSTANT_GROUP_COLLECTION_SRC = $(patsubst %,$(STOCHKIT_SRC)/solvers/%,$(_CONSTANT_GROUP_COLLECTION_SRC))

_CONSTANT_GROUP_OBJ = ConstantTimeGroup.o
_CONSTANT_GROUP_COLLECTION_OBJ = ConstantTimeGroupCollection.o

CONSTANT_GROUP_OBJ = $(patsubst %,$(STOCHKIT_OBJ)/%,$(_CONSTANT_GROUP_OBJ))
CONSTANT_GROUP_COLLECTION_OBJ = $(patsubst %,$(STOCHKIT_OBJ)/%,$(_CONSTANT_GROUP_COLLECTION_OBJ))

#for ssa
SSA_SRC = $(STOCHKIT_SRC)/drivers/ssa.cpp $(COMMAND_LINE_INTERFACE_OBJ) 

#for ssa_direct
SSA_DIRECT_SRC =  $(STOCHKIT_SRC)/drivers/ssa_direct.cpp $(PARALLEL_INTERVAL_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ) 

#for ssa_odm
SSA_ODM_SRC =  $(STOCHKIT_SRC)/drivers/ssa_odm.cpp $(PARALLEL_INTERVAL_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for ssa_direct_serial
SDS_SRC =  $(STOCHKIT_SRC)/drivers/ssa_direct_serial.cpp $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for ssa_odm_serial
SOS_SRC =  $(STOCHKIT_SRC)/drivers/ssa_odm_serial.cpp $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ) 

#for ssa_direct_small
SDSM_SRC =   $(STOCHKIT_SRC)/drivers/ssa_direct_small.cpp $(PARALLEL_INTERVAL_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ) 

#for ssa_odm_small
SOSM_SRC = $(STOCHKIT_SRC)/drivers/ssa_odm_small.cpp $(PARALLEL_INTERVAL_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ) 

#for ssa_direct_serial_small
SDSS_SRC =  $(STOCHKIT_SRC)/drivers/ssa_direct_serial_small.cpp  $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for ssa_odm_serial_small
SOSS_SRC = $(STOCHKIT_SRC)/drivers/ssa_odm_serial_small.cpp  $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for ssa_direct_mixed
SDM_SRC = $(STOCHKIT_SRC)/drivers/ssa_direct_mixed.cpp $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ) $(PARALLEL_INTERVAL_OBJ)

#for ssa_odm_mixed
SOM_SRC = $(STOCHKIT_SRC)/drivers/ssa_odm_mixed.cpp $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ) $(PARALLEL_INTERVAL_OBJ)

#for ssa_direct_events
SDE_SRC =  $(STOCHKIT_SRC)/drivers/ssa_direct_events.cpp $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_EVENTS_OBJ) $(INPUT_OBJ) $(PARALLEL_INTERVAL_OBJ)

#for ssa_direct_events_compiled
SDEC_SRC =  $(STOCHKIT_SRC)/drivers/ssa_direct_events_serial.cpp $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_EVENTS_OBJ) $(INPUT_OBJ) $(PARALLEL_INTERVAL_OBJ) $(TRIGGER)

#for ssa_direct_mixed_compiled
SDMC_SRC = $(STOCHKIT_SRC)/drivers/ssa_direct_mixed_serial.cpp  $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for ssa_direct_mixed_small_compiled
SDMSC_SRC = $(STOCHKIT_SRC)/drivers/ssa_direct_mixed_serial.cpp  $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for ssa_odm_mixed_compiled
SOMC_SRC = $(STOCHKIT_SRC)/drivers/ssa_odm_mixed_serial.cpp  $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for ssa_odm_mixed_small_compiled
SOMSC_SRC = $(STOCHKIT_SRC)/drivers/ssa_odm_mixed_serial_small.cpp  $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for ssa_direct_mixed_small
SDMS_SRC = $(STOCHKIT_SRC)/drivers/ssa_direct_mixed_small.cpp $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ) $(PARALLEL_INTERVAL_OBJ)

#for ssa_odm_mixed_small
SOMS_SRC = $(STOCHKIT_SRC)/drivers/ssa_odm_mixed_small.cpp $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ) $(PARALLEL_INTERVAL_OBJ)

#for ssa_constant
SSA_COT_SRC =  $(STOCHKIT_SRC)/drivers/ssa_constant.cpp $(PARALLEL_INTERVAL_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for ssa_constant_serial
SCS_SRC =  $(STOCHKIT_SRC)/drivers/ssa_constant_serial.cpp $(RANDOM_OBJ) $(CONSTANT_GROUP_OBJ) $(CONSTANT_GROUP_COLLECTION_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for ssa_constant_mixed
SCM_SRC = $(STOCHKIT_SRC)/drivers/ssa_constant_mixed.cpp $(RANDOM_OBJ) $(CONSTANT_GROUP_OBJ) $(CONSTANT_GROUP_COLLECTION_OBJ) \
		$(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ) $(PARALLEL_INTERVAL_OBJ)

#for ssa_constant_mixed_compiled
SCMC_SRC = $(STOCHKIT_SRC)/drivers/ssa_constant_mixed_serial.cpp  $(RANDOM_OBJ) $(CONSTANT_GROUP_OBJ) $(CONSTANT_GROUP_COLLECTION_OBJ) \
		$(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for ssa_ldm
SSA_LDM_SRC =  $(STOCHKIT_SRC)/drivers/ssa_ldm.cpp $(PARALLEL_INTERVAL_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for ssa_ldm_serial
SLS_SRC =  $(STOCHKIT_SRC)/drivers/ssa_ldm_serial.cpp $(STOCHKIT_SRC)/solvers/LDMTree.cpp \
			$(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for ssa_ldm_mixed
SLM_SRC = $(STOCHKIT_SRC)/drivers/ssa_ldm_mixed.cpp $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ) $(PARALLEL_INTERVAL_OBJ)

#for ssa_ldm_mixed_compiled
SLMC_SRC = $(STOCHKIT_SRC)/drivers/ssa_ldm_mixed_serial.cpp  $(STOCHKIT_SRC)/solvers/LDMTree.cpp $(PARAMETER_OBJ) $(RANDOM_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for ssa_nrm
SSA_nrm_SRC =  $(STOCHKIT_SRC)/drivers/ssa_nrm.cpp $(STOCHKIT_SRC)/solvers/BinHeap.cpp $(PARALLEL_INTERVAL_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for ssa_nrm_serial
SNS_SRC =  $(STOCHKIT_SRC)/drivers/ssa_nrm_serial.cpp $(STOCHKIT_SRC)/solvers/BinHeap.cpp \
			$(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for ssa_nrm_mixed
SNM_SRC = $(STOCHKIT_SRC)/drivers/ssa_nrm_mixed.cpp $(STOCHKIT_SRC)/solvers/BinHeap.cpp $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ) $(PARALLEL_INTERVAL_OBJ)

#for ssa_nrm_mixed_compiled
SNMC_SRC = $(STOCHKIT_SRC)/drivers/ssa_nrm_mixed_serial.cpp $(STOCHKIT_SRC)/solvers/BinHeap.cpp $(PARAMETER_OBJ) $(RANDOM_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for tau_leaping
TAUL_SRC = $(STOCHKIT_SRC)/drivers/tau_leaping.cpp $(COMMAND_LINE_INTERFACE_OBJ) 

#for tau_leaping_exp_adapt
TAUL_EXP_ADAPT_SRC =  $(STOCHKIT_SRC)/drivers/tau_leaping_exp_adapt.cpp $(PARALLEL_INTERVAL_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ)

#for tau_leaping_exp_adapt_serial
TLEAS_SRC =  $(STOCHKIT_SRC)/drivers/tau_leaping_exp_adapt_serial.cpp $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ) 

#for tau_leaping_exp_adapt_mixed
TLEAM_SRC =  $(STOCHKIT_SRC)/drivers/tau_leaping_exp_adapt_mixed.cpp $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ) $(PARALLEL_INTERVAL_OBJ)

#for tau_leaping_exp_adapt_mixed_compiled
TEAMC_SRC =  $(STOCHKIT_SRC)/drivers/tau_leaping_exp_adapt_mixed_serial.cpp $(RANDOM_OBJ) $(PARAMETER_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(STD_DRIVER_UT_OBJ) $(INPUT_OBJ) $(PARALLEL_INTERVAL_OBJ)

