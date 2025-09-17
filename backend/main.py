import os
import sys
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from db import init_db

# ✅ Load environment variables first
load_dotenv()

# (Optional) If you truly need to modify path, do it before importing routers
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# ✅ Import routers once
from routers import (
    analysis_short,
    analysis_medium,
    analysis_long,
    chart_data,
    admin,
    blog,     # includes its own prefix="/api" inside blog.py
    auth,
    oauth,
)

app = FastAPI()
init_db()

# ✅ Register routers (include each ONCE)
app.include_router(analysis_short.router)
app.include_router(analysis_medium.router)
app.include_router(analysis_long.router)
app.include_router(chart_data.router)
app.include_router(admin.router)
app.include_router(blog.router)   # <-- blog.py already has prefix="/api"
app.include_router(auth.router)
app.include_router(oauth.router)

# ✅ CORS (tighten in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # e.g., ["http://localhost:5173", "https://smartstoxvest.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Static files (uploaded images)
app.mount(
    "/uploads",
    StaticFiles(directory=os.path.join(os.path.dirname(__file__), "uploads")),
    name="uploads",
)

# ✅ Health checks
@app.get("/")
def root():
    return {"message": "SmartStoxVest backend is live!"}

@app.get("/healthz")
def healthz():
    return {"status": "ok"}
