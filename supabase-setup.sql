-- ============================================
-- 五险一金计算器 - Supabase 数据库配置脚本
-- ============================================
-- 请在 Supabase 的 SQL Editor 中执行此脚本
-- ============================================

-- 1. 创建 cities 表（城市标准表）
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  base_min INTEGER NOT NULL,
  base_max INTEGER NOT NULL,
  rate FLOAT NOT NULL
);

-- 2. 创建 salaries 表（员工工资表）
CREATE TABLE IF NOT EXISTS salaries (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  month TEXT NOT NULL,
  salary_amount INTEGER NOT NULL
);

-- 3. 创建 results 表（计算结果表）
CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  employee_name TEXT NOT NULL,
  city_name TEXT NOT NULL,
  avg_salary FLOAT NOT NULL,
  contribution_base FLOAT NOT NULL,
  company_fee FLOAT NOT NULL,
  calculated_at TIMESTAMP DEFAULT NOW()
);

-- 4. 启用 RLS (Row Level Security)
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- 5. 设置公开访问策略（允许任何人读写）
-- Cities 表策略
CREATE POLICY "Allow public access to cities"
ON cities FOR ALL
USING (true)
WITH CHECK (true);

-- Salaries 表策略
CREATE POLICY "Allow public access to salaries"
ON salaries FOR ALL
USING (true)
WITH CHECK (true);

-- Results 表策略
CREATE POLICY "Allow public access to results"
ON results FOR ALL
USING (true)
WITH CHECK (true);

-- 6. 可选：插入示例数据（佛山2024标准）
INSERT INTO cities (city_name, year, base_min, base_max, rate)
VALUES ('佛山', '2024', 4546, 26421, 0.14)
ON CONFLICT DO NOTHING;

-- 7. 验证表创建
SELECT 'Cities table created' as status, COUNT(*) as count FROM cities;
SELECT 'Salaries table created' as status, COUNT(*) as count FROM salaries;
SELECT 'Results table created' as status, COUNT(*) as count FROM results;
