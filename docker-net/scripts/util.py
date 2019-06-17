#!/usr/bin/env python

import subprocess
import os, sys
from os.path import join, dirname
from dotenv import load_dotenv
from sqlalchemy import create_engine

sys.path.insert(0, '../stochss/')
import stochss.orm

load_dotenv(join(dirname(__file__), '../secrets/postgres.env'))

POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')

MODELS_DB='models'
POSTGRES_USER='postgres'
POSTGRES_PORT=5432

# This command requires the CLI utility jq
DB_HOST_IP_COMMAND="""docker network inspect jupyterhub-network \
	| jq '.[0].Containers[] | select(.Name == "jupyterhub-db") | .IPv4Address' \
 	| sed 's/\/16//' \
	| sed 's/"//g'"""


def get_db_url():
    proc = subprocess.Popen([DB_HOST_IP_COMMAND], stdout=subprocess.PIPE, shell=True, encoding='utf-8')
    out, err = proc.communicate()
    DB_HOST_IP = out.rstrip()

    return "postgresql://{0}:{1}@{2}/{3}".format(
            POSTGRES_USER, POSTGRES_PASSWORD, DB_HOST_IP, MODELS_DB
    )


def create_db():
    orm.create_db(get_db_url())

