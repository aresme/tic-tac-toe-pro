from fastapi import WebSocket
from typing import Dict, List

class ConnectionManager:
    def __init__(self):
        # Maps room_id -> list of active WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}
        
    async def connect(self, room: str, websocket: WebSocket):
        await websocket.accept()
        if room not in self.active_connections:
            self.active_connections[room] = []
        self.active_connections[room].append(websocket)
        
        # Listen for messages in this connection
        try:
            while True:
                data = await websocket.receive_json()
                # Broadcast the received data to all other players in the room
                await self.broadcast(room, data)
        except Exception as e:
            self.disconnect(room, websocket)
            
    def disconnect(self, room: str, websocket: WebSocket):
        if room in self.active_connections:
            if websocket in self.active_connections[room]:
                self.active_connections[room].remove(websocket)
            if len(self.active_connections[room]) == 0:
                del self.active_connections[room]
                
    async def broadcast(self, room: str, message: dict):
        if room in self.active_connections:
            for connection in self.active_connections[room]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = ConnectionManager()
