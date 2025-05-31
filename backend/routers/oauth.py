from fastapi import APIRouter, Depends
from pydantic import BaseModel
from starlette.responses import JSONResponse
from starlette.config import Config
from sqlmodel import Session, select
from models.user import User  # ✅ make sure this path matches your project
from db import get_session    # ✅ adjust based on your project setup
from jose import jwt as jose_jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

config_data = {
    "GOOGLE_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID"),
    "GOOGLE_CLIENT_SECRET": os.getenv("GOOGLE_CLIENT_SECRET"),
    "SECRET_KEY": os.getenv("SECRET_KEY", "default_secret"),
}


class GoogleToken(BaseModel):
    credential: str

def create_access_token(data: dict, expires_delta: timedelta = None):
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=30))
    data.update({"exp": expire})
    token = jose_jwt.encode(data, config_data["SECRET_KEY"], algorithm="HS256")
    return token

@router.post("/auth/google/callback")
async def auth_google_callback(data: GoogleToken, session: Session = Depends(get_session)):
    try:
        user_info = jose_jwt.decode(data.credential, options={"verify_signature": False})
        user_email = user_info.get("email")

        if not user_email:
            return JSONResponse({"error": "Email not found"}, status_code=400)

        # Lookup user
        user = session.exec(select(User).where(User.email == user_email)).first()

        # Create if doesn't exist
        if not user:
            user = User(email=user_email, hashed_password="")  # No password for Google auth
            session.add(user)
            session.commit()
            session.refresh(user)

        token = create_access_token({"sub": user.email})
        return JSONResponse({"token": token, "email": user.email})

    except Exception as e:
        print("[OAuth Error]", str(e))
        return JSONResponse({"error": "OAuth failed"}, status_code=400)
