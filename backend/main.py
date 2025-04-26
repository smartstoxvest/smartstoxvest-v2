import sys
import os

# 👇 Adds /src to the Python path so "backend.*" imports work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analysis_short, analysis_medium, analysis_long  # ✅ Import routers

# ✅ Define the FastAPI app FIRST
app = FastAPI()

# ✅ Add routers AFTER app is created
app.include_router(analysis_short.router)
app.include_router(analysis_medium.router)
app.include_router(analysis_long.router)
app.include_router(lstm.router)  # 👈 Add this line

# ✅ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "SmartStoxVest backend is live!"}
