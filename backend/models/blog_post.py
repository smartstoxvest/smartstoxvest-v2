from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

# ✅ BlogPost table model
class BlogPost(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    slug: str
    content: str
    tags: str  # comma-separated
    author: Optional[str] = None
    image_url: Optional[str] = None  # ✅ add this!
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ✅ BlogPostCreate input model
class BlogPostCreate(SQLModel):
    title: str
    slug: str
    content: str
    tags: str
    author: Optional[str] = None
    image_url: Optional[str] = None  # ✅ add this too!
