import os
from libsbml import *
import readValidate

def convert(args):
    readValidate.main(args);
    document = readSBML(args[1]);
    model=document.getModel();
    numOfTabs=0;
    generatedCode='import os\n'+'from model import *\n'+'from stochkit import *\n'+'\n';
    generatedCode+='def '+model.getId()+'(model_name=""):\n';

    #model name
    numOfTabs+=1;
    tabList='   '*numOfTabs;
    generatedCode+=tabList+'if model_name == "":\n'
    numOfTabs+=1;
    tabList='   '*numOfTabs;
    generatedCode+=tabList+'model_name = "'+model.getId()+'";\n';
    numOfTabs-=1;
    tabList='   '*numOfTabs;
    generatedCode+=tabList+'model = StochKitModel(name=model_name);\n'

    #species
    generatedCode+='\n'+tabList+'# Species\n';
    speciesNames='';
    numOfSpecies=model.getNumSpecies();
    i=0;
    while i<numOfSpecies:
        species=model.getSpecies(i);
        name=species.getId();
        speciesNames+=name+',';
        value=species.getInitialAmount();
        generatedCode+=tabList+name+' = Species(name="'+name+'",initial_value='+str(value)+');\n';
        i+=1;
    speciesNames=speciesNames[:len(speciesNames)-1];#remove the last ','
    generatedCode+='\n'+tabList+'model.addSpecies(['+speciesNames+']);\n';

    #parameters
    generatedCode+='\n'+tabList+'# Parameters\n';

        #global parameters
    parameterNames='';
    numOfParameters=model.getNumParameters();
    i=0;
    while i<numOfParameters:
        parameter=model.getParameter(i);
        name=parameter.getId();
        parameterNames+=name+',';
        value=parameter.getValue();
        generatedCode+=tabList+name+' = Parameter(name="'+name+'",expression='+str(value)+');\n';
        i+=1;

        #local parameters
    numOfReactions=model.getNumReactions();
    i=0;
    while i<numOfReactions:
        reaction=model.getReaction(i);
        kineticLaw=reaction.getKineticLaw();
        numOfParameters=kineticLaw.getNumParameters();
        j=0;
        while j<numOfParameters:
            parameter=kineticLaw.getParameter(j);
            name=parameter.getId();
            parameterNames+=name+',';
            value=parameter.getValue();
            generatedCode+=tabList+name+' = Parameter(name="'+name+'",expression='+str(value)+');\n';
            j+=1;
        i+=1;
    parameterNames=parameterNames[:len(parameterNames)-1];#remove the last ','
    generatedCode+='\n'+tabList+'model.addParameter(['+parameterNames+']);\n';

    #reactions
    generatedCode+='\n'+tabList+'# Reactions\n';
    reactionNames='';
    numOfReactions=model.getNumReactions();#this is not necessary since we already have the value
    i=0;
    while i<numOfReactions:
        reaction=model.getReaction(i);
        name=reaction.getId();
        reactionNames+=name+',';

        #get reactants
        reactantNames='';
        numOfReactants=reaction.getNumReactants();
        j=0;
        while j<numOfReactants:
            species=reaction.getReactant(j);
            reactantNames+=species.getSpecies()+':'+str(species.getStoichiometry())+',';
            j+=1;
        reactantNames=reactantNames[:len(reactantNames)-1];#remove the last ','

        #get products
        productNames='';
        numOfProducts=reaction.getNumProducts();
        j=0;
        while j<numOfProducts:
            species=reaction.getProduct(j);
            productNames+=species.getSpecies()+':'+str(species.getStoichiometry())+',';
            j+=1;
        productNames=productNames[:len(productNames)-1];#remove the last ','

        #propensity
        kineticLaw=reaction.getKineticLaw();
        propensity=kineticLaw.getFormula();

        generatedCode+=tabList+name+' = Reaction(name="'+name+'",reactants={'+reactantNames+'},products={'+productNames+'}, propensity_function="'+propensity+'");\n';
        i+=1;
    reactionNames=reactionNames[:len(reactionNames)-1];#remove the last ','
    generatedCode+='\n'+tabList+'model.addReaction(['+reactionNames+']);\n';
    generatedCode+='\n'+tabList+'return model;\n';

    file=os.path.dirname(args[1])+'/'+model.getId()+'.py';
    f=open(file,'w+');
    f.write(generatedCode);
    f.close();
if __name__ == '__main__':
  convert(sys.argv)  