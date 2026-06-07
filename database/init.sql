CREATE TABLE IF NOT EXISTS operation_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_name VARCHAR(120) NOT NULL,
  owner_name VARCHAR(80) NOT NULL,
  status VARCHAR(40) NOT NULL,
  metric VARCHAR(40) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS revenue_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  theme_name VARCHAR(120) NOT NULL COMMENT '主题名称',
  session_time DATETIME NOT NULL COMMENT '场次时间',
  income DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '收入',
  expense DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '支出',
  actual_attendance INT NOT NULL DEFAULT 0 COMMENT '实际上座人数',
  reservation_count INT NOT NULL DEFAULT 0 COMMENT '预约人数',
  remark VARCHAR(500) DEFAULT NULL COMMENT '备注',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_session_time (session_time),
  INDEX idx_theme_name (theme_name)
);

INSERT INTO operation_records (module_name, owner_name, status, metric)
VALUES ('主题房间与难度分级', '运营组', 'ready', '100%');


