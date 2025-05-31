# models/user.py
from sqlmodel import SQLModel, Field
from typing import Optional

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: Optional[str] = None  # 👈 For Google login
    provider: Optional[str] = Field(default="email")  # 👈 Track auth source
