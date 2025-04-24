# analyze.py
import ast
import re
from typing import Dict

def analyze_python(code: str) -> Dict:
    try:
        tree = ast.parse(code)
        
        # Initialize counters
        stats = {
            "loops": 0,
            "conditionals": 0,
            "recursive_calls": 0,
            "function_defs": 0,
            "variables": set(),
            "nested_loops": 0
        }
        
        # Track function names for recursive call detection
        function_names = set()
        current_loop_depth = 0
        
        class CodeVisitor(ast.NodeVisitor):
            def visit_For(self, node):
                nonlocal current_loop_depth
                stats["loops"] += 1
                current_loop_depth += 1
                if current_loop_depth > 1:
                    stats["nested_loops"] += 1
                self.generic_visit(node)
                current_loop_depth -= 1
                
            def visit_While(self, node):
                nonlocal current_loop_depth
                stats["loops"] += 1
                current_loop_depth += 1
                if current_loop_depth > 1:
                    stats["nested_loops"] += 1
                self.generic_visit(node)
                current_loop_depth -= 1
                
            def visit_If(self, node):
                stats["conditionals"] += 1
                self.generic_visit(node)
                
            def visit_FunctionDef(self, node):
                stats["function_defs"] += 1
                function_names.add(node.name)
                self.generic_visit(node)
                
            def visit_Call(self, node):
                if isinstance(node.func, ast.Name) and node.func.id in function_names:
                    stats["recursive_calls"] += 1
                self.generic_visit(node)
                
            def visit_Name(self, node):
                if isinstance(node.ctx, ast.Store):
                    stats["variables"].add(node.id)
                self.generic_visit(node)
                
        visitor = CodeVisitor()
        visitor.visit(tree)
        
        # Convert variables set to list for JSON serialization
        stats["variables"] = list(stats["variables"])
        
        # Determine complexity
        complexity = "O(1)"
        if stats["nested_loops"] > 0:
            complexity = "O(n²)"
        elif stats["loops"] > 0:
            complexity = "O(n)"
        elif stats["recursive_calls"] > 0:
            # Check if it's a divide-and-conquer algorithm
            if re.search(r'\/\s*2|>>\s*1', code):
                complexity = "O(log n)"
            else:
                complexity = "O(2^n)"  # Exponential for most recursive functions
                
        return {
            "complexity": complexity,
            "metrics": stats
        }
    except Exception as e:
        return {"error": str(e)}