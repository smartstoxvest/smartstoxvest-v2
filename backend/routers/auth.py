# backend/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.hash import bcrypt
import os
from starlette.config import Config
from typing import List

from db import get_session
from models import User  # SQLModel User
from services.email import send_reset_email  # Assumes you've created services/email.py

router = APIRouter()

# Config
config = Config(".env")
SECRET_KEY = config("SECRET_KEY", cast=str)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

EMAIL_FROM = config("EMAIL_FROM", cast=str)
FRONTEND_URL = config("FRONTEND_URL", cast=str)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Pydantic Schemas
class UserCreate(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserOut(BaseModel):
    email: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

# Signup Route
@router.post("/auth/signup")
def signup(user: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.email == user.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = bcrypt.hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_pw)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    print("🔥 User added:", new_user.email)

    return {"message": "User created successfully"}

# Login Route
@router.post("/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not bcrypt.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = jwt.encode({
        "sub": user.email,
        "exp": datetime.utcnow() + access_token_expires
    }, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": access_token, "token_type": "bearer"}

# Get Current User
@router.get("/auth/me", response_model=UserOut)
def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = session.exec(select(User).where(User.email == email)).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return {"email": user.email}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Get All Users (Admin Only)
@router.get("/auth/users", response_model=List[UserOut])
def get_all_users(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")

        if email != config("ADMIN_EMAIL", cast=str):
            raise HTTPException(status_code=403, detail="Admins only")

        users = session.exec(select(User)).all()
        return [{"email": u.email} for u in users]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Password Reset Request
@router.post("/auth/request-reset")
def request_password_reset(data: PasswordResetRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == data.email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token = jwt.encode(
        {"sub": user.email, "exp": datetime.utcnow() + timedelta(minutes=15)},
        SECRET_KEY, algorithm=ALGORITHM
    )

    if send_reset_email(user.email, token):
        return {"message": "Reset link sent to your email"}
    else:
        raise HTTPException(status_code=500, detail="Failed to send email")

# Password Reset Confirm
@router.post("/auth/reset-password")
def reset_password(data: PasswordResetConfirm, session: Session = Depends(get_session)):
    try:
        payload = jwt.decode(data.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = bcrypt.hash(data.new_password)
    session.add(user)
    session.commit()
    return {"message": "Password reset successful"}
