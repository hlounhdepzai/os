-- Tạo cơ sở dữ liệu cho HLounh OS
CREATE DATABASE IF NOT EXISTS hlounh_os;
USE hlounh_os;

-- Bảng người dùng
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Bảng tệp tin
CREATE TABLE IF NOT EXISTS files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT DEFAULT 0,
    file_type VARCHAR(50),
    mime_type VARCHAR(100),
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Bảng thư mục
CREATE TABLE IF NOT EXISTS directories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    directory_name VARCHAR(255) NOT NULL,
    directory_path VARCHAR(500) NOT NULL,
    parent_id INT,
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (parent_id) REFERENCES directories(id),
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Bảng cài đặt hệ thống
CREATE TABLE IF NOT EXISTS system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng ứng dụng đã cài đặt
CREATE TABLE IF NOT EXISTS installed_apps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_name VARCHAR(100) NOT NULL,
    app_version VARCHAR(20),
    app_path VARCHAR(500),
    install_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_system_app BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Bảng nhật ký hệ thống
CREATE TABLE IF NOT EXISTS system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_level ENUM('INFO', 'WARNING', 'ERROR', 'DEBUG') DEFAULT 'INFO',
    log_message TEXT NOT NULL,
    log_source VARCHAR(100),
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Chèn dữ liệu mẫu
INSERT INTO users (username, password_hash, email, full_name) VALUES
('admin', 'hashed_password_here', 'admin@hlounh-os.local', 'Quản trị viên'),
('user', 'hashed_password_here', 'user@hlounh-os.local', 'Người dùng');

INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('os_version', '1.0.0', 'string', 'Phiên bản hệ điều hành'),
('theme', 'default', 'string', 'Giao diện mặc định'),
('language', 'vi-VN', 'string', 'Ngôn ngữ hệ thống'),
('auto_save', 'true', 'boolean', 'Tự động lưu'),
('max_file_size', '104857600', 'number', 'Kích thước tệp tối đa (bytes)');

INSERT INTO installed_apps (app_name, app_version, app_path, is_system_app) VALUES
('File Manager', '1.0.0', '/system/apps/file-manager', TRUE),
('Text Editor', '1.0.0', '/system/apps/text-editor', TRUE),
('Calculator', '1.0.0', '/system/apps/calculator', TRUE),
('Settings', '1.0.0', '/system/apps/settings', TRUE),
('Terminal', '1.0.0', '/system/apps/terminal', TRUE),
('Image Viewer', '1.0.0', '/system/apps/image-viewer', TRUE),
('Music Player', '1.0.0', '/system/apps/music-player', TRUE);

INSERT INTO directories (directory_name, directory_path, owner_id) VALUES
('Documents', '/home/user/Documents', 2),
('Pictures', '/home/user/Pictures', 2),
('Music', '/home/user/Music', 2),
('Videos', '/home/user/Videos', 2),
('Downloads', '/home/user/Downloads', 2);

INSERT INTO system_logs (log_level, log_message, log_source) VALUES
('INFO', 'Hệ thống HLounh OS đã khởi động thành công', 'system'),
('INFO', 'Cơ sở dữ liệu đã được khởi tạo', 'database'),
('INFO', 'Các ứng dụng hệ thống đã được tải', 'app_loader');

-- Tạo chỉ mục để tối ưu hiệu suất
CREATE INDEX idx_files_owner ON files(owner_id);
CREATE INDEX idx_files_path ON files(file_path);
CREATE INDEX idx_directories_owner ON directories(owner_id);
CREATE INDEX idx_directories_parent ON directories(parent_id);
CREATE INDEX idx_logs_created ON system_logs(created_at);
CREATE INDEX idx_logs_level ON system_logs(log_level);

COMMIT;
