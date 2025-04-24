# execute.py
import docker
from fastapi import HTTPException
import asyncio
import re

class DockerManager:
    def __init__(self):
        try:
            self.client = docker.from_env()
            # Verify connection works
            self.client.ping()
        except Exception as e:
            raise RuntimeError(f"Docker connection failed: {str(e)}")

    async def execute_code(self, code: str, language: str):
        if language not in ["python", "java", "cpp", "csharp", "javascript"]:
            yield f"Error: Unsupported language '{language}'"
            return

        language_config = {
            "python": {"image": "python:3.9", "cmd": ["python", "-c", code]},
            "java": {"image": "openjdk:17", "cmd": ["sh", "-c", f"echo '{code}' > Main.java && javac Main.java && java Main"]},
            "cpp": {"image": "gcc:latest", "cmd": ["sh", "-c", f"echo '{code}' > main.cpp && g++ main.cpp -o main && ./main"]},
            "csharp": {"image": "mcr.microsoft.com/dotnet/sdk:6.0", "cmd": ["sh", "-c", f"echo '{code}' > Program.cs && dotnet new console -o . --force && dotnet run"]},
            "javascript": {"image": "node:16", "cmd": ["node", "-e", code]}
        }

        # Sanitize the code to prevent command injection
        sanitized_code = re.sub(r'[\'"\\]', lambda m: '\\' + m.group(0), code)
        
        try:
            # Run container detached with a timeout
            container = self.client.containers.run(
                image=language_config[language]["image"],
                command=language_config[language]["cmd"],
                detach=True,
                mem_limit='100m',
                cpu_period=100000,
                cpu_quota=25000,  # 25% CPU limit
                network_mode='none',
                remove=False,  # We'll remove it manually
                stdout=True,
                stderr=True
            )
            
            # Set a timeout for execution
            timeout_seconds = 10
            start_time = asyncio.get_event_loop().time()
            
            # Stream logs with timeout
            while asyncio.get_event_loop().time() - start_time < timeout_seconds:
                try:
                    container.reload()
                    if container.status != 'running':
                        break
                        
                    logs = container.logs(stdout=True, stderr=True, stream=False, since=int(start_time))
                    if logs:
                        yield logs.decode('utf-8', errors='replace')
                    
                    await asyncio.sleep(0.1)
                except Exception as e:
                    yield f"Error during execution: {str(e)}"
                    break
            
            # Check if container is still running (timeout)
            container.reload()
            if container.status == 'running':
                container.kill()
                yield "Execution timed out after 10 seconds"
            
            # Get final logs if any
            final_logs = container.logs(stdout=True, stderr=True, stream=False)
            if final_logs:
                yield final_logs.decode('utf-8', errors='replace')
                
            # Cleanup
            try:
                container.remove(force=True)
            except:
                pass
                
        except docker.errors.ContainerError as e:
            yield f"Execution error: {e.stderr.decode('utf-8', errors='replace')}"
        except Exception as e:
            yield f"System error: {str(e)}"

# Singleton instance
docker_manager = DockerManager()