# db.py
from sqlmodel import create_engine, Session, SQLModel
from models import User, BlogPost  # ✅ import your models

sqlite_file_name = "blog.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)

# ✅ For FastAPI dependency injection
def get_session():
    with Session(engine) as session:
        yield session
