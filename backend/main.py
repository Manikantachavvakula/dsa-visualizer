# main.py
from fastapi import FastAPI, WebSocket, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from execute import docker_manager
from analyze import analyze_python
from database import save_snippet
import uvicorn
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str
    language: str = "python"

@app.post("/run")
async def run_code(code_request: CodeRequest, background_tasks: BackgroundTasks):
    try:
        # Analyze code if it's Python
        analysis_result = {}
        if code_request.language == "python":
            analysis_result = analyze_python(code_request.code)
        
        # Execute the code
        results = []
        async for line in docker_manager.execute_code(code_request.code, code_request.language):
            results.append(line)
        
        # Combine results
        execution_result = {
            "output": "".join(results),
            "analysis": analysis_result
        }
        
        # Save to database in the background
        background_tasks.add_task(
            save_snippet, 
            code_request.code, 
            code_request.language, 
            execution_result
        )
        
        return execution_result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/terminal")
async def websocket_terminal(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Wait for code execution request
            data = await websocket.receive_json()
            
            if "code" not in data or "language" not in data:
                await websocket.send_json({"error": "Invalid request format"})
                continue
                
            code = data["code"]
            language = data["language"]
            
            # Send initial connection message
            await websocket.send_json({"status": "started"})
            
            # Stream execution output
            try:
                async for line in docker_manager.execute_code(code, language):
                    await websocket.send_json({"output": line})
                
                # Send completion message
                await websocket.send_json({"status": "completed"})
                
                # Analyze if Python
                if language == "python":
                    analysis = analyze_python(code)
                    await websocket.send_json({"analysis": analysis})
            
            except Exception as e:
                await websocket.send_json({"error": str(e)})
                
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
    finally:
        # Ensure the connection is closed on error
        await websocket.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)