include .make/makefile.c

STOCHKIT_SRC = $(STOCHKIT_HOME)/src
STOCHKIT_BIN = $(STOCHKIT_HOME)/bin

STOCHKIT_EXE = SSA\
			TAU

all: $(STOCHKIT_EXE)

UTILITY:
	cd $(STOCHKIT_SRC); $(MAKE) stochkit_utility

SSA: UTILITY
	cd $(STOCHKIT_SRC); $(MAKE) stochkit_ssa

TAU: UTILITY
	cd $(STOCHKIT_SRC); $(MAKE) stochkit_tau

clean:
	bash -c 'if [ "$(STOCHKIT_HOME)" != "" ]; then rm -f $(STOCHKIT_BIN)/* $(STOCHKIT_SRC)/core*  $(STOCHKIT_OBJ)/* $(STOCHKIT_UTILITY)/*.gch; else echo "Need to set STOCHKIT_HOME environment variable"; fi'
