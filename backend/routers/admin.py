from fastapi import APIRouter, HTTPException, Request
import os

router = APIRouter()

@router.post("/admin/login")
async def admin_login(request: Request):
    body = await request.json()
    if body.get("password") == os.getenv("ADMIN_PASSWORD"):
        return {"token": os.getenv("ADMIN_TOKEN")}
    raise HTTPException(status_code=401, detail="Unauthorized")
