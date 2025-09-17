from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Query
from sqlmodel import select, Session
from typing import List, Optional
from datetime import datetime
import os
import re
from html import unescape

from models.blog_post import BlogPost, BlogPostCreate, BlogPostUpdate
from db import get_session
from .deps import get_current_admin  # ✅ secure admin routes

# ✅ Single source of truth for the /api prefix
router = APIRouter(prefix="/api")

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ---------- helpers ----------

def _excerpt_from_html(html: Optional[str], length: int = 180) -> str:
    """Crudely strip tags and collapse whitespace for a short summary."""
    if not html:
        return ""
    text = re.sub(r"<[^>]+>", " ", html)
    text = re.sub(r"\s+", " ", unescape(text)).strip()
    return (text[:length] + "…") if len(text) > length else text

# ---------- public routes ----------

# 🧾 Get posts (with filters, pagination). Defaults to published only.
@router.get("/posts", response_model=List[BlogPost])
def get_all_posts(
    session: Session = Depends(get_session),
    published_only: bool = True,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    tag: Optional[str] = None,
    q: Optional[str] = None,
):
    stmt = select(BlogPost)
    if published_only:
        stmt = stmt.where(BlogPost.is_published == True)
    if tag:
        stmt = stmt.where(BlogPost.tags.contains(tag))
    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            (BlogPost.title.ilike(like))
            | (BlogPost.content.ilike(like))
            | (BlogPost.tags.ilike(like))
        )

    stmt = stmt.order_by(BlogPost.published_at.desc()).limit(limit).offset(offset)
    return session.exec(stmt).all()

# 🧾 Minimal "recent posts" for homepage cards
@router.get("/posts/recent")
def get_recent_posts(
    limit: int = Query(3, ge=1, le=12),
    session: Session = Depends(get_session),
):
    rows = session.exec(
        select(BlogPost)
        .where(BlogPost.is_published == True)
        .order_by(BlogPost.published_at.desc())
        .limit(limit)
    ).all()

    return [
        {
            "id": r.id,
            "title": r.title,
            "slug": r.slug,
            "excerpt": r.excerpt or _excerpt_from_html(r.content),
            "cover_image_url": r.cover_image_url or r.image_url,
            "published_at": r.published_at.isoformat() if r.published_at else None,
            "author": r.author,
        }
        for r in rows
    ]

# 🧾 Get a single post by slug
@router.get("/posts/{slug}", response_model=BlogPost)
def get_post_by_slug(slug: str, session: Session = Depends(get_session)):
    post = session.exec(select(BlogPost).where(BlogPost.slug == slug)).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

# 🔁 Related posts by first tag (published only, newest first)
@router.get("/posts/related/{slug}", response_model=List[BlogPost])
def get_related_posts(slug: str, session: Session = Depends(get_session)):
    current = session.exec(select(BlogPost).where(BlogPost.slug == slug)).first()
    if not current:
        raise HTTPException(status_code=404, detail="Post not found")

    if not current.tags:
        return []

    first_tag = current.tags.split(",")[0].strip()

    related = session.exec(
        select(BlogPost)
        .where(BlogPost.slug != slug)
        .where(BlogPost.is_published == True)
        .where(BlogPost.tags.contains(first_tag))
        .order_by(BlogPost.published_at.desc())
        .limit(3)
    ).all()

    return related

# ---------- admin routes ----------

# ➕ Create a new post
@router.post("/posts", response_model=BlogPost)
def create_post(
    post: BlogPostCreate,
    session: Session = Depends(get_session),
    current_admin: str = Depends(get_current_admin),  # ✅ requires valid admin JWT
):
    existing = session.exec(select(BlogPost).where(BlogPost.slug == post.slug)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")

    new_post = BlogPost(
        title=post.title,
        slug=post.slug,
        content=post.content,
        tags=post.tags,
        author=post.author or "SmartStoxVest Team",
        excerpt=post.excerpt or _excerpt_from_html(post.content),
        cover_image_url=post.cover_image_url or post.image_url,
        image_url=post.image_url,
        is_published=True if post.is_published is None else post.is_published,
        published_at=post.published_at or datetime.utcnow(),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    session.add(new_post)
    session.commit()
    session.refresh(new_post)
    return new_post

# ✏️ Update a post (partial, does NOT touch created_at)
@router.put("/posts/{slug}", response_model=BlogPost)
def update_post(
    slug: str,
    updated: BlogPostUpdate,
    session: Session = Depends(get_session),
    admin=Depends(get_current_admin),  # ✅ check admin token
):
    post = session.exec(select(BlogPost).where(BlogPost.slug == slug)).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if updated.title is not None:
        post.title = updated.title
    if updated.slug is not None:
        if updated.slug != slug:
            clash = session.exec(select(BlogPost).where(BlogPost.slug == updated.slug)).first()
            if clash:
                raise HTTPException(status_code=400, detail="Slug already exists")
        post.slug = updated.slug
    if updated.content is not None:
        post.content = updated.content
    if updated.tags is not None:
        post.tags = updated.tags
    if updated.author is not None:
        post.author = updated.author
    if updated.cover_image_url is not None:
        post.cover_image_url = updated.cover_image_url
    if updated.image_url is not None:
        post.image_url = updated.image_url

    if updated.excerpt is not None:
        post.excerpt = updated.excerpt
    elif updated.content is not None and (not post.excerpt):
        post.excerpt = _excerpt_from_html(post.content)

    if updated.is_published is not None:
        post.is_published = updated.is_published
    if updated.published_at is not None:
        post.published_at = updated.published_at

    post.updated_at = datetime.utcnow()

    session.add(post)
    session.commit()
    session.refresh(post)
    return post

# 🖼 Upload an image (returns public URL path)
@router.post("/upload-image")
def upload_image(file: UploadFile = File(...)):
    filename = file.filename
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        buffer.write(file.file.read())

    return {"url": f"/uploads/{filename}"}
