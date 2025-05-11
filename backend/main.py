import sys
import os
from db import init_db
from fastapi.staticfiles import StaticFiles


# 👇 Adds /src to the Python path so "backend.*" imports work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ Import routers AFTER setting path
#from backend.routers import analysis_short, analysis_medium, analysis_long, chart_data
from routers import analysis_short, analysis_medium, analysis_long, chart_data

from routers import blog  # 👈 Adjust path if needed

# ✅ Define FastAPI app FIRST
app = FastAPI()

init_db()

# ✅ Add routers AFTER app is defined
app.include_router(analysis_short.router)
app.include_router(analysis_medium.router)
app.include_router(analysis_long.router)
app.include_router(chart_data.router)  # ✅ move this here
app.include_router(blog.router)

# ✅ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔒 restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "SmartStoxVest backend is live!"}
    

    # ✅ Serve uploaded images

app.mount("/uploads", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "uploads")), name="uploads")
