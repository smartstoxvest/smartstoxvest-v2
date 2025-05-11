from fastapi import APIRouter, HTTPException, Header, Depends, UploadFile, File
from fastapi.responses import FileResponse
from sqlmodel import select, Session
from typing import List, Optional
from datetime import datetime
import os

from models.blog_post import BlogPost, BlogPostCreate
from db import get_session

router = APIRouter()
ADMIN_TOKEN = "my-secret-token"  # Replace with environment variable in production

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


# 🧾 Get all posts
@router.get("/api/posts", response_model=List[BlogPost])
def get_all_posts(session: Session = Depends(get_session)):
    return session.exec(select(BlogPost).order_by(BlogPost.created_at.desc())).all()


# 🧾 Get a single post by slug
@router.get("/api/posts/{slug}", response_model=BlogPost)
def get_post_by_slug(slug: str, session: Session = Depends(get_session)):
    post = session.exec(select(BlogPost).where(BlogPost.slug == slug)).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


# ✏️ Update a post
@router.put("/api/posts/{slug}", response_model=BlogPost)
def update_post(
    slug: str,
    updated: BlogPost,
    authorization: Optional[str] = Header(None),
    session: Session = Depends(get_session),
):
    if authorization != f"Bearer {ADMIN_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    post = session.exec(select(BlogPost).where(BlogPost.slug == slug)).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.title = updated.title
    post.slug = updated.slug
    post.content = updated.content
    post.tags = updated.tags
    post.created_at = datetime.utcnow()  # Optional: update timestamp

    session.add(post)
    session.commit()
    session.refresh(post)
    return post


# 🖼 Upload an image
@router.post("/api/upload-image")
def upload_image(file: UploadFile = File(...)):
    filename = file.filename
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        buffer.write(file.file.read())

    return {"url": f"/uploads/{filename}"}


# ➕ Create a new post
@router.post("/api/posts", response_model=BlogPost)
def create_post(
    post: BlogPostCreate,
    authorization: Optional[str] = Header(None),
    session: Session = Depends(get_session),
):
    if authorization != f"Bearer {ADMIN_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    existing = session.exec(select(BlogPost).where(BlogPost.slug == post.slug)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")

    new_post = BlogPost(
        title=post.title,
        slug=post.slug,
        content=post.content,
        tags=post.tags,
        author=post.author or "SmartStoxVest Team",
    )

    session.add(new_post)
    session.commit()
    session.refresh(new_post)
    return new_post


# 🔁 Get related posts by matching the first tag
@router.get("/api/posts/related/{slug}", response_model=List[BlogPost])
def get_related_posts(slug: str, session: Session = Depends(get_session)):
    current = session.exec(select(BlogPost).where(BlogPost.slug == slug)).first()
    if not current:
        raise HTTPException(status_code=404, detail="Post not found")

    if not current.tags:
        return []

    # Match by the first tag (simple logic)
    first_tag = current.tags.split(",")[0].strip()

    related = session.exec(
        select(BlogPost)
        .where(BlogPost.slug != slug)
        .where(BlogPost.tags.contains(first_tag))
        .limit(3)
    ).all()

    return related
