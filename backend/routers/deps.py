# backend/deps.py
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from starlette.config import Config

config = Config(".env")
SECRET_KEY = config("SECRET_KEY", cast=str)
ALGORITHM = "HS256"
ADMIN_EMAIL = config("ADMIN_EMAIL", cast=str)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_admin(token: str = Depends(oauth2_scheme)) -> str:
    try:
        print("🔐 Received Token:", token)

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("✅ Decoded Payload:", payload)

        email = payload.get("sub")
        print("📧 Extracted email:", email)
        print("🎯 Expected admin email from .env:", ADMIN_EMAIL)

        if email != ADMIN_EMAIL:
            print("❌ Email does not match admin. Access denied.")
            raise HTTPException(status_code=401, detail="Not an admin")

        print("✅ Admin verified. Access granted.")
        return email
    except JWTError as e:
        print("❌ JWT Error occurred:", e)
        raise HTTPException(status_code=401, detail="Invalid token")

