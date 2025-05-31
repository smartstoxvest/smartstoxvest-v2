from sqlmodel import Session, select
from db import engine
from models.user import User
from passlib.hash import bcrypt

def seed_users():
    users = [
        User(email="demo1@email.com", hashed_password=bcrypt.hash("demo123"), provider="email"),
        User(email="demo2@email.com", hashed_password=bcrypt.hash("demo456"), provider="email"),
        User(email="googleuser@email.com", hashed_password="", provider="google"),
    ]

    with Session(engine) as session:
        for user in users:
            existing = session.exec(
                select(User).where(User.email == user.email)
            ).first()

            if not existing:
                session.add(user)
        session.commit()

if __name__ == "__main__":
    seed_users()
    print("✅ Users seeded successfully!")
