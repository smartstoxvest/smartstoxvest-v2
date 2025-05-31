import sys
import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# 👇 Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# ✅ Import your models and engine
from models.user import User
from models.blog_post import BlogPost
from sqlmodel import SQLModel
from db import engine

# Load alembic.ini config
config = context.config

# Set up loggers
fileConfig(config.config_file_name)

# ✅ This is the key part
target_metadata = SQLModel.metadata
