import sys
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from db import init_db

# ✅ Load environment variables
load_dotenv()

# ✅ Add /src to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# ✅ Import routers
from routers import (
    analysis_short,
    analysis_medium,
    analysis_long,
    chart_data,
    admin,
    blog,
    auth  # 🔐 User authentication router
)

# ✅ Initialize app and DB
app = FastAPI()
init_db()

# ✅ Register routers
app.include_router(analysis_short.router)
app.include_router(analysis_medium.router)
app.include_router(analysis_long.router)
app.include_router(chart_data.router)
app.include_router(admin.router)
app.include_router(blog.router)
app.include_router(auth.router)  # ✅ Centralized auth routes

# ✅ CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔒 Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Static files (e.g. uploaded images)
app.mount(
    "/uploads",
    StaticFiles(directory=os.path.join(os.path.dirname(__file__), "uploads")),
    name="uploads"
)

# ✅ Health checks
@app.get("/")
def root():
    return {"message": "SmartStoxVest backend is live!"}


@app.get("/test-env")
def test_env():
    return {
        "ADMIN_TOKEN": os.getenv("ADMIN_TOKEN"),
        "ADMIN_PASSWORD": os.getenv("ADMIN_PASSWORD"),
        "JWT_SECRET": os.getenv("JWT_SECRET"),
    }
