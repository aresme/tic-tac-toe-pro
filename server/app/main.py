from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, users
from app.websocket import manager

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tic-Tac-Toe Pro API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])

# WebSocket Mount
@app.websocket("/ws/game/{room_id}")
async def websocket_endpoint(websocket, room_id: str):
    await manager.connect(room_id, websocket)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Tic-Tac-Toe API running"}
