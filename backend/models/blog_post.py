from __future__ import annotations

from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


# ✅ Database table model
class BlogPost(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    # Core content
    title: str = Field(index=True)
    slug: str = Field(index=True, unique=True)
    content: str
    tags: str  # comma-separated, e.g., "ai,stocks,trading"

    # SEO / cards
    excerpt: Optional[str] = Field(default=None)                 # short summary for cards/meta
    cover_image_url: Optional[str] = Field(default=None)         # featured image for cards/OG
    image_url: Optional[str] = Field(default=None)               # legacy field (kept for compat)
    author: Optional[str] = Field(default="SmartStoxVest Team")

    # Publish lifecycle
    is_published: bool = Field(default=True)
    published_at: datetime = Field(default_factory=datetime.utcnow)

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ✅ Create schema (request body for POST)
class BlogPostCreate(SQLModel):
    title: str
    slug: str
    content: str
    tags: str

    # Optional SEO / cards
    excerpt: Optional[str] = None
    cover_image_url: Optional[str] = None
    image_url: Optional[str] = None  # accepted for backward compatibility
    author: Optional[str] = None

    # Publish lifecycle
    is_published: Optional[bool] = True
    published_at: Optional[datetime] = None


# ✅ Update schema (request body for PUT/PATCH)
class BlogPostUpdate(SQLModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[str] = None

    excerpt: Optional[str] = None
    cover_image_url: Optional[str] = None
    image_url: Optional[str] = None
    author: Optional[str] = None

    is_published: Optional[bool] = None
    published_at: Optional[datetime] = None
