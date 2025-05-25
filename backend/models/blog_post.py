from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

# ✅ BlogPost database model
class BlogPost(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    slug: str = Field(index=True, unique=True)
    content: str
    tags: str  # comma-separated, e.g., "ai,stocks,trading"
    author: Optional[str] = Field(default=None)
    image_url: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ✅ BlogPost creation schema
class BlogPostCreate(SQLModel):
    title: str
    slug: str
    content: str
    tags: str
    author: Optional[str] = None
    image_url: Optional[str] = None
