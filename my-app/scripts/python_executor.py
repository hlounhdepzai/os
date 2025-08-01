import sys
import io
import contextlib
import traceback
import ast
import operator
import math
import random
import json
from datetime import datetime

class PythonExecutor:
    """Lớp thực thi code Python an toàn"""
    
    def __init__(self):
        # Các hàm và module được phép sử dụng
        self.safe_builtins = {
            'print': print,
            'len': len,
            'str': str,
            'int': int,
            'float': float,
            'bool': bool,
            'list': list,
            'dict': dict,
            'tuple': tuple,
            'set': set,
            'range': range,
            'enumerate': enumerate,
            'zip': zip,
            'map': map,
            'filter': filter,
            'sum': sum,
            'min': min,
            'max': max,
            'abs': abs,
            'round': round,
            'sorted': sorted,
            'reversed': reversed,
            'type': type,
            'isinstance': isinstance,
            'hasattr': hasattr,
            'getattr': getattr,
            'setattr': setattr,
            'dir': dir,
            'help': help,
        }
        
        # Các module an toàn
        self.safe_modules = {
            'math': math,
            'random': random,
            'json': json,
            'datetime': datetime,
        }
    
    def execute_code(self, code, timeout=10):
        """Thực thi code Python với các hạn chế an toàn"""
        
        # Tạo namespace an toàn
        safe_globals = {
            '__builtins__': self.safe_builtins,
            **self.safe_modules
        }
        
        # Capture output
        output_buffer = io.StringIO()
        error_buffer = io.StringIO()
        
        try:
            # Kiểm tra syntax
            ast.parse(code)
            
            # Redirect stdout và stderr
            with contextlib.redirect_stdout(output_buffer), \
                 contextlib.redirect_stderr(error_buffer):
                
                # Thực thi code
                exec(code, safe_globals, {})
            
            output = output_buffer.getvalue()
            error = error_buffer.getvalue()
            
            if error:
                return {
                    'success': False,
                    'output': output,
                    'error': error
                }
            
            return {
                'success': True,
                'output': output,
                'error': None
            }
            
        except SyntaxError as e:
            return {
                'success': False,
                'output': '',
                'error': f'Lỗi cú pháp: {str(e)}'
            }
        except Exception as e:
            return {
                'success': False,
                'output': output_buffer.getvalue(),
                'error': f'Lỗi thực thi: {str(e)}\n{traceback.format_exc()}'
            }

def run_python_code(code):
    """Hàm chính để chạy code Python"""
    executor = PythonExecutor()
    result = executor.execute_code(code)
    
    print("=== KẾT QUỢ THỰC THI PYTHON ===")
    
    if result['success']:
        print("✅ Thực thi thành công!")
        if result['output']:
            print("\n📤 OUTPUT:")
            print(result['output'])
        else:
            print("\n📝 Code chạy thành công nhưng không có output")
    else:
        print("❌ Có lỗi xảy ra!")
        if result['output']:
            print("\n📤 OUTPUT:")
            print(result['output'])
        if result['error']:
            print("\n🚨 ERROR:")
            print(result['error'])

# Ví dụ sử dụng
if __name__ == "__main__":
    # Test code cơ bản
    test_codes = [
        # Code đơn giản
        '''
print("Xin chào HLounh OS!")
for i in range(5):
    print(f"Số {i}")
        ''',
        
        # Code với hàm
        '''
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print("Dãy Fibonacci:")
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
        ''',
        
        # Code với class
        '''
class Calculator:
    def __init__(self):
        self.history = []
    
    def add(self, a, b):
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result
    
    def get_history(self):
        return self.history

calc = Calculator()
print(calc.add(5, 3))
print(calc.add(10, 7))
print("Lịch sử:", calc.get_history())
        ''',
        
        # Code với xử lý lỗi
        '''
def safe_divide(a, b):
    try:
        result = a / b
        return f"{a} ÷ {b} = {result}"
    except ZeroDivisionError:
        return "Không thể chia cho 0!"
    except Exception as e:
        return f"Lỗi: {e}"

print(safe_divide(10, 2))
print(safe_divide(10, 0))
print(safe_divide("abc", 2))
        '''
    ]
    
    for i, code in enumerate(test_codes, 1):
        print(f"\n{'='*50}")
        print(f"TEST {i}:")
        print('='*50)
        run_python_code(code)
