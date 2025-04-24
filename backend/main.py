from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from execute import execute_code
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/run")
async def run_code(code: str, language: str = "python"):
    return await execute_code(code, language)

@app.websocket("/terminal")
async def websocket_terminal(websocket: WebSocket):
    await websocket.accept()
    while True:
        input_data = await websocket.receive_text()
        await websocket.send_text(f"Executed: {input_data}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)