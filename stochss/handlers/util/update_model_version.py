def get_template():
    model = {}

    model['resultsSettings'] = {"mapper":"final",
                                "reducer":"avg",
                                "outputs":{}}

    return model


def update_model(model, template):
    mdl_keys = list(model.keys())
    tmp_keys = list(template.keys())

    for key in tmp_keys:
        if not key in mdl_keys:
            model[key] = template[key]


def update_model_version(model):
    template = get_template()

    update_model(model, template)

