from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models.user import User
from app.routes.auth import get_current_user

router = APIRouter()

@router.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "rating": current_user.rating,
        "wins": current_user.wins,
        "losses": current_user.losses,
        "draws": current_user.draws,
        "avatar": current_user.avatar
    }

@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).order_by(desc(User.rating)).limit(10).all()
    return [{"username": u.username, "rating": u.rating} for u in users]
