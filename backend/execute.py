import docker
from fastapi import HTTPException

class DockerManager:
    def __init__(self):
        try:
            self.client = docker.from_env()
            # Verify connection works
            self.client.ping()
        except Exception as e:
            raise RuntimeError(f"Docker connection failed: {str(e)}")

    async def execute_code(self, code: str, language: str):
        language_config = {
            "python": {"image": "python:3.9", "cmd": ["python", "-c", code]},
            "java": {"image": "openjdk:17", "cmd": ["sh", "-c", f"echo '{code}' > Main.java && javac Main.java && java Main"]},
            "cpp": {"image": "gcc:latest", "cmd": ["sh", "-c", f"echo '{code}' > main.cpp && g++ main.cpp -o main && ./main"]}
        }

        try:
            container = self.client.containers.run(
                image=language_config[language]["image"],
                command=language_config[language]["cmd"],
                detach=True,
                mem_limit='100m',
                network_mode='none',
                remove=True  # Auto-remove after execution
            )
            
            # Stream logs in real-time
            for line in container.logs(stream=True):
                yield line.decode()
                
        except docker.errors.ContainerError as e:
            yield f"Execution error: {e.stderr.decode()}"
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# Singleton instance
docker_manager = DockerManager()