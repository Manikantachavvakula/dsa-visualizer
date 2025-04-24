import ast
from typing import Dict

def analyze_python(code: str) -> Dict:
    try:
        tree = ast.parse(code)
        complexity = 1
        
        # Count loops and recursive calls
        for node in ast.walk(tree):
            if isinstance(node, (ast.For, ast.While, ast.AsyncFor)):
                complexity += 1
            elif isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name) and node.func.id in code:
                    complexity += 1

        big_o = "O(1)" if complexity == 1 else "O(n)" if complexity <= 5 else "O(n²)"
        
        return {
            "complexity": big_o,
            "metrics": {"loops": complexity - 1}
        }
    except Exception as e:
        return {"error": str(e)}