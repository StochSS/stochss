#!/usr/bin/env python

import subprocess
import os, sys
from os.path import join, dirname
from sqlalchemy import create_engine
from dotenv import load_dotenv
import sqlite3
import click

import handlers.orm as orm

#load_dotenv()
FORMAT_DB_CONNECT='sqlite:///{0}.sqlite'

@click.command()
@click.argument('filename', default='stochssdb', type=click.STRING)
def main(filename):
    c = sqlite3.connect('./{0}.sqlite'.format(filename))
    c.close()
    db_url = FORMAT_DB_CONNECT.format(filename)
    engine = create_engine(db_url, echo=True)
    orm.Base.metadata.create_all(engine)


if __name__ == "__main__":
    main()
