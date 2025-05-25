from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from jose import jwt
from datetime import datetime, timedelta
from starlette.config import Config

router = APIRouter()

# ✅ Load from .env
config = Config(".env")
SECRET_KEY = config("SECRET_KEY", cast=str, default="supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
ADMIN_PASSWORD = config("ADMIN_PASSWORD", cast=str, default="admin123")
ADMIN_EMAIL = config("ADMIN_EMAIL", cast=str, default="smartstoxvest@gmail.com")


class AdminLoginRequest(BaseModel):
    password: str


@router.post("/admin/login")
def admin_login(data: AdminLoginRequest):
    print("✅ Admin login route hit with:", data.password)  # LOG

    if data.password != ADMIN_PASSWORD:
        print("❌ Invalid admin password!")  # LOG
        raise HTTPException(status_code=401, detail="Invalid password")

    to_encode = {
        "sub": ADMIN_EMAIL,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    print("✅ Generated token:", token)  # LOG

    return {
    "access_token": token,
    "token_type": "bearer"
    }