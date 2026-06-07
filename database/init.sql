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

INSERT INTO revenue_records (theme_name, session_time, income, expense, actual_attendance, reservation_count, remark)
VALUES
  ('冥府之路', DATE_SUB(NOW(), INTERVAL 2 HOUR), 1288.00, 150.00, 6, 6, '满场，玩家反响热烈'),
  ('时光回廊', DATE_SUB(NOW(), INTERVAL 5 HOUR), 988.00, 120.00, 5, 6, '1人临时取消'),
  ('深渊回响', DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1588.00, 200.00, 8, 8, '周末场，提前一周满员'),
  ('冥府之路', DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1288.00, 150.00, 6, 6, ''),
  ('时光回廊', DATE_SUB(CURDATE(), INTERVAL 2 DAY), 788.00, 120.00, 4, 5, '拼团场');
