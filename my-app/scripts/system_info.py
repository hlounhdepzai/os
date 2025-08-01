import platform
import psutil
import json
from datetime import datetime

def get_system_info():
    """Thu thập thông tin hệ thống"""
    info = {
        "os": platform.system(),
        "os_version": platform.version(),
        "architecture": platform.architecture()[0],
        "processor": platform.processor(),
        "hostname": platform.node(),
        "python_version": platform.python_version(),
        "memory": {
            "total": psutil.virtual_memory().total,
            "available": psutil.virtual_memory().available,
            "used": psutil.virtual_memory().used,
            "percentage": psutil.virtual_memory().percent
        },
        "disk": {
            "total": psutil.disk_usage('/').total,
            "used": psutil.disk_usage('/').used,
            "free": psutil.disk_usage('/').free
        },
        "cpu_count": psutil.cpu_count(),
        "cpu_usage": psutil.cpu_percent(interval=1),
        "boot_time": datetime.fromtimestamp(psutil.boot_time()).isoformat(),
        "current_time": datetime.now().isoformat()
    }
    return info

def format_bytes(bytes_value):
    """Chuyển đổi bytes thành định dạng dễ đọc"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if bytes_value < 1024.0:
            return f"{bytes_value:.2f} {unit}"
        bytes_value /= 1024.0
    return f"{bytes_value:.2f} PB"

if __name__ == "__main__":
    system_info = get_system_info()
    
    print("=== THÔNG TIN HỆ THỐNG HLOUNH OS ===")
    print(f"Hệ điều hành: {system_info['os']}")
    print(f"Phiên bản: {system_info['os_version']}")
    print(f"Kiến trúc: {system_info['architecture']}")
    print(f"Bộ xử lý: {system_info['processor']}")
    print(f"Tên máy: {system_info['hostname']}")
    print(f"Python: {system_info['python_version']}")
    
    print("\n=== BỘ NHỚ ===")
    print(f"Tổng: {format_bytes(system_info['memory']['total'])}")
    print(f"Đã sử dụng: {format_bytes(system_info['memory']['used'])}")
    print(f"Khả dụng: {format_bytes(system_info['memory']['available'])}")
    print(f"Phần trăm sử dụng: {system_info['memory']['percentage']}%")
    
    print("\n=== Ổ CỨNG ===")
    print(f"Tổng: {format_bytes(system_info['disk']['total'])}")
    print(f"Đã sử dụng: {format_bytes(system_info['disk']['used'])}")
    print(f"Còn trống: {format_bytes(system_info['disk']['free'])}")
    
    print("\n=== CPU ===")
    print(f"Số lõi: {system_info['cpu_count']}")
    print(f"Sử dụng CPU: {system_info['cpu_usage']}%")
    
    print(f"\nThời gian khởi động: {system_info['boot_time']}")
    print(f"Thời gian hiện tại: {system_info['current_time']}")
