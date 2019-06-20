
from contextlib import contextmanager
import json

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, select, Table, Column, MetaData, ForeignKey, Boolean, Integer, String, DateTime, Float

import sys
from orm import Model, ModelVersion, Specie, Parameter, Reaction, Reactant, Product, SimSettings

import logging as log

Session = sessionmaker()

def _db(settings):
    url = settings['config']['StochSS']['db_url']
    db = DatabaseManager(url)
    return db

def checkUserOrRaise(self):
    user = self.current_user
    if user is None:
        user = self.get_current_user_oauth_token()
        if user is None:
            raise web.HTTPError(403)

class DatabaseManager():

    def __init__(self, db_url):
        self.engine = create_engine(db_url)
        Session.configure(bind=self.engine)

    @contextmanager
    def _session_scope(self):
        session = Session()
        try:
            yield session
            session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close()


    def _get_data_by_id(self, iterable, id):
        iter_with_ids = self._filter_data_by_has_id(iterable)
        result = list(filter(lambda d: d['id'] == id, iter_with_ids))
        if len(result):
            return result[0]
        else:
            return None


    def _filter_data_by_no_id(self, iterable):
        return list(filter(lambda d: 'id' not in d, iterable))


    def _filter_data_by_has_id(self, iterable):
        return list(filter(lambda d: 'id' in d, iterable))


    def get_models_by_user(self, username='popensesame'):
        with self._session_scope() as session:
            _result = session.query(Model).filter_by(username=username).all()
            result = str(_result)
        return result


    def get_model_by_model_id(self, model_id):
        with self._session_scope() as session:
            _result = session.query(Model).filter_by(id=model_id)[0]
            if not _result:
                result = None
            else:
                result = str(_result)
        return result


    def get_model_version(self, model_id, version):
        with self._session_scope() as session:
            _result = session.query(ModelVersion).filter_by(model_id=model_id, version=version)[0]
            if not _result:
                result = None
            else:
                result = str(_result)
        return result


    def update_model(self, data):
        model_id = data['id']
        # TODO refactor get_model_by_model_id so we're not repeating ourselves
        with self._session_scope() as session:
            model = session.query(Model).filter_by(id=model_id).one()
            if not model:
                raise
            model.name = data['name']
            model.is_spatial = data['is_spatial']
            for version in model.versions:
                v_data = self._get_data_by_id(data['versions'], version.id)
                self.update_model_version(version, v_data, session)
            session.commit()
            return str(model)



    def update_model_version(self, version, data, session):
        for specie in version.species: 
            s_data = self._get_data_by_id(data['species'], specie.id)
            # If s_data is None, the specie was deleted client-side
            self.update_specie(specie, s_data, session)

        new_species_data = self._filter_data_by_no_id(data['species'])
        new_species = self.new_species_list(new_species_data, version.model)
        version.species.extend(new_species)

        for param in version.parameters:
            p_data = self._get_data_by_id(data['parameters'], param.id)
            self.update_parameter(param, p_data, session)

        new_params_data = self._filter_data_by_no_id(data['parameters'])
        new_params = self.new_parameter_list(new_params_data, version.model)
        version.parameters.extend(new_params)
        
        for reaction in version.reactions:
            r_data = self._get_data_by_id(data['reactions'], reaction.id)
            self.update_reaction(
                    reaction,
                    r_data,
                    version.species,
                    version.parameters,
                    version,
                    session
            )

        new_reactions_data = self._filter_data_by_no_id(data['reactions'])
        new_reactions = self.new_reaction_list(
                new_reactions_data,
                version.species,
                version.model,
                version.parameters,
                version
        )
        version.reactions.extend(new_reactions)

        self.update_simSettings(version.simSettings, data['simSettings'], session)


    def update_reaction(self, reaction, data, species, parameters, version, session):
        if data:
            self.update_stoich_species(reaction.reactants, data['reactants'], species, 'reactant', version, session)
            self.update_stoich_species(reaction.products, data['products'], species, 'product', version, session)
            self.update_reaction_rate(reaction, data['rate'], parameters)
            reaction.annotation = data['annotation']
            reaction.massaction = data['massaction']
            reaction.name = data['name']
            reaction.type = data['type']
            reaction.subdomains = ','.join(data['subdomains'])
        else:
            session.delete(reaction)


    def update_reaction_rate(self, reaction, r_data, parameters):
        param = list(filter(lambda p: p.name == r_data['name'], parameters))[0]
        reaction.rate = param


    def update_stoich_species(self, stoich_species, data, species, stoich_type, version, session):
        for stoich_specie in stoich_species:
            ss_data = self._get_data_by_id(data, stoich_specie.id)
            self.update_stoich_specie(stoich_specie, ss_data, species, session)
        new_stoich_species_data = self._filter_data_by_no_id(data)
        new_stoich_species = self.new_stoich_species_list(
                new_stoich_species_data,
                stoich_type,
                species,
                version.model,
                version
        )
        stoich_species.extend(new_stoich_species)


    def update_stoich_specie(self, stoich_specie, data, species, session):
        if data:
            stoich_specie.ratio = data['ratio']
            specie = list(filter(lambda s: s.name == data['specie']['name'], species))[0]
            stoich_specie.specie = specie
        else:
            session.delete(stoich_specie)


    def update_parameter(self, param, data, session):
        if data:
            param.name = data['name']
            param.value = data['value']
        else:
            session.delete(param)


    def update_specie(self, specie, data, session):
        if data:
            specie.name = data['name']
            specie.value = data['nonspatialSpecies']['value']
            specie.mode = data['nonspatialSpecies']['mode']
            specie.diffusionCoeff = data['spatialSpecies']['diffusionCoeff']
            specie.subdomains = ','.join(data['spatialSpecies']['subdomains'])
        else:
            # No data for specie, so it's been deleted
            session.delete(specie)


    def update_simSettings(self, simSettings, data, session):
        simSettings.is_stochastic = data['is_stochastic']
        simSettings.endSim = data['endSim']
        simSettings.timeStep = data['timeStep']
        simSettings.realizations = data['stochasticSettings']['realizations']
        simSettings.algorithms = data['stochasticSettings']['algorithm']
        simSettings.ssaSeed = data['stochasticSettings']['ssaSettings']['seed']
        simSettings.tauSeed = data['stochasticSettings']['tauLeapingSettings']['seed']
        simSettings.tauTolerance = data['stochasticSettings']['tauLeapingSettings']['tauTolerance']
        simSettings.hybridSeed = data['stochasticSettings']['hybridTauSettings']['seed']
        simSettings.hybridTolerance = data['stochasticSettings']['hybridTauSettings']['tauTolerance']
        simSettings.switchingTolerance = data['stochasticSettings']['hybridTolerance']['switchingTolerance']
        simSettings.relativeTolerance = data['deterministicSettings']['relativeTolerance']
        simSettings.absoluteTolerance = data['deterministicSettings']['absoluteTolerance']


    def insert_model(self, data):
        with self._session_scope() as session:
            model = self.new_model(data)
            versions = self.new_model_version_list(model, data['versions'])
            model.versions = versions
            session.add(model)
            session.commit()
            return str(model)


    def new_model(self, data):
        model = Model(
            name=data['name'],
            latest_version=data['latest_version'],
            username=data['username'],
            public=data['public'],
            is_stochastic=False,
            is_spatial=data['is_spatial']
        )
        return model
  

    def new_model_version_list(self, model, versions_data):
        versions = []
        for version_data in versions_data:
            version = self.new_model_version(model, version_data)
            versions.append(version)
        return versions
        

    def new_model_version(self, model, version_data):
        version = ModelVersion(version=version_data['version'])
        species = self.new_species_list(version_data['species'], model)
        parameters = self.new_parameter_list(version_data['parameters'], model)
        reactions = self.new_reaction_list(version_data['reactions'], species, model, parameters, version)
        version.species = species
        version.parameters = parameters
        version.reactions = reactions
        simSettings = self.new_simSettings(version_data['simSettings'], model, version)
        version.simSettings = [simSettings]
        return version


    def new_reaction_list(self, reactions_data, species, model, parameters, version):
        reactions = []
        for reaction_data in reactions_data:
            reaction = self.new_reaction(reaction_data, model, species, parameters, version)
            reactions.append(reaction)
        return reactions

    
    def new_reaction(self, reaction_data, model, species, params, version):
        reaction = Reaction(
                 name=reaction_data['name'],
                 annotation=reaction_data['annotation'],
                 massaction=reaction_data['massaction'],
                 reaction_type=reaction_data['reaction_type'],
                 propensity=reaction_data['propensity'],
                 subdomains=','.join(reaction_data['subdomains'])
        )
        rate = list(filter(lambda p: p.name == reaction_data['rate']['name'], params))[0]
        reaction.rate = rate
        reaction.model = model
        reactants = self.new_stoich_species_list(reaction_data['reactants'], 'reactant', species, model, version)
        products = self.new_stoich_species_list(reaction_data['products'], 'product', species, model, version)
        reaction.reactants = reactants
        reaction.products = products
        return reaction


    def new_stoich_species_list(self, stoich_species_data, stoich_type, species, model, version):
        stoich_species = []
        for stoich_specie_data in stoich_species_data:
            stoich_specie = self.new_stoich_specie(stoich_specie_data, stoich_type, species, model, version)
            stoich_species.append(stoich_specie)
        return stoich_species

    
    def new_stoich_specie(self, stoich_specie_data, stoich_type, species, model, version):  
        constructor = Reactant if stoich_type == 'reactant' else Product
        stoich_specie = constructor(ratio=stoich_specie_data['ratio'])
        specie = list(filter(lambda s: s.name == stoich_specie_data['specie']['name'], species))[0]
        stoich_specie.specie = specie
        stoich_specie.model = model
        stoich_specie.version = version
        return stoich_specie


    def new_parameter_list(self, params_data, model):
        parameters = []
        for param_data in params_data:
            param = self.new_parameter(param_data, model)
            parameters.append(param)
        return parameters


    def new_parameter(self, param_data, model):
        param = Parameter(name=param_data['name'], value=param_data['value'])
        param.model = model
        return param


    def new_species_list(self, species_data, model):
        species = []
        for specie_data in species_data:
            specie = self.new_specie(specie_data, model)
            species.append(specie)
        return species


    def new_specie(self, specie_data, model):
        specie = Specie(
                name=specie_data['name'],
                value=specie_data['nonspatialSpecies']['value'],
                mode=specie_data['nonspatialSpecies']['mode'],
                diffusionCoeff=specie_data['spatialSpecies']['diffusionCoeff'],
                subdomains=','.join(specie_data['spatialSpecies']['subdomains'])
        )
        # DB schema was set up to have model_id (foreign key) on every table.
        # We have to set the model here to pick up the model_id.
        specie.model = model
        return specie


    def new_simSettings(self, simSettings_data, model, version):
        simSettings = SimSettings(
                is_stochastic=simSettings_data['is_stochastic'],
                endSim=simSettings_data['endSim'],
                timeStep=simSettings_data['timeStep'],
                realizations=simSettings_data['stochasticSettings']['realizations'],
                algorithm=simSettings_data['stochasticSettings']['algorithm'],
                ssaSeed=simSettings_data['stochasticSettings']['ssaSettings']['seed'],
                tauSeed=simSettings_data['stochasticSettings']['tauLeapingSettings']['seed'],
                hybridSeed=simSettings_data['stochasticSettings']['hybridTauSettings']['seed'],
                tauTolerance=simSettings_data['stochasticSettings']['tauLeapingSettings']['tauTolerance'],
                hybridTolerance=simSettings_data['stochasticSettings']['hybridTauSettings']['tauTolerance'],
                switchingTolerance=simSettings_data['stochasticSettings']['hybridTauSettings']['switchingTolerance'],
                relativeTolerance=simSettings_data['deterministicSettings']['relativeTolerance'],
                absoluteTolerance=simSettings_data['deterministicSettings']['absoluteTolerance']
        )
        simSettings.model = model
        simSettings.version = version
        return simSettings

