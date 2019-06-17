#!/usr/bin/env python

import subprocess
import os, sys
from os.path import join, dirname
from sqlalchemy import create_engine
from dotenv import load_dotenv

from stochss import orm

load_dotenv()

def create_db(db_url):
    engine = create_engine(db_url, echo=True)
    Base.metadata.create_all(engine)
  
if __name__ = "__main__":
    create_db(DB_CONNECT)
